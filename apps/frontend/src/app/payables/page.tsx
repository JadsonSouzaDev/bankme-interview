import { PageCard } from "@/components/ui";
import { TabNavigation } from "@/components/navigation";
import CreatePayableModal from "./_components/create-payable-modal";
import PayableTable from "./_components/payable-table";
import { getPayablesAction } from "../actions/payables.actions";

export default async function PayablesPage() {
  const { payables, total } = await getPayablesAction();

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <PageCard >
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-bold">Payables</h1>
          <CreatePayableModal />
        </div>

        <PayableTable payables={payables} total={total} />
      </PageCard>
    </div>
  );
}
