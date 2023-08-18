import React, { lazy, Suspense, useEffect } from 'react'
import FadingBalls from 'react-cssfx-loading/lib/FadingBalls'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import AdminMenu from './Admin/components/menu'
import { getSettings, getUser } from '../utils/api'
import { useQueryUser } from '../lib/hooks'
import Header from './Admin/components/menu/header'

const HomePage = lazy(() =>
  import('./Home').then((module) => ({
    default: module.default,
  }))
)

const NotFoundPage = lazy(() =>
  import('./NotFound').then((module) => ({
    default: module.default,
  }))
)

const LoginPage = lazy(() =>
  import('./Admin/login').then((module) => ({
    default: module.default,
  }))
)

const RegisterPage = lazy(() =>
  import('./Admin/register').then((module) => ({
    default: module.default,
  }))
)

const AdminDashboardPage = lazy(() =>
  import('./Admin/dashboard').then((module) => ({
    default: module.default,
  }))
)

const AdminPrizesPage = lazy(() =>
  import('./Admin/prizes').then((module) => ({
    default: module.default,
  }))
)

const AdminSettingsPage = lazy(() =>
  import('./Admin/settings').then((module) => ({
    default: module.default,
  }))
)

const AdminUserPage = lazy(() =>
  import('./Admin/user').then((module) => ({
    default: module.default,
  }))
)

const AdminRedeemPage = lazy(() =>
  import('./Admin/redeem').then((module) => ({
    default: module.default,
  }))
)

const PrivateRoute: React.FC<any> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('@Auth:token')
  // const auth = true // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return isLoggedIn ? children : <Navigate to="/admin/login" />
}

const AppRoutes: React.FC = () => {
  const [queryUser, setQueryUser] = useQueryUser()
  const params = useParams()

  // const [user, setUser] = useState <any>()

  useEffect(() => {
    const ac = new AbortController()
    const loggedInUser = localStorage.getItem('@Auth:token')
    if (loggedInUser && loggedInUser !== 'undefined') {
      // const foundUser = JSON.parse(loggedInUser)
      getUser().then((resp) => {
        const { data, error } = resp
        if (!error) {
          setQueryUser(data.user)
        }
      })
    }
    return () => ac.abort()
  }, [])

  return (
    <div className="App">
      <Suspense
        fallback={
          <div className="App">
            <div className="center-page flex-1">
              <FadingBalls
                color="#222222"
                width="8px"
                height="8px"
                duration=".45s"
              />
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/:admin_id/win" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div className="page-container">
                  <Header />
                  <div className="sub-container">
                    <AdminMenu />
                    <div className="side-container">
                      <AdminDashboardPage />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterPage />} />

          <Route
            path="/admin/prizes"
            element={
              <PrivateRoute>
                <div className="page-container">
                  <Header />
                  <div className="sub-container">
                    <AdminMenu />
                    <div className="side-container">
                      <AdminPrizesPage />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <div className="page-container">
                  <Header />
                  <div className="sub-container">
                    <AdminMenu />
                    <div className="side-container">
                      <AdminSettingsPage />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/user"
            element={
              <PrivateRoute>
                <div className="page-container">
                  <Header />
                  <div className="sub-container">
                    <AdminMenu />
                    <div className="side-container">
                      <AdminUserPage />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/redeem/:id/:name/:admin_id"
            element={
              <PrivateRoute>
                <div className="page-container">
                  <Header />
                  <div className="sub-container">
                    <AdminMenu />
                    <div className="side-container">
                      <AdminRedeemPage />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}
export default AppRoutes
