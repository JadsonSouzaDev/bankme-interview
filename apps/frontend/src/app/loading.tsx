import { Card } from "@/components/ui";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Card>
        <Image src="/logo.png" alt="Loading" width={100} height={100} className="animate-pulse" />
        <p className="text-xl font-bold text-blue-500 animate-pulse">Loading...</p>
      </Card>
    </div>
  );
}
