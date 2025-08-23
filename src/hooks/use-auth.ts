import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, FieldValue, getDoc } from 'firebase/firestore';
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

  // Add global event listener for forced updates
  useEffect(() => {
    const handleGlobalUserUpdate = (event: CustomEvent) => {
      console.log('Received global user update event:', event.detail);
      if (event.detail.user && user?.user_id === event.detail.user.user_id) {
        setUser({...event.detail.user});
        setUpdateCounter(prev => prev + 1);
      }
    };

    const handleGlobalWaterUpdate = (event: CustomEvent) => {
      console.log('Received global water update event:', event.detail);
      if (event.detail.newTotal !== undefined && user) {
        setUser(prev => prev ? {...prev, water_amount: event.detail.newTotal, _lastUpdated: Date.now()} : prev);
        setUpdateCounter(prev => prev + 1);
      }
    };

    window.addEventListener('userDataUpdated', handleGlobalUserUpdate);
    window.addEventListener('waterDropsUpdated', handleGlobalWaterUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleGlobalUserUpdate);
      window.removeEventListener('waterDropsUpdated', handleGlobalWaterUpdate);
    };
  }, [user]);

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
        water_amount: (user.water_amount || 0) + waterDropsEarned,
        _lastUpdated: Date.now()
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUpdateCounter(prev => prev + 1);
      
      // Immediately dispatch global events to update all components
      window.dispatchEvent(new CustomEvent('userDataUpdated', {
        detail: { user: updatedUser, water_amount: updatedUser.water_amount }
      }));
      window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
        detail: { newTotal: updatedUser.water_amount, amountAdded: waterDropsEarned }
      }));
      
      // Additional forced updates
      setTimeout(() => {
        setUpdateCounter(prev => prev + 1);
        setUser({...updatedUser});
        window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
          detail: { newTotal: updatedUser.water_amount }
        }));
      }, 10);

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

  // Check for existing session on mount and sync with Firebase
  useEffect(() => {
    if (initialized) return; // Only run once
    
    const initializeUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as UserProfile;
          
          // First set the localStorage user to show something immediately
          setUser(parsedUser);
          
          // Now sync with Firebase to get the latest data
          console.log('Syncing user data from Firebase on app reload...');
          
          try {
            const collectionName = parsedUser.role === 'donor' ? 'donors' : 'admins';
            const userRef = doc(db, collectionName, parsedUser.user_id);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const firestoreData = userDoc.data();
              
              let updatedUser: UserProfile;
              
              if (parsedUser.role === 'donor') {
                // Parse inventory if it's a donor
                let parsedInventory: PlantInventory;
                try {
                  parsedInventory = typeof firestoreData.inventory === 'string' 
                    ? JSON.parse(firestoreData.inventory) 
                    : firestoreData.inventory || { plants: [], accessories: [] };
                } catch (error) {
                  console.error('Error parsing inventory JSON:', error);
                  parsedInventory = { plants: [], accessories: [] };
                }
                
                updatedUser = {
                  ...parsedUser,
                  name: firestoreData.name || parsedUser.name,
                  email: firestoreData.email || parsedUser.email,
                  district_id: firestoreData.district_id || parsedUser.district_id,
                  donated_amount: firestoreData.donated_amount || 0,
                  water_amount: firestoreData.water_amount || 0,
                  inventory: parsedInventory,
                  _lastUpdated: Date.now()
                };
              } else {
                // Admin user
                updatedUser = {
                  ...parsedUser,
                  name: firestoreData.name || parsedUser.name,
                  email: firestoreData.email || parsedUser.email,
                  _lastUpdated: Date.now()
                };
              }

              // Update both state and localStorage with fresh Firebase data
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUpdateCounter(prev => prev + 1);
              
              console.log('User data synced successfully from Firebase:', {
                old_water: parsedUser.water_amount,
                new_water: updatedUser.water_amount,
                old_donated: parsedUser.donated_amount,
                new_donated: updatedUser.donated_amount
              });
              
            } else {
              console.warn('User document not found in Firebase, using localStorage data');
            }
          } catch (firebaseError) {
            console.error('Error syncing with Firebase, using localStorage data:', firebaseError);
            // Keep the localStorage data if Firebase fails
          }
          
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
      setInitialized(true);
    };
    
    initializeUserData();
  }, [initialized]);

  // Manual refresh function to sync latest data from Firebase
  const refreshUserData = async (): Promise<UserProfile | null> => {
    if (!user?.user_id) {
      console.warn('No user to refresh');
      return null;
    }

    try {
      console.log('Manually refreshing user data from Firebase...');
      
      const collectionName = user.role === 'donor' ? 'donors' : 'admins';
      const userRef = doc(db, collectionName, user.user_id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        
        let updatedUser: UserProfile;
        
        if (user.role === 'donor') {
          // Parse inventory if it's a donor
          let parsedInventory: PlantInventory;
          try {
            parsedInventory = typeof firestoreData.inventory === 'string' 
              ? JSON.parse(firestoreData.inventory) 
              : firestoreData.inventory || { plants: [], accessories: [] };
          } catch (error) {
            console.error('Error parsing inventory JSON:', error);
            parsedInventory = { plants: [], accessories: [] };
          }
          
          updatedUser = {
            ...user,
            name: firestoreData.name || user.name,
            email: firestoreData.email || user.email,
            district_id: firestoreData.district_id || user.district_id,
            donated_amount: firestoreData.donated_amount || 0,
            water_amount: firestoreData.water_amount || 0,
            inventory: parsedInventory,
            _lastUpdated: Date.now()
          };
        } else {
          // Admin user
          updatedUser = {
            ...user,
            name: firestoreData.name || user.name,
            email: firestoreData.email || user.email,
            _lastUpdated: Date.now()
          };
        }

        // Update both state and localStorage with fresh Firebase data
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUpdateCounter(prev => prev + 1);
        
        // Force additional re-render triggers with multiple approaches
        setTimeout(() => {
          setUpdateCounter(prev => prev + 1);
          // Force a new object reference to trigger React re-renders
          setUser({...updatedUser});
        }, 50);
        
        setTimeout(() => {
          setUpdateCounter(prev => prev + 1);
          // Dispatch multiple global events to ensure all components update
          window.dispatchEvent(new CustomEvent('userDataUpdated', {
            detail: { user: updatedUser, water_amount: updatedUser.water_amount }
          }));
          window.dispatchEvent(new CustomEvent('waterDropsUpdated', {
            detail: { newTotal: updatedUser.water_amount }
          }));
        }, 100);
        
        setTimeout(() => {
          // Final forced update
          setUpdateCounter(prev => prev + 1);
          setUser(prev => ({...prev, _forceUpdate: Date.now()}));
        }, 200);
        
        console.log('User data refreshed successfully:', {
          old_water: user.water_amount,
          new_water: updatedUser.water_amount,
          old_donated: user.donated_amount,
          new_donated: updatedUser.donated_amount,
          timestamp: Date.now()
        });
        
        return updatedUser;
      } else {
        console.warn('User document not found in Firebase during refresh');
        return user;
      }
    } catch (error) {
      console.error('Error refreshing user data from Firebase:', error);
      throw error;
    }
  };

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
    refreshUserData, // Manual refresh from Firebase
    isAuthenticated: !!user && initialized, // Only authenticated if initialized
    updateCounter // Expose update counter for components to detect changes
  };
};
