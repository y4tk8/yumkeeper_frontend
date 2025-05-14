import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ScrollToTopOnRouteChange from "@/components/layout/ScrollToTopOnRouteChange";
import { Toaster } from "@/components/ui/shadcn/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yum Keeper - 料理レシピ保存サービス",
  description: `Yum Keeperは、あなたの料理レシピをYouTube動画と共に簡単に保存・整理できるアプリです。レシピに必要な材料や調味料を、
                該当のレシピ動画と一緒に便利に管理できます。「料理レシピは活字より動画派」というあなたにピッタリのサービスです。`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <ScrollToTopOnRouteChange />
          <Header />
          <main role="main">
            <Container>{children}</Container>
          </main>
          <Footer />
        </AuthProvider>

        {/* フラッシュ */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: "max-w-3xl mx-auto w-full z-[9999]",
            },
          }}
        />
      </body>
    </html>
  );
}
