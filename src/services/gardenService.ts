import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GardenLayout, PlantInstance } from '@/types/garden';

// Extended garden layout for Firestore
interface FirestoreGardenLayout extends Omit<GardenLayout, 'lastModified'> {
  lastModified: any; // Firestore timestamp
  isPublic?: boolean;
  gardenName?: string;
  description?: string;
  likes?: number;
  createdAt?: any; // Firestore timestamp
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
            lastModified: data.currentGarden.lastModified?.toDate() || new Date()
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading garden:', error);
      return null;
    }
  }

  // Initialize user garden data
  static async initializeUserGarden(userId: string): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (!gardenSnap.exists()) {
        const defaultGardenData: UserGardenData = {
          currentGarden: {
            id: 'default',
            userId,
            plants: [
              {
                id: 'plant-1',
                plantId: 'seedling',
                position: { x: 400, y: 300 },
                size: 1.0,
                rotation: 0,
                layer: 1,
                accessories: ['crown']
              }
            ],
            backgroundTheme: 'noon',
            canvas: { width: 800, height: 600 },
            lastModified: serverTimestamp(),
            isPublic: false,
            likes: 0,
            createdAt: serverTimestamp()
          },
          ownedPlants: ['seedling', 'grass'], // Default free plants
          ownedAccessories: ['crown'], // Default free accessory
          ownedThemes: ['morning', 'noon'], // Default free themes
          waterDrops: 100, // Starting water drops
          lastDaily: new Date().toISOString().split('T')[0], // Today's date
          completedChallenges: {}
        };

        await setDoc(gardenRef, defaultGardenData);
      }
    } catch (error) {
      console.error('Error initializing garden:', error);
      throw error;
    }
  }

  // Purchase plant/accessory/theme
  static async purchaseItem(
    userId: string, 
    itemId: string, 
    cost: number, 
    type: 'plant' | 'accessory' | 'theme'
  ): Promise<boolean> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (!gardenSnap.exists()) return false;
      
      const data = gardenSnap.data() as UserGardenData;
      
      // Check if user has enough water drops
      if (data.waterDrops < cost) return false;
      
      // Check if already owned
      const ownedField = type === 'plant' ? 'ownedPlants' : 
                        type === 'accessory' ? 'ownedAccessories' : 'ownedThemes';
      
      if (data[ownedField]?.includes(itemId)) return false;
      
      // Update Firestore
      await updateDoc(gardenRef, {
        waterDrops: increment(-cost),
        [ownedField]: arrayUnion(itemId)
      });
      
      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      return false;
    }
  }

  // Claim daily challenge reward
  static async claimChallenge(
    userId: string, 
    challengeId: string, 
    reward: number
  ): Promise<boolean> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const today = new Date().toISOString();
      
      await updateDoc(gardenRef, {
        waterDrops: increment(reward),
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

  // Get user garden data
  static async getUserGardenData(userId: string): Promise<UserGardenData | null> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      const gardenSnap = await getDoc(gardenRef);
      
      if (gardenSnap.exists()) {
        return gardenSnap.data() as UserGardenData;
      }
      return null;
    } catch (error) {
      console.error('Error getting garden data:', error);
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
      const updateData: any = {
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

  // Add water drops (for donations, referrals, etc.)
  static async addWaterDrops(userId: string, amount: number): Promise<void> {
    try {
      const gardenRef = doc(db, 'userGardens', userId);
      await updateDoc(gardenRef, {
        waterDrops: increment(amount)
      });
    } catch (error) {
      console.error('Error adding water drops:', error);
      throw error;
    }
  }
}