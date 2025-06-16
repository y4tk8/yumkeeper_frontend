import { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function NotFound() {
  return (
    <Container>
      <main className="flex flex-col items-center justify-center min-h-screen text-center font-sans">
        <div className="flex items-center">
          <Image
            src="/images/404.png"
            alt="ページが見つかりませんでした"
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
            <div className="text-[6rem] font-bold leading-[2]">404</div>
            <div className="text-[2.5rem] font-normal" id="error-heading">
              Not Found
            </div>
          </div>
        </div>

        <p className="mt-12 text-[1.1rem] text-black">
          お探しのページは見つかりませんでした。
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
