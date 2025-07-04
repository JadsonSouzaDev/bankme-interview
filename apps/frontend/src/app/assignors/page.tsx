import { PageCard } from "@/components/ui";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { getAssignorsAction } from "../actions/assignors.actions";
import CreateAssignorModal from "./_components/create-assignor-modal";
import AssignorTable from "./_components/assignor-table";

export default async function AssignorsPage() {
  const { assignors, total } = await getAssignorsAction();

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <PageCard>
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-bold">Assignors</h1>
          <CreateAssignorModal />
        </div>

        <AssignorTable assignors={assignors} total={total} />
      </PageCard>
    </div>
  );
}
