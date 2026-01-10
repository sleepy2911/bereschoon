import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Helper function to get public URL for storage
export const getStorageUrl = (bucket, path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // If it's a local path, return it
  if (path.startsWith('/')) return path;
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl;
};

// Helper to upload file to storage
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;
  return getStorageUrl(bucket, data.path);
};

// Helper to delete file from storage
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

export default supabase;

