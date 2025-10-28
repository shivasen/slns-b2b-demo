import { db } from './mock-db.js';

let userCache = null;
let profileCache = null;

// Helper to simulate session
function getSessionUserId() {
  return sessionStorage.getItem('sessionUserId');
}

function setSessionUserId(id) {
  if (id) {
    sessionStorage.setItem('sessionUserId', id);
  } else {
    sessionStorage.removeItem('sessionUserId');
  }
}

// On load, check session storage
const initialUserId = getSessionUserId();
if (initialUserId) {
  userCache = db.users.find(u => u.id === initialUserId) || null;
  profileCache = userCache;
}

export function invalidateProfileCache() {
  profileCache = null;
}

export async function getUser() {
  await new Promise(res => setTimeout(res, 50)); // simulate async
  const userId = getSessionUserId();
  userCache = db.users.find(u => u.id === userId) || null;
  return userCache;
}

export async function getUserProfile() {
  await new Promise(res => setTimeout(res, 50)); // simulate async
  const user = await getUser();
  if (!user) return null;

  // In mock db, user and profile are the same object
  profileCache = user;
  
  // Make sure default address is the full object
  if (profileCache.default_shipping_address && typeof profileCache.default_shipping_address === 'number') {
      profileCache.default_shipping_address = db.shipping_addresses.find(a => a.id === profileCache.default_shipping_address);
  }
  return profileCache;
}

export async function signUp(email, password, metadata) {
  await new Promise(res => setTimeout(res, 500)); // simulate async
  
  if (db.users.find(u => u.email === email)) {
    return { data: null, error: { message: 'User with this email already exists.' } };
  }

  const newUser = {
    id: `mock-${Date.now()}`,
    email,
    password, // In a real app, never store plain text passwords
    role: 'user',
    approved: false,
    approved_at: null,
    created_at: new Date().toISOString(),
    ...metadata,
    default_shipping_address: null,
  };
  
  db.users.push(newUser);
  
  // Return a structure similar to Supabase
  return { data: { user: newUser }, error: null };
}

export async function login(email, password) {
  await new Promise(res => setTimeout(res, 500)); // simulate async

  const user = db.users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return { data: null, error: { message: 'Invalid login credentials.' } };
  }
  
  setSessionUserId(user.id);
  userCache = user;
  profileCache = user;
  
  window.dispatchEvent(new Event('auth-change'));
  
  return { data: { user }, error: null };
}

export async function logout() {
  await new Promise(res => setTimeout(res, 100)); // simulate async
  setSessionUserId(null);
  userCache = null;
  profileCache = null;
  window.dispatchEvent(new Event('auth-change'));
}

export async function isUserAdmin() {
    await new Promise(res => setTimeout(res, 10)); // simulate async
    const user = await getUser();
    return user?.role === 'admin';
}
