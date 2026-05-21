import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/adminApi";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
      return data;
    } catch (e) {
      const message = e.message || "Error loading users";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    setError(null);
    try {
      await createUser(userData);
      // Refetch users to get updated list with new user
      await fetchUsers();
    } catch (e) {
      const message = e.message || "Error creating user";
      setError(message);
      throw e;
    }
  }, [fetchUsers]);

  const editUser = useCallback(async (userId, userData) => {
    setError(null);
    try {
      await updateUser(userId, userData);
      // Refetch users to get updated list
      await fetchUsers();
    } catch (e) {
      const message = e.message || "Error updating user";
      setError(message);
      throw e;
    }
  }, [fetchUsers]);

  const removeUser = useCallback(async (userId) => {
    setError(null);
    try {
      await deleteUser(userId);
      // Refetch users to get updated list
      await fetchUsers();
    } catch (e) {
      const message = e.message || "Error deleting user";
      setError(message);
      throw e;
    }
  }, [fetchUsers]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const value = {
    users,
    loading,
    error,
    setError,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within UsersProvider");
  }
  return context;
}
