import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function SingUpPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">サインアップ</h2>

      <form className="space-y-4">
        <InputField type="email" placeholder="メールアドレス" />
        <InputField type="password" placeholder="パスワード" />
        <InputField type="password" placeholder="パスワード確認用" />

        <p className="text-sm text-gray-600">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            パスワードを忘れた場合はこちら
          </Link>
        </p>

        <Button type="submit" fullWidth>
          サインアップ
        </Button>
      </form>

      <div className="flex justify-between text-sm">
        <span>アカウントをお持ちですか？</span>
        <Link href="/signin" className="text-blue-600 hover:underline">
          サインインはこちら
        </Link>
      </div>

      {/* 区切り線 */}
      <div className="relative y-6">
        <div className="absolute inset-x-4 top-1/2 h-px bg-gray-300"></div>
      </div>

      <Button variant="outline" fullWidth>
        ゲストとしてログインする
      </Button>
    </div>
  );
}
