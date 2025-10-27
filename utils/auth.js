import { supabase } from './supabase.js';

let userCache = null;
let profileCache = null;

// Listen to auth changes to clear cache and update state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    userCache = null;
    profileCache = null;
  } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    userCache = session?.user || null;
    // Invalidate profile cache to refetch it
    profileCache = null;
  }
});

export async function getUser() {
  if (userCache) return userCache;
  const { data: { user } } = await supabase.auth.getUser();
  userCache = user;
  return user;
}

export async function getUserProfile() {
  const user = await getUser();
  if (!user) return null;

  // Return from cache if available
  if (profileCache && profileCache.id === user.id) return profileCache;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  profileCache = data;
  return data;
}

export async function signUp(email, password, metadata) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata // This will be stored in auth.users.raw_user_meta_data
    }
  });
  return { data, error };
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function logout() {
  await supabase.auth.signOut();
  userCache = null;
  profileCache = null;
}

export async function isUserAdmin() {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
    return data;
}
