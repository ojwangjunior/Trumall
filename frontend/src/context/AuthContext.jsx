import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: decodedToken.sub, email: decodedToken.email, roles: decodedToken.roles, name: decodedToken.name });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      // Extract the token from the nested 'data' object.
      if (!response.data || !response.data.data || !response.data.data.token) {
        throw new Error("Login successful, but no token received from server.");
      }
      const { token } = response.data.data;

      localStorage.setItem("token", token);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: decodedToken.sub, email: decodedToken.email, roles: decodedToken.roles, name: decodedToken.name });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error("Invalid email or password. Please try again.");
      } else {
        console.error("Login error:", error);
        throw new Error("Login failed. Please try again later.");
      }
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      // Extract the token from the nested 'data' object.
      const { token } = response.data.data;

      localStorage.setItem("token", token);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: decodedToken.sub, email: decodedToken.email, roles: decodedToken.roles, name: decodedToken.name });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data && (error.response.data.error || error.response.data.message)) {
        throw new Error(error.response.data.error || error.response.data.message);
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    }
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
