import { Card, PageCard } from "@/components/ui";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const summaryCards = [
  {
    title: "Total Revenue",
    value: "R$ 1.250,00",
    badge: "+12,5%",
    badgeColor: "bg-white text-green-700",
    icon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    trend: "Trending up this month",
    trendIcon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    description: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1.234",
    badge: "-20%",
    badgeColor: "bg-white text-red-700",
    icon: <ArrowDownRight className="w-4 h-4 inline ml-1" />,
    trend: "Down 20% this period",
    trendIcon: <ArrowDownRight className="w-4 h-4 inline ml-1" />,
    description: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45.678",
    badge: "+12,5%",
    badgeColor: "bg-white text-green-700",
    icon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    trend: "Strong user retention",
    trendIcon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    description: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4,5%",
    badge: "+4,5%",
    badgeColor: "bg-white text-blue-700",
    icon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    trend: "Steady performance increase",
    trendIcon: <ArrowUpRight className="w-4 h-4 inline ml-1" />,
    description: "Meets growth projections",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full max-w-3xl">
      <TabNavigation />

      <PageCard>
        <div className="flex justify-start  w-full">

        <h1 className="text-2xl font-bold text-start">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {summaryCards.map((card, idx) => (
            <Card
              key={idx}
              className="bg-gradient-to-t from-blue-800 to-blue-500 text-white shadow-none rounded-2xl p-6 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-sm text-white font-medium">
                  {card.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${card.badgeColor}`}
                >
                  {card.icon} {card.badge}
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">{card.value}</div>
              <div className="text-sm font-semibold flex items-center text-white mb-1">
                {card.trend} {card.trendIcon}
              </div>
              <div className="text-xs text-white">{card.description}</div>
            </Card>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
