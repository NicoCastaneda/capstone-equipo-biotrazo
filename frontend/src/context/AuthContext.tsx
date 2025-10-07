import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: "farmer" | "buyer"
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "farmer" | "buyer"
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const API_URL = "http://127.0.0.1:5000/api/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        const storedUser = localStorage.getItem("agrotraceUser");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Error parsing stored user:", error);
            localStorage.removeItem("agrotraceUser");
          }
        }
      } else {
        // No hay usuario autenticado
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "farmer" | "buyer"
  ) => {
    setLoading(true);
    try {
      // ✅ PASO 1: VALIDAR CON FIREBASE (aquí se valida la contraseña)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Si la contraseña es incorrecta, Firebase lanza un error y nunca llega aquí
      const idToken = await userCredential.user.getIdToken();

      // ✅ PASO 2: Llamar al backend con el token válido
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const loggedUser: User = {
        id: data.uid,
        email: data.email,
        name: data.user_data?.name || data.name || email,
        role: role,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
      };

      setUser(loggedUser);
      localStorage.setItem("agrotraceUser", JSON.stringify(loggedUser));
      localStorage.setItem("agrotraceToken", idToken);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Traducir errores de Firebase al español
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuario no encontrado');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Contraseña incorrecta');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Email o contraseña incorrectos');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Demasiados intentos fallidos. Intenta más tarde');
      } else {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "farmer" | "buyer"
  ) => {
    setLoading(true);
    try {
      // ✅ PASO 1: Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // ✅ PASO 2: Registrar en el backend
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        // Si falla el backend, eliminar usuario de Firebase
        await userCredential.user.delete();
        throw new Error("Error en registro");
      }
      
      const data = await res.json();

      const newUser: User = {
        id: data.uid,
        email: email,
        name: name,
        role: role,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      };

      setUser(newUser);
      localStorage.setItem("agrotraceUser", JSON.stringify(newUser));
      localStorage.setItem("agrotraceToken", idToken);
    } catch (error: any) {
      console.error("Register error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email ya está registrado');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else {
        throw new Error(error.message || 'Error en registro');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem("agrotraceUser");
      localStorage.removeItem("agrotraceToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};