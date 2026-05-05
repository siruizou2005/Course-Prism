import { Grid, Modal, Tabs, Typography, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import AboutCard from "@/components/about-card";
import AccountLoginForm from "@/components/account-login-form";
import EmailLoginForm from "@/components/email-login-form";
import EmailPasswordLoginForm from "@/components/email-password-login-form";
import {
  AccountLoginRequest,
  EmailLoginRequest,
  EmailPasswordLoginRequest,
} from "@/lib/models";
import {
  authEmailVerifyCode,
  emailPasswordLogin,
  jAccountAuth,
  login,
  postLogin,
} from "@/services/user";

const { Text } = Typography;

const LOGIN_FORM_HEIGHT = "184px";

const LoginPage = () => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const { code, state, next } = router.query;
  const screens = Grid.useBreakpoint();
  useEffect(() => {
    if (code) {
      jAccountAuth(
        code as string,
        state as string,
        router.basePath,
        next as string
      )
        .then((data) => {
          postLogin(data, router);
        })
        .catch(() => {
          message.error("参数错误！");
          router.replace("/login");
        });
    }
  }, [router.query]);

  const onEmailLoginFinish = (request: EmailLoginRequest) => {
    authEmailVerifyCode(request.account, request.code)
      .then((data) => {
        postLogin(data, router);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.detail || error?.message || "登录失败，请重试";
        message.error(errorMessage);
      });
  };

  const onAccountLoginFinish = (request: AccountLoginRequest) => {
    login(request.username, request.password)
      .then((data) => {
        postLogin(data, router);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.detail || error?.message || "登录失败，请重试";
        message.error(errorMessage);
      });
  };

  const onEmailPasswordLoginFinish = (request: EmailPasswordLoginRequest) => {
    emailPasswordLogin(request.account, request.password)
      .then((data) => {
        postLogin(data, router);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.detail || error?.message || "登录失败，请重试";
        message.error(errorMessage);
      });
  };

  function info() {
    modal.info({
      title: "基本原则",
      content: <AboutCard />,
      okText: "确认",
      icon: null,
      width: screens.md ? "80%" : 520,
    });
  }

  const tabItems = [
    /*{
      label: "快速登录",
      key: "jaccount",
      children: (
        <div style={{ height: "168px", display: "flex" }}>
          <Button
            style={{
              width: "100%",
              alignSelf: "center",
            }}
            size="large"
            type="primary"
            loading={code ? true : false}
            onClick={() => jAccountLogin(router.basePath, next as string)}
          >
            使用 jAccount 登录
          </Button>
        </div>
      ),
    },*/
    {
      label: "邮箱登录",
      key: "email-password",
      children: (
        <div style={{ height: LOGIN_FORM_HEIGHT }}>
          <EmailPasswordLoginForm onFinish={onEmailPasswordLoginFinish} />
        </div>
      ),
    },
    /*{
      label: "邮箱验证登录",
      key: "email",
      children: (
        <div style={{ height: LOGIN_FORM_HEIGHT }}>
          <EmailLoginForm onFinish={onEmailLoginFinish} />
        </div>
      ),
    },*/

    {
      label: "账号登录",
      key: "account",
      children: (
        <div style={{ height: LOGIN_FORM_HEIGHT }}>
          <AccountLoginForm onFinish={onAccountLoginFinish} />
        </div>
      ),
    },
  ];

  const isMobile = !screens.md;

  return (
    <div style={{ 
      minWidth: "324px", 
      marginInline: "auto",
      padding: isMobile ? "16px" : "0",
      maxWidth: isMobile ? "100%" : "400px"
    }}>
      <Head>
        <title>登录 - SWUFE选课社区</title>
      </Head>
      <Tabs defaultActiveKey="email-password" centered items={tabItems}></Tabs>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text>
          登录即表示您已阅读并同意本站
          <Typography.Link onClick={() => info()}>基本原则</Typography.Link>。{contextHolder}
        </Text>
        <div style={{ marginTop: 12 }}>
          <Text type="secondary">
            还没有账户？
            <Link href="/register" style={{ marginLeft: 4 }}>
              立即注册
            </Link>
          </Text>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/latest" style={{ 
            color: '#1890ff', 
            textDecoration: 'underline',
            fontSize: '14px'
          }}>
            预览网站
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
