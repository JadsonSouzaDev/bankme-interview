import {
  Card,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { getAssignorsAction } from "../actions/assignors.actions";
import CreateAssignorModal from "./_components/create-assignor-modal";

export default async function AssignorsPage() {
  const { assignors, total } = await getAssignorsAction();
  
  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <Card>
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-bold">Assignors</h1>
          <CreateAssignorModal />
        </div>

        <Table>
          <TableCaption>A list of your recent assignors: <span className="font-bold">{total} assignor(s)</span></TableCaption>
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
                <TableCell className="font-medium hidden md:table-cell">{assignor.id}</TableCell>
                <TableCell className="font-medium">{assignor.name}</TableCell>
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
