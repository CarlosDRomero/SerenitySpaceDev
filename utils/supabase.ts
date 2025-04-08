import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = "https://dhbttiijiqnosyzvifiu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYnR0aWlqaXFub3N5enZpZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODQzMzIsImV4cCI6MjA1OTM2MDMzMn0.516cBu6zd4rxr8FluFPsc5qEl4SHwBgZclvk8AhGv24";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: Platform.OS !== "web",
    detectSessionInUrl: false,
  },
});
