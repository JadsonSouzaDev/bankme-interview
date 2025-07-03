import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex flex-col bg-gradient-to-t from-blue-800 to-blue-500 h-[50vh] absolute bottom-0 left-0 w-full">
      <div className="flex flex-col items-center justify-end h-full space-y-4 pb-4">
        <Image src="/logo-white.webp" alt="Bankme" width={103} height={19} />
        <p className="text-white text-sm text-center">
          We are the largest Securitization Manager in Brazil
        </p>
        <a
          href="https://www.bankme.com.br"
          target="_blank"
          className="text-white text-sm text-center font-bold"
        >
          Go to official website
        </a>
      </div>
    </div>
  );
};

export default Footer;
