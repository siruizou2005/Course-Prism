import { Layout, Space, Grid } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import AnnouncementList from "@/components/announcement-list";
import NavBar from "@/components/navbar";
import { CommonInfoContext } from "@/lib/context";
import { useCommonInfo } from "@/services/common";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export const BasicLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const screens = useBreakpoint();

  const { commonInfo, error } = useCommonInfo();
  const router = useRouter();
  
  useEffect(() => {
    if (error?.response?.status == 403 && mounted) {
      const pathname = window.location.pathname;
      router.replace({ pathname: "/login", query: { next: pathname } });
    }
  }, [error, mounted, router]);

  // Use isomorphic layout effect to prevent hydration issues
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Render a minimal loading state to prevent layout shift
  if (!mounted) {
    return (
      <Layout className="basic-layout">
        <Header className="header" style={{ height: 64 }} />
        <Content className="content" style={{ minHeight: 'calc(100vh - 64px)' }} />
        <Footer className="footer" style={{ height: 64, textAlign: 'center' }}>
          <div>
            ©2025 SWUFE选课社区{' '}
            <a 
              href="https://beian.miit.gov.cn" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'none' }}
            >
              鄂ICP备2025142392号-1
            </a>
          </div>
        </Footer>
      </Layout>
    );
  }

  return (
    <CommonInfoContext.Provider value={commonInfo}>
      <Layout className="basic-layout">
        <Header className="header">
          <NavBar user={commonInfo?.user} />
        </Header>

        <Content
          className="content"
          style={{ 
            paddingInline: screens.xs ? 8 : 16, 
            paddingLeft: screens.xs ? 8 : 16, 
            paddingRight: screens.xs ? 8 : 16 
          }}
        >
          {commonInfo?.announcements && commonInfo.announcements.length > 0 && (
            <AnnouncementList announcements={commonInfo.announcements} />
          )}
          {children}
        </Content>
        <Footer className="footer">
          <Space>
            <Link href="/about">关于</Link>
            <Link href="/faq">常见问题</Link>
            <Link href="/report">反馈</Link>
          </Space>
          <div>
            ©2025 SWUFE选课社区{' '}
            <a 
              href="https://beian.miit.gov.cn" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'none' }}
            >
              鄂ICP备2025142392号-1
            </a>
          </div>
        </Footer>
      </Layout>
    </CommonInfoContext.Provider>
  );
};

export const LoginLayout = ({ children }: React.PropsWithChildren<{}>) => (
  <Layout className="login-layout">
    <Header className="header">
      <div className="title">SWUFE选课社区</div>
    </Header>
    <Content className="content">{children}</Content>
  </Layout>
);
