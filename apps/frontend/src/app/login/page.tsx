import Image from "next/image";
import { Card } from "@/components/ui";
import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center -mt-[44px]">
      <div className="max-w-md w-full sm:space-y-8">
        <div className="flex justify-center">
          <Image src="/logo-full.png" alt="Bankme" width={200} height={44} />
        </div>
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
