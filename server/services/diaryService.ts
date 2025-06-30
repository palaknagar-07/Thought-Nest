import { supabase } from '../config/supabase';
import { DiaryEntry } from '../../src/pages/Index';

export const diaryService = {
  // Get all entries for a user
  async getEntries(userId: string): Promise<DiaryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching entries:', error);
      return [];
    }
  },

  // Create a new entry
  async createEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: entry.userId || '', // You'll need to add userId to DiaryEntry type
          date: entry.date,
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error creating entry:', error);
      return null;
    }
  },

  // Update an existing entry
  async updateEntry(entryId: string, updates: Partial<DiaryEntry>): Promise<DiaryEntry | null> {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .update({
          date: updates.date,
          title: updates.title,
          content: updates.content,
          mood: updates.mood,
          tags: updates.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error updating entry:', error);
      return null;
    }
  },

  // Delete an entry
  async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  },

  // Get entries by date range
  async getEntriesByDateRange(userId: string, startDate: string, endDate: string): Promise<DiaryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching entries by date range:', error);
      return [];
    }
  },

  // Search entries by content or title
  async searchEntries(userId: string, searchTerm: string): Promise<DiaryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching entries:', error);
      return [];
    }
  }
}; 