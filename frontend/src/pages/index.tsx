import { useRouter } from "next/router";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace("/latest");
    }
  }, [router.isReady]);

  return null;
};

export default HomePage;