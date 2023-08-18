import React from 'react'
import { Menu } from 'antd'
import {
  HomeOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useMedia, useQueryUser } from '../../../../lib/hooks'

const { SubMenu } = Menu

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4']

const AdminMenu: React.FC = () => {
  const [openKeys, setOpenKeys] = React.useState(['sub1'])
  const mediaQuery = useMedia('(min-width: 768px)')
  const [queryUser] = useQueryUser()

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey: string = keys.find(
      (key: string) => openKeys.indexOf(key) === -1
    ) as string
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <>
      <Menu
        mode={mediaQuery ? 'inline' : 'horizontal'}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          width: mediaQuery ? 220 : '100%',
          position: 'sticky',
          top: 60,
          zIndex: 999,
          height: mediaQuery ? '100vh' : 'auto',
        }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/admin">Home</Link>
        </Menu.Item>
        {queryUser.role === 'admin' && (
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/user">Vendors</Link>
          </Menu.Item>
        )}
        {queryUser.role === 'admin' && (
          <Menu.Item key="3" icon={<ShopOutlined />}>
            <Link to="/admin/prizes">Prizes</Link>
          </Menu.Item>
        )}
        {queryUser.role === 'admin' && (
          <Menu.Item key="4" icon={<SettingOutlined />}>
            <Link to="/admin/settings">Settings</Link>
          </Menu.Item>
        )}
      </Menu>
    </>
  )
}
export default AdminMenu
