import { Store, registerInDevtools } from "pullstate";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
});

// Funkcja pomocnicza ekstrahująca tylko czyste dane (zabezpieczenie dla Pullstate)
const getCleanUser = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

// Globalny nasłuchiwalnik sesji Firebase
onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChange -> Zmiana stanu sesji. Zalogowany:", !!user);
  AuthStore.update((store) => {
    store.user = getCleanUser(user); // POPRAWKA: Czysty obiekt zamiast instancji Firebase
    store.isLoggedIn = !!user;
    store.initialized = true;
  });
});

export const appSignIn = async (email, password) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);

    AuthStore.update((store) => {
      store.user = getCleanUser(resp.user); // POPRAWKA: Czysty obiekt
      store.isLoggedIn = true;
    });

    return { user: getCleanUser(resp.user) };
  } catch (e) {
    console.error("Błąd metody appSignIn:", e);
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (email, password, displayName) => {
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);

    // Aktualizujemy profil w Firebase Auth
    await updateProfile(resp.user, { displayName });

    // Tworzymy dokument użytkownika w Firestore
    await setDoc(doc(db, "users", resp.user.uid), {
      id: resp.user.uid,
      name: displayName,
      email: resp.user.email,
      photo: "",
      points2026: 0,
    });

    // Aktualizujemy bezpiecznie sklep Pullstate
    AuthStore.update((store) => {
      store.user = getCleanUser(auth.currentUser);
      store.isLoggedIn = true;
    });

    return { user: getCleanUser(auth.currentUser) };
  } catch (e) {
    console.error("Błąd metody appSignUp:", e);
    return { error: e };
  }
};

registerInDevtools({ AuthStore });
