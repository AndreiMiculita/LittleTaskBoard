// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import AuthService from './Services/AuthService.tsx'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const authService = new AuthService();
  const isLoggedIn = authService.isLoggedIn()

  if (isLoggedIn) {
    return children
  }
  return <Navigate to="/login" state={{ from: '/' }} replace />
}

export default PrivateRoute