import React, { createContext, useContext, useState, useEffect } from "react";
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

const API_URL = "http://127.0.0.1:5000/api/auth"; // 👈 backend local

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("agrotraceUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("agrotraceUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "farmer" | "buyer"
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }

      const loggedUser: User = {
        id: data.uid,
        email: data.email,
        name: data.user_data.name,
        role: data.user_data.role,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${data.user_data.name}`,
      };

      setUser(loggedUser);
      localStorage.setItem("agrotraceUser", JSON.stringify(loggedUser));
      localStorage.setItem("agrotraceToken", data.token);
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
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // aquí sí mandamos role
      });

      if (!res.ok) throw new Error("Error en registro");
      const data = await res.json();

      const newUser: User = {
        id: data.uid,
        email: data.email,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      };

      setUser(newUser);
      localStorage.setItem("agrotraceUser", JSON.stringify(newUser));
      localStorage.setItem("agrotraceToken", data.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrotraceUser");
    localStorage.removeItem("agrotraceToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
