import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Building2, Users, BarChart3, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Properties",
    value: "128",
    icon: Building2,
    change: "+12%",
  },
  {
    title: "Active Agents",
    value: "24",
    icon: Users,
    change: "+3%",
  },
  {
    title: "Monthly Views",
    value: "45.2K",
    icon: BarChart3,
    change: "+18%",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    icon: TrendingUp,
    change: "+0.5%",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your property management.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
