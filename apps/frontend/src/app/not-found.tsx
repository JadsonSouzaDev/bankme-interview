import { Button, Card } from "@/components/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <h1 className="text-7xl font-bold text-blue-500">404</h1>
        <p className="text-xl font-bold ">Page Not Found</p>
        <p className="opacity-80 ">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Go to home</Button>
        </Link>
      </Card>
    </div>
  );
}
