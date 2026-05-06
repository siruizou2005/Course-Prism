import { Layout, Grid } from "antd";
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
          <div>©2026 SWUFE选课社区</div>
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
        <Footer className="footer" style={{ textAlign: "left", background: "#fafbfd", borderTop: "1px solid #e6e8ee", padding: "56px 32px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="2" width="24" height="24" rx="7" fill="#2563eb"/>
                  <path d="M8 14.5l4 4 8-9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>SWUFE<span style={{ fontWeight: 500, color: "#334155" }}>选课社区</span></span>
              </div>
              <p style={{ color: "#64748b", margin: 0, maxWidth: 280, lineHeight: 1.6, fontSize: 13.5 }}>由学生自治维护的西南财经大学选课点评社区。</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>浏览</div>
              {[["courses", "课程库"], ["courses", "教师库"], ["/latest", "最新点评"]].map(([href, label]) => (
                <Link key={label} href={href} style={{ color: "#64748b", fontSize: 13.5, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>参与</div>
              {[["/write-review", "写点评"], ["/report", "反馈建议"]].map(([href, label]) => (
                <Link key={label} href={href} style={{ color: "#64748b", fontSize: 13.5, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>关于</div>
              {[["/about", "关于我们"], ["/faq", "常见问题"], ["/report", "联系我们"]].map(([href, label]) => (
                <Link key={label} href={href} style={{ color: "#64748b", fontSize: 13.5, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "40px auto 0", paddingTop: 18, borderTop: "1px solid #e6e8ee", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#94a3b8" }}>
            <span>© 2026 SWUFE 选课社区 · 学生自治项目</span>
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
