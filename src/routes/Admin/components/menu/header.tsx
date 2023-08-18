import { Button } from 'antd'
import React from 'react'
import { useQueryUser } from '../../../../lib/hooks'
import { initialUserState } from '../../../../redux/reducers/userReducer'
import { logoutUser } from '../../../../utils/api'

const Header: React.FC = () => {
  const [user, setUser] = useQueryUser()

  const handleLogin = async () => {
    const response = await logoutUser()
    if (!response.error) {
      localStorage.removeItem('@Auth:token')
      setUser(initialUserState)
    }
  }

  return (
    <header className="admin-header">
      <div style={{ marginRight: '10px' }}>
        <p>Welcome {user?.fullname}</p>
      </div>
      <Button
        type="primary"
        size="large"
        className="primary"
        onClick={handleLogin}
      >
        Log out
      </Button>
    </header>
  )
}
export default Header
