import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You might want to verify the token with the backend here
      // For now, we'll just assume the token is valid
      // and decode it to get user info.
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: decodedToken.sub, email: decodedToken.email, role: decodedToken.role });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });

    // --- CHANGE START ---
    // Extract the token from the nested 'data' object.
    const { token } = response.data.data;
    // --- CHANGE END ---

    localStorage.setItem("token", token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUser({ id: decodedToken.sub, email: decodedToken.email, role: decodedToken.role });
  };

  const register = async (name, email, password, role) => {
    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      {
        name,
        email,
        password,
        role,
      }
    );

    // --- CHANGE START ---
    // Extract the token from the nested 'data' object.
    const { token } = response.data.data;
    // --- CHANGE END ---

    localStorage.setItem("token", token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUser({ id: decodedToken.sub, email: decodedToken.email, role: decodedToken.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
