import { PageCard } from "@/components/ui";
import { TabNavigation } from "@/components/navigation/tab-navigation";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <PageCard>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-4">Visão geral do sistema</p>
          <p className="text-gray-500">
            Conteúdo do dashboard será implementado aqui.
          </p>
        </div>
      </PageCard>
    </div>
  );
}
