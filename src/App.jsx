import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AnimatePresence } from "framer-motion";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

import BottomNavBar from "./components/layout/BottomNavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import QuizPage from "./pages/QuizPage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler"; // Import the new component

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {isAuthenticated && <BottomNavBar />}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* NEW: Route to handle the OAuth2 redirect */}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Protected Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Default route logic */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" />
              ) : user?.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/user" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
