"use client"

import { useEffect } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "500 Internal Server Error",
};

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("App error:", error);
    }
  }, [error]);

  return (
    <Container>
      <main className="flex flex-col items-center justify-center min-h-screen text-center font-sans">
        <div className="flex items-center">
          <Image
            src="/images/500.png"
            alt="サーバーエラーが発生しました"
            width={9999}
            height={9999}
            style={{
              maxHeight: "340px",
              height: "auto",
              width: "auto",
            }}
            priority
          />
          <div className="flex flex-col justify-center h-full">
            <div className="text-[6rem] font-bold leading-[2]">500</div>
            <div className="text-[2.5rem] font-normal" id="error-heading">
              Server Error
            </div>
          </div>
        </div>

        <p className="mt-12 text-[1.1rem] text-black leading-[2.5rem] whitespace-pre-line">
          予期せぬエラーが発生しました。
          {"\n"}ご不便をおかけしますが、しばらくしてからお試しください。
        </p>
        <a
          href="https://www.yumkeeper.net"
          className="mt-10 text-[1.1rem] text-blue-600 hover:underline"
        >
          トップへ戻る
        </a>
      </main>
    </Container>
  );
}
