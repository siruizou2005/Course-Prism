import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";

import { BasicLayout, LoginLayout } from "@/components/layouts";
import "@/styles/global.css";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <SWRConfig value={{ shouldRetryOnError: false, revalidateOnFocus: false }}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: { colorPrimary: "#1890ff", colorInfo: "#1890ff" },
        }}
      >
        {router.pathname == "/login" ? (
          <LoginLayout>
            <Component {...pageProps} />
          </LoginLayout>
        ) : (
          <BasicLayout {...pageProps}>
            <Component {...pageProps} />
          </BasicLayout>
        )}
      </ConfigProvider>
    </SWRConfig>
  );
}

export default MyApp;
