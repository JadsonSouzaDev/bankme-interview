import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn("flex flex-col items-center bg-white/80 backdrop-blur-md p-4 md:p-8 sm:rounded-2xl sm:border border-gray-500/5 w-full space-y-4 shadow-2xl", className)}>
      {children}
    </div>
  );
};

const PageCard = ({ children }: CardProps) => {
  return (
    <Card className="min-h-[450px] max-h-[450px] lg:min-h-[600px] lg:max-h-[600px] overflow-y-hidden overflow-x-hidden">
      {children}
    </Card>
  );
};

export { Card, PageCard };