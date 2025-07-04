import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui";
import { PayableDto } from "@bankme/shared";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";
import EditPayableModal from "./edit-payable-modal";
import DeletePayableModal from "./delete-payable-modal";

type PayableTableProps = {
  payables: PayableDto[];
  total: number;
};

const PayableTable = ({
  payables,
  total,
}: PayableTableProps) => {
  return (
    <Table>
      <TableCaption>
        A list of your recent payables:{" "}
        <span className="font-bold">{total} payable(s)</span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell w-[100px]">ID</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Emission Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payables.map((payable) => (
          <TableRow key={payable.id} >
            <TableCell className="font-medium hidden md:table-cell">
              {payable.id}
            </TableCell>
            <TableCell className="font-medium">{formatCurrency(payable.value)}</TableCell>
            <TableCell className="font-medium">
              {new Date(payable.emissionDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}
            </TableCell>
            <TableCell className="flex gap-2 justify-end">
              <Link href={`/payables/${payable.id}`} className="text-sm text-blue-500 hover:underline font-bold">View</Link>
              <EditPayableModal payable={payable} />
              <DeletePayableModal payable={payable} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PayableTable;
