import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><p>Chargement...</p></div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "ROLE_ADMIN") return <Navigate to="/" replace />;
  return children;
}
