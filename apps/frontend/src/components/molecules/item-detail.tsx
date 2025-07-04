import Link from "next/link";

type ItemDetailProps = {
  label: string;
  value: string | number | boolean;
  href?: string;
};

const ItemDetail = ({ label, value, href }: ItemDetailProps) => {
  return (
    <div className="flex gap-2 text-sm">
      <span>{label}:</span>
      <span className="font-bold">
        {href ? <Link href={href} className="hover:underline text-blue-500">{value}</Link> : value}
      </span>
    </div>
  );
};

export default ItemDetail;
