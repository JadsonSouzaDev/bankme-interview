import { getAssignorByIdAction } from "@/app/actions/assignors.actions";
import { getPayableByIdAction } from "@/app/actions/payables.actions";
import ItemDetail from "@/components/molecules/item-detail";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";

type PayableDetailsPageProps = {
  params: { id: string };
};

export default async function PayableDetailsPage({
  params,
}: PayableDetailsPageProps) {
  const payable = await getPayableByIdAction(params.id);
  const assignor = await getAssignorByIdAction(payable.assignorId);

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <Card>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-2xl font-bold mb-3">Payable Details</h1>
          <ItemDetail label="ID" value={payable.id} />
          <ItemDetail label="Value" value={formatCurrency(payable.value)} />
          <ItemDetail
            label="Emission Date"
            value={new Date(payable.emissionDate).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          />
          <ItemDetail
            label="Assignor"
            value={assignor.name}
            href={`/assignors/${assignor.id}`}
          />
        </div>

        <div className="flex w-full pt-4">
          <Link href="/payables" className="text-base text-blue-500 hover:underline font-bold">Back to Payables</Link>
        </div>
      </Card>
    </div>
  );
}
