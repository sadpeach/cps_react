import "antd/dist/antd.css";
import {Layout, Menu, Breadcrumb} from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import React,{useState}from 'react';
import { Link } from 'react-router-dom'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

export default function Navbar({children}){
    return (
      <Layout>
    {/* <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header> */}
    <Layout>
      <Sider width={300} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="All Functions">
            <Menu.Item key="1">
              <Link to='/'>
                Read Sign
              </Link>
              </Menu.Item>
              <Menu.Item key="2">
              <Link to='/uploadsign'>
                Upload Sign
              </Link>
              </Menu.Item>
          </SubMenu>

        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  </Layout>);
  }
