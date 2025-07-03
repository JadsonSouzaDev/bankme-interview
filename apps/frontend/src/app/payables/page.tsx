import { Card } from "@/components/ui/card";
import { TabNavigation } from "@/components/navigation/tab-navigation";

export default function PayablesPage() {
  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recebíveis</h2>
          <p className="text-gray-600 mb-4">
            Gerencie os recebíveis do sistema
          </p>
          <p className="text-gray-500">
            Conteúdo da tab de recebíveis será implementado aqui.
          </p>
        </div>
      </Card>
    </div>
  );
}
