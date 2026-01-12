import { writable } from 'svelte/store';
import type { User } from '$lib/types';
import { auth } from '$lib/services/firebase';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '$lib/services/firebase';

// Store para el usuario
export const user = writable<User | null>(null);
export const isLoading = writable(true);
export const error = writable<string | null>(null);

// Escuchar cambios de autenticación
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        user.set({ uid: firebaseUser.uid, ...userDoc.data() } as User);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      error.set('Error al cargar datos del usuario');
    }
  } else {
    user.set(null);
  }
  isLoading.set(false);
});

// Funciones de autenticación
export async function login(email: string, password: string) {
  try {
    isLoading.set(true);
    error.set(null);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    error.set(err.message);
    throw err;
  } finally {
    isLoading.set(false);
  }
}

export async function register(userData: Partial<User>, password: string) {
  try {
    isLoading.set(true);
    error.set(null);
    
    const credential = await createUserWithEmailAndPassword(auth, userData.email!, password);
    
    const newUser: User = {
      uid: credential.user.uid,
      email: userData.email!,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      role: 'employee',
      companyId: userData.companyId!,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', credential.user.uid), newUser);
    
    if (userData.displayName) {
      await updateProfile(credential.user, {
        displayName: userData.displayName
      });
    }
    
    user.set(newUser);
  } catch (err: any) {
    error.set(err.message);
    throw err;
  } finally {
    isLoading.set(false);
  }
}

export async function logout() {
  try {
    await signOut(auth);
    user.set(null);
  } catch (err: any) {
    error.set(err.message);
    throw err;
  }
}
