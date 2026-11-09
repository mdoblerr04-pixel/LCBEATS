import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prlhoptjecbgczukehky.supabase.co';
const supabaseKey = 'sb_publishable_fnHmWuKmyLw9iMQkfEv6Ew_7uK_XPmj';

export const supabase = createClient(supabaseUrl, supabaseKey);