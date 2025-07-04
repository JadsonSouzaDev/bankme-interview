import {
  Card,
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { getPayablesAction } from "../actions/payables.actions";
import CreatePayableModal from "./_components/create-payable-modal";

export default async function PayablesPage() {
  const { payables, total } = await getPayablesAction();
  console.log(payables);

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <Card>
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-bold">Payables</h1>
          <CreatePayableModal />
        </div>

        <Table>
          <TableCaption>
            A list of your recent payables:{" "}
            <span className="font-bold">{total} payable(s)</span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell w-[100px]">
                ID
              </TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Emission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payables.map((payable) => (
              <TableRow key={payable.id}>
                <TableCell className="font-medium hidden md:table-cell">
                  {payable.id}
                </TableCell>
                <TableCell className="font-medium">{payable.value}</TableCell>
                <TableCell className="font-medium">
                  {new Date(payable.emissionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  {/* Add actions here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
