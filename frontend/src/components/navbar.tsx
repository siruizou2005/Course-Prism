import {
  DollarOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Col, Dropdown, Menu, Row, Grid, Drawer } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { User } from "@/lib/models";
import { logout, toAdmin } from "@/services/user";

const { useBreakpoint } = Grid;

const NavBar = ({ user }: { user?: User }) => {
  const router = useRouter();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = !screens.md;

  const handleMenuClick = (e: { key: string }) => {
    if (e.key == "logout") {
      logout(router.basePath, router);
    } else if (e.key == "login") {
      router.push("/login");
    } else if (e.key == "account") {
      if (user?.is_staff) toAdmin();
    } else {
      router.push(e.key);
    }
    // 关闭移动端抽屉
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  // 根据用户登录状态显示不同的下拉菜单
  const dropMenuItems: MenuProps["items"] = user ? [
    // 已登录用户菜单
    {
      key: "account",
      label: user?.account,
      icon: <UserOutlined />,
    },
    { key: "/point", label: "社区积分", icon: <DollarOutlined /> },
    { key: "/activity", label: "我的点评", icon: <ProfileOutlined /> },
    { key: "/sync", label: "同步课表", icon: <SyncOutlined /> },
    { key: "/preference", label: "偏好设置", icon: <SettingOutlined /> },
    { type: "divider", key: "divider" },
    { key: "logout", label: "登出", icon: <LogoutOutlined />, danger: true },
  ] : [
    // 未登录用户菜单
    { key: "login", label: "登入", icon: <LoginOutlined /> },
    { key: "/register", label: "注册", icon: <UserOutlined /> },
  ];

  const navItems = [
    { label: "发现", value: "/latest" },
    { label: "关注", value: "/follow-review" },
    { label: "课程", value: "/courses" },
    { label: "关于", value: "/about-project" },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const navMenuItems = navItems.map((item) => {
    return {
      key: item.value,
      label: <Link href={item.value}>{item.label}</Link>,
      onClick: () => handleNavClick(item.value),
    };
  });

  return (
    <>
      <Row className="navbar" align="middle">
        <Col flex="auto">
          <Link href="/latest" className="title">
            SWUFE选课社区
          </Link>
        </Col>

        {!isMobile ? (
          // 桌面端导航
          <>
            <Col className="col-menu" flex="auto">
              <Menu
                selectedKeys={[router.pathname]}
                className="menu"
                mode="horizontal"
                items={navMenuItems}
              />
            </Col>
            <Col>
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                className="search-button"
                onClick={() => router.push("/courses")}
              />
            </Col>
            <Col>
              <Dropdown menu={{ onClick: handleMenuClick, items: dropMenuItems }}>
                <Button shape="circle" icon={<UserOutlined />} />
              </Dropdown>
            </Col>
          </>
        ) : (
          // 移动端导航
          <>
            <Col>
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                className="search-button"
                onClick={() => router.push("/courses")}
              />
            </Col>
            <Col>
              <Button
                shape="circle"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
            </Col>
          </>
        )}
      </Row>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
      >
        <Menu
          selectedKeys={[router.pathname]}
          mode="vertical"
          items={navMenuItems}
          style={{ border: 'none' }}
        />
        <div style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
          <Menu
            mode="vertical"
            items={dropMenuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default NavBar;
