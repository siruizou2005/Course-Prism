import { useRouter } from "next/router";
import { useEffect } from "react";

const SearchRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const { q, page, size } = router.query;
    const query: Record<string, string> = {};
    if (q) query.q = q as string;
    if (page) query.page = page as string;
    if (size) query.size = size as string;
    router.replace({ pathname: "/courses", query });
  }, [router.isReady, router.query]);
  return null;
};

export default SearchRedirect;
