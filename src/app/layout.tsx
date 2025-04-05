import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yum Keeper - 料理レシピ保存サービス",
  description: `Yum Keeperは、あなたの料理レシピをYouTube動画と共に簡単に保存・整理できるアプリです。レシピに必要な材料や調味料を、
                該当のレシピ動画と一緒に便利に管理できます。「料理レシピは活字より動画派」というあなたにピッタリのサービスです。`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <AuthProvider>
          <Header />
          <main>
            <Container>{children}</Container>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
