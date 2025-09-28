import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("fetchUser response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (!response.data || !response.data.data || !response.data.data.token) {
        throw new Error("Login successful, but no token received from server.");
      }
      const { token } = response.data.data;

      localStorage.setItem("token", token);
      await fetchUser(); // Fetch user after login
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

      const { token } = response.data.data;

      localStorage.setItem("token", token);
      await fetchUser(); // Fetch user after registration
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
