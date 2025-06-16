import { Metadata } from "next";
import Image from "next/image";
import "@/app/styles/error.css"

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function NotFound() {
  return (
    <main role="main">
      <div className="content" aria-labelledby="error-heading">
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
        <div className="error-text">
          <div className="error-code">404</div>
          <div className="error-message" id="error-heading">
            Not Found
          </div>
        </div>
      </div>

      <p className="description">
        お探しのページは見つかりませんでした。
      </p>
      <a href="https://www.yumkeeper.net" className="back-link">
        トップへ戻る
      </a>
    </main>
  );
}
