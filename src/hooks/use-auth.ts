import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PlantInventory {
  plants: string[];
  accessories: string[];
}

// Raw Firestore donor document structure
interface FirestoreDonorDoc {
  name: string;
  email: string;
  password: string;
  district_id: number;
  donated_amount: number;
  water_amount: number;
  inventory: string; // JSON string from Firestore
}

// Raw Firestore admin document structure
interface FirestoreAdminDoc {
  name: string;
  email: string;
  password: string;
}

// Unified user profile
interface UserProfile {
  user_id: string; // Document ID from Firestore
  name: string;
  email: string;
  password: string;
  role: 'donor' | 'admin';
  // Donor-specific fields (only present for donors)
  district_id?: number;
  donated_amount?: number;
  water_amount?: number;
  inventory?: PlantInventory;
  // Add a timestamp to force re-renders
  _lastUpdated?: number;
}

// Transaction record interface
interface DonationTransaction {
  user_id: string;
  user_name: string;
  user_district_id: number;
  target_district_id: number;
  amount: number;
  project_id?: number;
  project_title?: string;
  timestamp: FieldValue; // Firebase serverTimestamp
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [initialized, setInitialized] = useState(false); // Track if we've checked localStorage
  const [updateCounter, setUpdateCounter] = useState(0); // Force component updates

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // First, try to find user in donors collection
      const donorsRef = collection(db, 'donors');
      const donorQuery = query(donorsRef, where('email', '==', email), where('password', '==', password));
      const donorSnapshot = await getDocs(donorQuery);
      
      if (!donorSnapshot.empty) {
        const donorDoc = donorSnapshot.docs[0];
        const rawData = donorDoc.data() as FirestoreDonorDoc;
        
        // Parse JSON inventory
        let parsedInventory: PlantInventory;
        try {
          parsedInventory = typeof rawData.inventory === 'string' 
            ? JSON.parse(rawData.inventory) 
            : rawData.inventory;
        } catch (error) {
          console.error('Error parsing inventory JSON:', error);
          parsedInventory = { plants: [], accessories: [] };
        }
        
        // Create donor profile
        const donorProfile: UserProfile = {
          user_id: donorDoc.id,
          name: rawData.name,
          email: rawData.email,
          password: rawData.password,
          role: 'donor',
          district_id: rawData.district_id,
          donated_amount: rawData.donated_amount,
          water_amount: rawData.water_amount,
          inventory: parsedInventory
        };
        
        setUser(donorProfile);
        localStorage.setItem('user', JSON.stringify(donorProfile));
        setLoading(false);
        return true;
      }
      
      // If not found in donors, try admins collection
      const adminsRef = collection(db, 'admins');
      const adminQuery = query(adminsRef, where('email', '==', email), where('password', '==', password));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (!adminSnapshot.empty) {
        const adminDoc = adminSnapshot.docs[0];
        const rawData = adminDoc.data() as FirestoreAdminDoc;
        
        // Create admin profile
        const adminProfile: UserProfile = {
          user_id: adminDoc.id,
          name: rawData.name,
          email: rawData.email,
          password: rawData.password,
          role: 'admin'
        };
        
        setUser(adminProfile);
        localStorage.setItem('user', JSON.stringify(adminProfile));
        setLoading(false);
        return true;
      }
      
      // User not found in either collection
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'district_id'>>) => {
    if (!user) return;
    
    try {
      const collectionName = user.role === 'donor' ? 'donors' : 'admins';
      const userRef = doc(db, collectionName, user.user_id);
      await updateDoc(userRef, updates);
      
      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateWaterAmount = async (amount: number) => {
    if (!user || user.role !== 'donor') return;
    
    try {
      const donorRef = doc(db, 'donors', user.user_id);
      await updateDoc(donorRef, {
        water_amount: increment(amount)
      });
      
      // Update local state with functional update to ensure React detects the change
      setUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedUser = { 
          ...prevUser, 
          water_amount: (prevUser.water_amount || 0) + amount 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log(`Updated water amount by ${amount}. New total: ${updatedUser.water_amount}`);
        return updatedUser;
      });
    } catch (error) {
      console.error('Error updating water amount:', error);
      throw error;
    }
  };

  // New function specifically for reward water drops (separate from donations)
  const addRewardWaterDrops = async (amount: number) => {
    if (!user || user.role !== 'donor') {
      throw new Error('Only donors can receive water drop rewards');
    }
    
    try {
      const donorRef = doc(db, 'donors', user.user_id);
      await updateDoc(donorRef, {
        water_amount: increment(amount)
      });
      
      // Update local state with functional update and timestamp to force React re-render
      setUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedUser = { 
          ...prevUser, 
          water_amount: (prevUser.water_amount || 0) + amount,
          _lastUpdated: Date.now() // Force React to see this as a new object
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log(`Added ${amount} reward water drops. New total: ${updatedUser.water_amount}`);
        console.log('Updated user object with timestamp:', updatedUser._lastUpdated);
        return updatedUser;
      });
      
      // Force an additional state change to trigger re-renders
      setUpdateCounter(prev => prev + 1);
      
      const newTotal = (user.water_amount || 0) + amount;
      return {
        success: true,
        newWaterAmount: newTotal,
        rewardAmount: amount
      };
    } catch (error) {
      console.error('Error adding reward water drops:', error);
      throw error;
    }
  };

  const updateDonatedAmount = async (amount: number) => {
    if (!user || user.role !== 'donor') return;
    
    try {
      const donorRef = doc(db, 'donors', user.user_id);
      await updateDoc(donorRef, {
        donated_amount: increment(amount)
      });
      
      // Update local state
      const updatedUser = { 
        ...user, 
        donated_amount: (user.donated_amount || 0) + amount 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating donated amount:', error);
    }
  };

  const updateInventory = async (newInventory: PlantInventory) => {
    if (!user || user.role !== 'donor') return;
    
    try {
      const donorRef = doc(db, 'donors', user.user_id);
      const inventoryJson = JSON.stringify(newInventory);
      
      await updateDoc(donorRef, {
        inventory: inventoryJson
      });
      
      // Update local state
      const updatedUser = { ...user, inventory: newInventory };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  // New donation function that handles both balance updates and transaction records
  const processDonation = async (
    amount: number, 
    targetDistrictId: number,
    projectId?: number,
    projectTitle?: string
  ) => {
    if (!user || user.role !== 'donor') {
      throw new Error('Only donors can make donations');
    }

    try {
      // 1. Update user's donated amount and add water drops
      const waterDropsEarned = Math.floor(amount * 5); // 5 drops per dollar
      const donorRef = doc(db, 'donors', user.user_id);
      
      await updateDoc(donorRef, {
        donated_amount: increment(amount),
        water_amount: increment(waterDropsEarned)
      });

      // 2. Create transaction record in single transactions collection
      const transactionData: DonationTransaction = {
        user_id: user.user_id,
        user_name: user.name,
        user_district_id: user.district_id || 0,
        target_district_id: targetDistrictId,
        amount: amount,
        timestamp: serverTimestamp(),
        ...(projectId && { project_id: projectId }),
        ...(projectTitle && { project_title: projectTitle })
      };

      // Add to single transactions collection
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, transactionData);

      // 3. Update local state
      const updatedUser = { 
        ...user, 
        donated_amount: (user.donated_amount || 0) + amount,
        water_amount: (user.water_amount || 0) + waterDropsEarned
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        waterDropsEarned,
        newBalance: updatedUser.donated_amount,
        newWaterAmount: updatedUser.water_amount
      };
    } catch (error) {
      console.error('Error processing donation:', error);
      throw error;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    if (initialized) return; // Only run once
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserProfile;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
    setInitialized(true);
  }, [initialized]);

  return { 
    user, 
    loading: loading || !initialized, // Keep loading until initialized
    login, 
    logout, 
    updateProfile,
    updateWaterAmount,
    addRewardWaterDrops, // New function for reward water drops
    updateDonatedAmount,
    updateInventory,
    processDonation, // New donation function
    isAuthenticated: !!user && initialized, // Only authenticated if initialized
    updateCounter // Expose update counter for components to detect changes
  };
};
