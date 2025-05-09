"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  // Linkによるページ遷移時、スクロール位置をトップに戻す
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
