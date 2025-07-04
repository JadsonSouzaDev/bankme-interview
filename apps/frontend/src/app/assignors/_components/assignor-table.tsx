import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignorDto } from "@bankme/shared";
import Link from "next/link";

type AssignorTableProps = {
  assignors: AssignorDto[];
  total: number;
};

const AssignorTable = ({
  assignors,
  total,
}: AssignorTableProps) => {
  return (
    <Table>
      <TableCaption>
        A list of your recent assignors:{" "}
        <span className="font-bold">{total} assignor(s)</span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignors.map((assignor) => (
          <TableRow key={assignor.id}>
            <TableCell className="font-medium hidden md:table-cell">
              {assignor.id}
            </TableCell>
            <TableCell className="font-medium">{assignor.name}</TableCell>
            <TableCell className="flex gap-2 justify-end">
              <Link href={`/assignors/${assignor.id}`} className="text-sm text-blue-500 hover:underline font-bold">View</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssignorTable;
