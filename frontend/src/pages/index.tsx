import { useRouter } from "next/router";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.replace("/latest");
  }, [router.isReady, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#999" }}>
      正在跳转...
    </div>
  );
};

export default HomePage;