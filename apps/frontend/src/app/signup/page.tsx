import Image from "next/image";
import { Button, Input, Label, Card } from "@/components/ui";
import Link from "next/link";

export default function Signup() {
  return (
      <div className="flex-1 flex items-center justify-center -mt-[44px]">
        <div className="max-w-md w-full sm:space-y-8">
          <div className="flex justify-center">
            <Image src="/logo-full.png" alt="Bankme" width={200} height={44} />
          </div>
          <Card>
          <form className="w-full">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="login"
                  required
                  placeholder="Enter your login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <p className="text-blue-500/80 text-xs">
                By signing up, you agree to our <Link href="/terms" className="text-blue-500 font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 font-bold">Privacy Policy</Link>
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-4 mt-8">
              
              <Button className="w-full" variant="default">
                Signup
              </Button>
              <div className="flex justify-center">
                <p className="text-sm text-blue-500/80">
                  Already have an account? <Link href="/login" className="text-blue-500 font-bold">Login</Link>
                </p>
              </div>
            </div>
          </form>
          </Card>
        </div>
      </div>
    
  );
}
