const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md p-8 sm:rounded-2xl sm:border border-gray-500/5 w-full space-y-4 shadow-2xl">
      {children}
    </div>
  );
};

export { Card };