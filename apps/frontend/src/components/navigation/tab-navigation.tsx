"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Cedentes", href: "/assignors" },
  { name: "Recebíveis", href: "/payables" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex space-x-1 p-1 rounded-full shadow-md border border-gray-100">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 text-center py-2 px-4 text-sm md:text-base font-medium rounded-full transition-colors",
                  isActive
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
