import React, { lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import AdminMenu from './components/menu'

const AdminDashboardPage = lazy(() =>
  import('./dashboard').then((module) => ({
    default: module.default,
  }))
)

const AdminSettingsPage = lazy(() =>
  import('./settings').then((module) => ({
    default: module.default,
  }))
)

const PrivateRoute = () => {
  const auth = true // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/notfound" />
}

const Admin: React.FC = () => {
  return (
    <div className="page-container">
      <AdminMenu />
      <div className="side-container">
        <Routes>
          <Route path="/" element={<AdminSettingsPage />} />
          <Route path="settings" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin
