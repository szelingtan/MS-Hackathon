import { useState, useEffect, useCallback } from 'react';
import { GardenService } from '@/services/gardenService';
import { useAuth } from './use-auth';
import { GardenLayout } from '@/types/garden';

interface GardenBackendState {
  waterDrops: number;
  ownedPlants: string[];
  ownedAccessories: string[];
  ownedThemes: string[];
  completedChallenges: {
    [challengeId: string]: {
      completed: boolean;
      claimed: boolean;
      lastClaimDate: string;
    }
  };
  loading: boolean;
  initialized: boolean;
}

export const useGardenBackend = () => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [gardenState, setGardenState] = useState<GardenBackendState>({
    waterDrops: 100,
    ownedPlants: ['seedling', 'grass'],
    ownedAccessories: ['crown'],
    ownedThemes: ['morning', 'noon'],
    completedChallenges: {},
    loading: false,
    initialized: false
  });

  // Initialize user garden data when authenticated
  const initializeGarden = useCallback(async () => {
    if (!isAuthenticated || !user?.user_id) return;

    setGardenState(prev => ({ ...prev, loading: true }));

    try {
      // Initialize garden if doesn't exist
      await GardenService.initializeUserGarden(user.user_id);
      
      // Load current garden data
      const gardenData = await GardenService.getUserGardenData(user.user_id);
      
      if (gardenData) {
        // Check if daily reset is needed
        const today = new Date().toISOString().split('T')[0];
        if (gardenData.lastDaily !== today) {
          await GardenService.resetDailyChallenges(user.user_id);
          // Reload data after reset
          const updatedData = await GardenService.getUserGardenData(user.user_id);
          if (updatedData) {
            setGardenState(prev => ({
              ...prev,
              ...updatedData,
              loading: false,
              initialized: true
            }));
          }
        } else {
          setGardenState(prev => ({
            ...prev,
            ...gardenData,
            loading: false,
            initialized: true
          }));
        }
      }
    } catch (error) {
      console.error('Error initializing garden:', error);
      setGardenState(prev => ({ ...prev, loading: false }));
    }
  }, [isAuthenticated, user?.user_id]);

  // Save garden layout
  const saveGarden = useCallback(async (garden: GardenLayout) => {
    if (!isAuthenticated || !user?.user_id) return;

    try {
      await GardenService.saveGarden(user.user_id, garden);
    } catch (error) {
      console.error('Error saving garden:', error);
      throw error;
    }
  }, [isAuthenticated, user?.user_id]);

  // Load garden layout
  const loadGarden = useCallback(async (): Promise<GardenLayout | null> => {
    if (!isAuthenticated || !user?.user_id) return null;

    try {
      return await GardenService.loadGarden(user.user_id);
    } catch (error) {
      console.error('Error loading garden:', error);
      return null;
    }
  }, [isAuthenticated, user?.user_id]);

  // Purchase item
  const purchaseItem = useCallback(async (
    itemId: string, 
    cost: number, 
    type: 'plant' | 'accessory' | 'theme'
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.user_id) return false;

    setGardenState(prev => ({ ...prev, loading: true }));

    try {
      const success = await GardenService.purchaseItem(user.user_id, itemId, cost, type);
      
      if (success) {
        // Update local state
        const ownedField = type === 'plant' ? 'ownedPlants' : 
                          type === 'accessory' ? 'ownedAccessories' : 'ownedThemes';
        
        setGardenState(prev => ({
          ...prev,
          waterDrops: prev.waterDrops - cost,
          [ownedField]: [...prev[ownedField], itemId],
          loading: false
        }));
        
        // Also refresh auth user data to update navbar
        if (refreshUserData) {
          await refreshUserData();
        }
      } else {
        setGardenState(prev => ({ ...prev, loading: false }));
      }
      
      return success;
    } catch (error) {
      console.error('Error purchasing item:', error);
      setGardenState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, [isAuthenticated, user?.user_id, refreshUserData]);

  // Complete challenge
  const completeChallenge = useCallback(async (challengeId: string) => {
    if (!isAuthenticated || !user?.user_id) return;

    try {
      await GardenService.completeChallenge(user.user_id, challengeId);
      
      // Update local state
      setGardenState(prev => ({
        ...prev,
        completedChallenges: {
          ...prev.completedChallenges,
          [challengeId]: {
            completed: true,
            claimed: false,
            lastClaimDate: ''
          }
        }
      }));
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }, [isAuthenticated, user?.user_id]);

  // Claim challenge reward
  const claimChallenge = useCallback(async (challengeId: string, reward: number): Promise<boolean> => {
    if (!isAuthenticated || !user?.user_id) return false;

    setGardenState(prev => ({ ...prev, loading: true }));

    try {
      const success = await GardenService.claimChallenge(user.user_id, challengeId, reward);
      
      if (success) {
        const today = new Date().toISOString();
        
        // Update local state
        setGardenState(prev => ({
          ...prev,
          waterDrops: prev.waterDrops + reward,
          completedChallenges: {
            ...prev.completedChallenges,
            [challengeId]: {
              completed: true,
              claimed: true,
              lastClaimDate: today
            }
          },
          loading: false
        }));
        
        // Also refresh auth user data to update navbar
        if (refreshUserData) {
          await refreshUserData();
        }
      } else {
        setGardenState(prev => ({ ...prev, loading: false }));
      }
      
      return success;
    } catch (error) {
      console.error('Error claiming challenge:', error);
      setGardenState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, [isAuthenticated, user?.user_id, refreshUserData]);

  // Reset daily challenges
  const resetDailyChallenges = useCallback(async () => {
    if (!isAuthenticated || !user?.user_id) return;

    try {
      await GardenService.resetDailyChallenges(user.user_id);
      
      // Update local state
      setGardenState(prev => ({
        ...prev,
        completedChallenges: {}
      }));
    } catch (error) {
      console.error('Error resetting challenges:', error);
      throw error;
    }
  }, [isAuthenticated, user?.user_id]);

  // Make garden public
  const makeGardenPublic = useCallback(async (gardenName?: string, description?: string) => {
    if (!isAuthenticated || !user?.user_id) return;

    try {
      await GardenService.setGardenVisibility(user.user_id, true, gardenName, description);
    } catch (error) {
      console.error('Error making garden public:', error);
      throw error;
    }
  }, [isAuthenticated, user?.user_id]);

  // Add water drops (for donations, etc.)
  const addWaterDrops = useCallback(async (amount: number) => {
    if (!isAuthenticated || !user?.user_id) return;

    try {
      await GardenService.addWaterDrops(user.user_id, amount);
      
      // Update local state
      setGardenState(prev => ({
        ...prev,
        waterDrops: prev.waterDrops + amount
      }));
    } catch (error) {
      console.error('Error adding water drops:', error);
      throw error;
    }
  }, [isAuthenticated, user?.user_id]);

  // Sync water amount from donors collection
  const syncWaterAmount = useCallback(async (): Promise<number | null> => {
    if (!isAuthenticated || !user?.user_id) return null;

    try {
      const syncedAmount = await GardenService.syncWaterAmount(user.user_id);
      if (syncedAmount !== null) {
        setGardenState(prev => ({
          ...prev,
          waterDrops: syncedAmount
        }));
        
        // Also refresh auth user data to update navbar
        if (refreshUserData) {
          await refreshUserData();
        }
      }
      return syncedAmount;
    } catch (error) {
      console.error('Error syncing water amount:', error);
      return null;
    }
  }, [isAuthenticated, user?.user_id, refreshUserData]);

  // Initialize on authentication
  useEffect(() => {
    if (isAuthenticated && !gardenState.initialized) {
      initializeGarden();
    }
  }, [isAuthenticated, gardenState.initialized, initializeGarden]);

  return {
    ...gardenState,
    saveGarden,
    loadGarden,
    purchaseItem,
    completeChallenge,
    claimChallenge,
    resetDailyChallenges,
    makeGardenPublic,
    addWaterDrops,
    initializeGarden,
    syncWaterAmount
  };
};