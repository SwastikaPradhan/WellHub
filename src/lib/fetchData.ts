
import { databases } from './appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";
const COLLECTION_ACTIVITY = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ACTIVITY ?? "";
const COLLECTION_NUTRITION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NUTRITION ?? "";
const COLLECTION_JOURNAL = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOURNAL ?? "";


export async function getActivityData() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ACTIVITY);
    return response.documents;
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
}

export async function getNutritionData() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_NUTRITION);
    return response.documents;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return [];
  }
}

export async function getJournalData() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_JOURNAL);
    return response.documents;
  } catch (error) {
    console.error('Error fetching journal data:', error);
    return [];
  }
}

