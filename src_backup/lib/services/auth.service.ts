import { writable } from 'svelte/store';
import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '$lib/types';

// Helper para localStorage seguro (solo en navegador)
const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

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
        const userData = { uid: firebaseUser.uid, ...userDoc.data() } as User;
        user.set(userData);
        
        // Guardar en localStorage para routing (solo en navegador)
        safeLocalStorage.setItem('isAuthenticated', 'true');
        safeLocalStorage.setItem('userRole', userData.role);
        safeLocalStorage.setItem('userEmail', userData.email);
        
        // Redirigir según rol (solo en navegador)
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          
          if (userData.role === 'admin' && !currentPath.startsWith('/admin')) {
            window.location.href = '/admin/dashboard';
          } else if (userData.role === 'employee' && currentPath.startsWith('/admin')) {
            window.location.href = '/';
          }
        }
      } else {
        // Si no existe documento, crear uno básico
        const basicUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'Usuario',
          role: 'employee',
          companyId: 'default',
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), basicUser);
        user.set(basicUser);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      error.set('Error al cargar datos del usuario');
    }
  } else {
    user.set(null);
    safeLocalStorage.removeItem('isAuthenticated');
    safeLocalStorage.removeItem('userRole');
    safeLocalStorage.removeItem('userEmail');
  }
  isLoading.set(false);
});

export async function login(email: string, password: string) {
  try {
    isLoading.set(true);
    error.set(null);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    let message = 'Error al iniciar sesión';
    
    switch (err.code) {
      case 'auth/user-not-found':
        message = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Intenta más tarde';
        break;
      case 'auth/user-disabled':
        message = 'Usuario deshabilitado';
        break;
    }
    
    error.set(message);
    throw err;
  } finally {
    isLoading.set(false);
  }
}

export async function register(userData: Partial<User>, password: string) {
  try {
    isLoading.set(true);
    error.set(null);
    
    if (!userData.email) throw new Error('Email es requerido');
    
    const credential = await createUserWithEmailAndPassword(auth, userData.email, password);
    
    const newUser: User = {
      uid: credential.user.uid,
      email: userData.email,
      displayName: userData.displayName || userData.email.split('@')[0],
      photoURL: userData.photoURL,
      role: userData.role || 'employee',
      companyId: userData.companyId || 'default',
      rut: userData.rut,
      position: userData.position,
      scheduleRef: userData.scheduleRef,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', credential.user.uid), newUser);
    
    if (userData.displayName) {
      await updateProfile(credential.user, {
        displayName: userData.displayName
      });
    }
    
    user.set(newUser);
    return credential.user.uid;
  } catch (err: any) {
    let message = 'Error al registrar usuario';
    
    switch (err.code) {
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/weak-password':
        message = 'La contraseña es demasiado débil';
        break;
    }
    
    error.set(message);
    throw err;
  } finally {
    isLoading.set(false);
  }
}

export async function logout() {
  try {
    await signOut(auth);
    user.set(null);
    error.set(null);
    
    // Redirigir al login (solo en navegador)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (err: any) {
    error.set('Error al cerrar sesión');
    throw err;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err: any) {
    error.set('Error al enviar email de recuperación');
    throw err;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<User>) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date()
    });
    
    // Actualizar store local
    user.update(current => current ? { ...current, ...updates } : null);
    
    return true;
  } catch (err: any) {
    error.set('Error al actualizar perfil');
    throw err;
  }
}
