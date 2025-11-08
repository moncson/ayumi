import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, initializeFirebase } from './config';

// クライアント側でFirebaseを初期化
if (typeof window !== 'undefined') {
  initializeFirebase();
}

/**
 * メールアドレスとパスワードでログイン
 */
export const signIn = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * ログアウト
 */
export const signOut = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * 認証状態の変更を監視
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // 確実に初期化
  initializeFirebase();
  
  if (!auth) {
    console.error('Firebase Auth is still not initialized after calling initializeFirebase()');
    // エラーの場合でもコールバックを呼んで loading を false にする
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): User | null => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

