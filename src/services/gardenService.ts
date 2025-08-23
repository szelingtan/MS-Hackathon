import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  increment,
  FieldValue,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GardenLayout, PlantInstance } from '@/types/garden';

// Extended garden layout for Firestore
interface FirestoreGardenLayout extends Omit<GardenLayout, 'lastModified'> {
  lastModified: FieldValue | Timestamp; // Firestore timestamp
  isPublic?: boolean;
  gardenName?: string;
  description?: string;
  likes?: number;
  createdAt?: FieldValue | Timestamp; // Firestore timestamp
}

// User garden data structure
interface UserGardenData {
  currentGarden: FirestoreGardenLayout;
  ownedPlants: string[];
  ownedAccessories: string[];
  ownedThemes: string[];
  waterDrops: number;
  lastDaily: string; // ISO date string for daily reset
  completedChallenges: {
    [challengeId: string]: {
      completed: boolean;
      claimed: boolean;
      lastClaimDate: string;
    }
  };
}

export class GardenService {
  
  // Save user's garden layout to Firestore
  static async saveGarden(userId: string, garden: GardenLayout): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const firestoreGarden: Partial<FirestoreGardenLayout> = {
        ...garden,
        lastModified: serverTimestamp()
      };
      
      await updateDoc(gardenRef, {
        currentGarden: firestoreGarden
      });
    } catch (error) {
      console.error('Error saving garden:', error);
      throw error;
    }
  }

  // Load user's garden from Firestore
  static async loadGarden(userId: string): Promise<GardenLayout | null> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (gardenSnap.exists()) {
        const data = gardenSnap.data() as UserGardenData;
        if (data.currentGarden) {
          return {
            ...data.currentGarden,
            lastModified: (data.currentGarden.lastModified as Timestamp)?.toDate() || new Date()
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading garden:', error);
      return null;
    }
  }

  // Initialize user garden data - Sync initial water amount from donors
  static async initializeUserGarden(userId: string): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (!gardenSnap.exists()) {
        // Get actual water amount from donors collection
        const donorRef = doc(db, 'donors', userId);
        const donorSnap = await getDoc(donorRef);
        
        let initialWaterDrops = 100; // Default fallback
        
        if (donorSnap.exists()) {
          const donorData = donorSnap.data();
          initialWaterDrops = donorData.water_amount || 100;
        }
        
        const defaultGardenData: UserGardenData = {
          currentGarden: {
            id: 'default',
            userId,
            plants: [
              {
                id: 'plant-1',
                plantId: 'seedling',
                position: { x: 400, y: 330 }, // Bottom center position of 800x400 canvas
                size: 1.0,
                rotation: 0,
                layer: 1,
                accessories: [] // No accessories
              }
            ],
            accessories: [], // Add missing accessories property
            backgroundTheme: 'noon',
            canvas: { width: 800, height: 400 }, // Match actual canvas size
            lastModified: serverTimestamp(),
            isPublic: false,
            likes: 0,
            createdAt: serverTimestamp()
          },
          ownedPlants: ['seedling', 'grass'], // Default free plants
          ownedAccessories: ['crown'], // Default free accessory
          ownedThemes: ['morning', 'noon'], // Default free themes
          waterDrops: initialWaterDrops, // Use actual water amount from donors
          lastDaily: new Date().toISOString().split('T')[0], // Today's date
          completedChallenges: {}
        };

        await setDoc(gardenRef, defaultGardenData);
      } else {
        // If garden exists, sync water amount with donors collection
        await this.syncWaterAmount(userId);
      }
    } catch (error) {
      console.error('Error initializing garden:', error);
      throw error;
    }
  }

  // Purchase plant/accessory/theme - Sync with donors collection
  static async purchaseItem(
    userId: string, 
    itemId: string, 
    cost: number, 
    type: 'plant' | 'accessory' | 'theme'
  ): Promise<boolean> {
    try {
      // Get user garden data
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (!gardenSnap.exists()) return false;
      
      const gardenData = gardenSnap.data() as UserGardenData;
      
      // Get donor's actual water amount from donors collection
      const donorRef = doc(db, 'donors', userId);
      const donorSnap = await getDoc(donorRef);
      
      if (!donorSnap.exists()) return false;
      
      const donorData = donorSnap.data();
      const actualWaterAmount = donorData.water_amount || 0;
      
      // Check if user has enough water drops (use actual amount from donors)
      if (actualWaterAmount < cost) return false;
      
      // Check if already owned
      const ownedField = type === 'plant' ? 'ownedPlants' : 
                        type === 'accessory' ? 'ownedAccessories' : 'ownedThemes';
      
      if (gardenData[ownedField]?.includes(itemId)) return false;
      
      // Update both collections atomically
      // 1. Deduct water drops from donors collection
      await updateDoc(donorRef, {
        water_amount: increment(-cost)
      });
      
      // 2. Update game state in userGardens collection
      await updateDoc(gardenRef, {
        waterDrops: actualWaterAmount - cost, // Sync the amount
        [ownedField]: arrayUnion(itemId)
      });
      
      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      return false;
    }
  }

  // Claim daily challenge reward - Sync with donors collection
  static async claimChallenge(
    userId: string, 
    challengeId: string, 
    reward: number
  ): Promise<boolean> {
    try {
      // Get current donor water amount
      const donorRef = doc(db, 'donors', userId);
      const donorSnap = await getDoc(donorRef);
      
      if (!donorSnap.exists()) return false;
      
      const donorData = donorSnap.data();
      const currentWaterAmount = donorData.water_amount || 0;
      
      const gardenRef = doc(db, 'userGardens', userId);
      const today = new Date().toISOString();
      
      // Update both collections
      // 1. Add water drops to donors collection (actual balance)
      await updateDoc(donorRef, {
        water_amount: increment(reward)
      });
      
      // 2. Update game state in userGardens collection
      await updateDoc(gardenRef, {
        waterDrops: currentWaterAmount + reward, // Sync the amount
        [`completedChallenges.${challengeId}`]: {
          completed: true,
          claimed: true,
          lastClaimDate: today
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error claiming challenge:', error);
      return false;
    }
  }

  // Mark challenge as completed (ready to claim)
  static async completeChallenge(userId: string, challengeId: string): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      
      await updateDoc(gardenRef, {
        [`completedChallenges.${challengeId}.completed`]: true
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }

  // Reset daily challenges
  static async resetDailyChallenges(userId: string): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const today = new Date().toISOString().split('T')[0];
      
      await updateDoc(gardenRef, {
        lastDaily: today,
        completedChallenges: {} // Reset all challenges
      });
    } catch (error) {
      console.error('Error resetting challenges:', error);
      throw error;
    }
  }

  // Get user garden data - Sync with donors collection water amount
  static async getUserGardenData(userId: string): Promise<UserGardenData | null> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (gardenSnap.exists()) {
        const gardenData = gardenSnap.data() as UserGardenData;
        
        // Get actual water amount from donors collection
        const donorRef = doc(db, 'donors', userId);
        const donorSnap = await getDoc(donorRef);
        
        if (donorSnap.exists()) {
          const donorData = donorSnap.data();
          const actualWaterAmount = donorData.water_amount || 0;
          
          // Sync the water amount from donors to garden data
          const syncedGardenData = {
            ...gardenData,
            waterDrops: actualWaterAmount
          };
          
          // Update userGardens with synced amount if different
          if (gardenData.waterDrops !== actualWaterAmount) {
            await updateDoc(gardenRef, { waterDrops: actualWaterAmount });
          }
          
          return syncedGardenData;
        }
        
        return gardenData;
      }
      return null;
    } catch (error) {
      console.error('Error getting garden data:', error);
      return null;
    }
  }

  // New method: Sync water amount from donors to userGardens
  static async syncWaterAmount(userId: string): Promise<number | null> {
    try {
      const donorRef = doc(db, 'donors', userId);
      const donorSnap = await getDoc(donorRef);
      
      if (!donorSnap.exists()) return null;
      
      const donorData = donorSnap.data();
      const actualWaterAmount = donorData.water_amount || 0;
      
      // Update userGardens with actual amount
      const gardenRef = doc(db, 'userGardens', userId);
      await updateDoc(gardenRef, { waterDrops: actualWaterAmount });
      
      return actualWaterAmount;
    } catch (error) {
      console.error('Error syncing water amount:', error);
      return null;
    }
  }

  // Make garden public/private
  static async setGardenVisibility(
    userId: string, 
    isPublic: boolean, 
    gardenName?: string, 
    description?: string
  ): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const updateData: Record<string, unknown> = {
        'currentGarden.isPublic': isPublic,
        'currentGarden.lastModified': serverTimestamp()
      };
      
      if (gardenName) updateData['currentGarden.gardenName'] = gardenName;
      if (description) updateData['currentGarden.description'] = description;
      
      await updateDoc(gardenRef, updateData);
    } catch (error) {
      console.error('Error setting garden visibility:', error);
      throw error;
    }
  }

  // Add water drops (for donations, referrals, etc.) - Sync with donors collection
  static async addWaterDrops(userId: string, amount: number): Promise<void> {
    try {
      // Get current donor water amount
      const donorRef = doc(db, 'donors', userId);
      const donorSnap = await getDoc(donorRef);
      
      if (!donorSnap.exists()) throw new Error('Donor not found');
      
      const donorData = donorSnap.data();
      const currentWaterAmount = donorData.water_amount || 0;
      
      // Update both collections
      // 1. Add to donors collection (actual balance)
      await updateDoc(donorRef, {
        water_amount: increment(amount)
      });
      
      // 2. Sync to userGardens collection
      const gardenRef = doc(db, 'userGardens', userId);
      await updateDoc(gardenRef, {
        waterDrops: currentWaterAmount + amount
      });
    } catch (error) {
      console.error('Error adding water drops:', error);
      throw error;
    }
  }
}