import { getAssignorByIdAction } from "@/app/actions/assignors.actions";
import ItemDetail from "@/components/molecules/item-detail";
import { Card } from "@/components/ui";
import Link from "next/link";

type AssignorDetailsPageProps = {
  params: { id: string };
};

export default async function AssignorDetailsPage({
  params,
}: AssignorDetailsPageProps) {
  const assignor = await getAssignorByIdAction(params.id);

  return (
    <div className="flex flex-col w-full max-w-3xl">
      <Card>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-2xl font-bold mb-3">Assignor Details</h1>
          <ItemDetail label="ID" value={assignor.id} />
          <ItemDetail label="Name" value={assignor.name} />
          <ItemDetail label="Document" value={assignor.document} />
          <ItemDetail label="Email" value={assignor.email} />
          <ItemDetail label="Phone" value={assignor.phone} />
        </div>

        <div className="flex w-full pt-4">
          <Link
            href="/assignors"
            className="text-base text-blue-500 hover:underline font-bold"
          >
            Back to Assignors
          </Link>
        </div>
      </Card>
    </div>
  );
}
