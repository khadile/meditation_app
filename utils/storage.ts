import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '@/types/breathing';

const CUSTOM_ROUTINES_KEY = '@custom_routines';

export async function saveCustomRoutine(routine: Routine): Promise<void> {
  try {
    const existingRoutines = await getCustomRoutines();
    const updatedRoutines = [...existingRoutines, routine];
    await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));
  } catch (error) {
    console.error('Error saving custom routine:', error);
    throw error;
  }
}

export async function getCustomRoutines(): Promise<Routine[]> {
  try {
    const routinesJson = await AsyncStorage.getItem(CUSTOM_ROUTINES_KEY);
    return routinesJson ? JSON.parse(routinesJson) : [];
  } catch (error) {
    console.error('Error getting custom routines:', error);
    return [];
  }
}

export async function deleteCustomRoutine(routineId: string): Promise<void> {
  try {
    const existingRoutines = await getCustomRoutines();
    const updatedRoutines = existingRoutines.filter(routine => routine.id !== routineId);
    await AsyncStorage.setItem(CUSTOM_ROUTINES_KEY, JSON.stringify(updatedRoutines));
  } catch (error) {
    console.error('Error deleting custom routine:', error);
    throw error;
  }
} 