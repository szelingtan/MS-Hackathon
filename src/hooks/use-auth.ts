import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
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
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [initialized, setInitialized] = useState(false); // Track if we've checked localStorage

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
      const collection = user.role === 'donor' ? 'donors' : 'admins';
      const userRef = doc(db, collection, user.user_id);
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
      
      // Update local state
      const updatedUser = { 
        ...user, 
        water_amount: (user.water_amount || 0) + amount 
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating water amount:', error);
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
    updateDonatedAmount,
    updateInventory,
    isAuthenticated: !!user && initialized // Only authenticated if initialized
  };
};
