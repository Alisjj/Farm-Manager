"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Calculator, Target, AlertCircle } from "lucide-react"

export function CostAnalysis() {
  const costBreakdown = {
    feedCost: 8.5,
    laborCost: 2.8,
    fixedCosts: 1.5,
    healthCosts: 0.7,
    total: 13.5,
  }

  const pricingRecommendations = {
    gradeA: { cost: 13.5, markup: 25, suggested: 16.88, current: 18.0 },
    gradeB: { cost: 13.5, markup: 20, suggested: 16.2, current: 17.0 },
    gradeC: { cost: 13.5, markup: 15, suggested: 15.53, current: 16.0 },
  }

  const monthlyProjection = {
    avgDailyProduction: 420,
    avgCostPerEgg: 13.5,
    avgSellingPrice: 17.0,
    profitPerEgg: 3.5,
    monthlyProfit: 44100,
  }

  const costTrends = [
    { month: "Sep", feedCost: 9.2, laborCost: 2.6, totalCost: 14.2 },
    { month: "Oct", feedCost: 8.9, laborCost: 2.7, totalCost: 13.9 },
    { month: "Nov", feedCost: 8.6, laborCost: 2.75, totalCost: 13.65 },
    { month: "Dec", feedCost: 8.4, laborCost: 2.8, totalCost: 13.5 },
    { month: "Jan", feedCost: 8.5, laborCost: 2.8, totalCost: 13.5 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-balance">Cost Analysis</h2>
        <p className="text-muted-foreground">Real-time cost calculations and pricing recommendations</p>
      </div>

      {/* Cost Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Egg</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{costBreakdown.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-chart-5" />
              -3.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit per Egg</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">₦{monthlyProjection.profitPerEgg}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-chart-5" />
              At current prices
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">₦{monthlyProjection.monthlyProfit.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Projected for January</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20.6%</div>
            <div className="text-xs text-muted-foreground">Above industry average</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown per Egg</CardTitle>
            <CardDescription>Detailed analysis of production costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Feed Cost</div>
                  <div className="text-xs text-muted-foreground">
                    {((costBreakdown.feedCost / costBreakdown.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₦{costBreakdown.feedCost}</div>
                </div>
              </div>
              <Progress value={(costBreakdown.feedCost / costBreakdown.total) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Labor Cost</div>
                  <div className="text-xs text-muted-foreground">
                    {((costBreakdown.laborCost / costBreakdown.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₦{costBreakdown.laborCost}</div>
                </div>
              </div>
              <Progress value={(costBreakdown.laborCost / costBreakdown.total) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Fixed Costs</div>
                  <div className="text-xs text-muted-foreground">
                    {((costBreakdown.fixedCosts / costBreakdown.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₦{costBreakdown.fixedCosts}</div>
                </div>
              </div>
              <Progress value={(costBreakdown.fixedCosts / costBreakdown.total) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Health Costs</div>
                  <div className="text-xs text-muted-foreground">
                    {((costBreakdown.healthCosts / costBreakdown.total) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₦{costBreakdown.healthCosts}</div>
                </div>
              </div>
              <Progress value={(costBreakdown.healthCosts / costBreakdown.total) * 100} className="h-2" />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="font-medium">Total Cost per Egg</div>
              <div className="text-xl font-bold">₦{costBreakdown.total}</div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Recommendations</CardTitle>
            <CardDescription>Suggested prices based on cost + margin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(pricingRecommendations).map(([grade, data]) => (
              <div key={grade} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Grade {grade.slice(-1).toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">Break-even + {data.markup}% margin</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">₦{data.suggested}/egg</div>
                    <div className="text-xs text-muted-foreground">Current: ₦{data.current}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm">Suggested:</div>
                  <Badge variant="outline">₦{(data.suggested * 12).toFixed(0)}/dozen</Badge>
                  {data.current > data.suggested ? (
                    <Badge variant="default" className="text-xs">
                      Above recommended
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Below recommended
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-accent" />
                <div className="text-sm font-medium">Pricing Insights</div>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Your Grade A pricing is optimal for market conditions</p>
                <p>• Consider increasing Grade B prices by ₦0.80/egg</p>
                <p>• Grade C margins could be improved by ₦0.47/egg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Trends (Last 5 Months)</CardTitle>
          <CardDescription>Track cost changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costTrends.map((trend, index) => (
              <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="font-medium w-12">{trend.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Feed: ₦{trend.feedCost}</span>
                    <span>Labor: ₦{trend.laborCost}</span>
                    <span className="font-medium">Total: ₦{trend.totalCost}</span>
                  </div>
                  <Progress value={(trend.totalCost / 16) * 100} className="h-2" />
                </div>
                {index > 0 && (
                  <div className="ml-4">
                    {trend.totalCost < costTrends[index - 1].totalCost ? (
                      <TrendingDown className="h-4 w-4 text-chart-5" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profitability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Profitability Analysis</CardTitle>
          <CardDescription>Current performance and projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Daily Profit</div>
              <div className="text-2xl font-bold text-chart-5">
                ₦{(monthlyProjection.avgDailyProduction * monthlyProjection.profitPerEgg).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {monthlyProjection.avgDailyProduction} eggs × ₦{monthlyProjection.profitPerEgg} profit
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Weekly Profit</div>
              <div className="text-2xl font-bold text-chart-5">
                ₦{(monthlyProjection.avgDailyProduction * monthlyProjection.profitPerEgg * 7).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">7 days production</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Monthly Profit</div>
              <div className="text-2xl font-bold text-chart-5">₦{monthlyProjection.monthlyProfit.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">30 days projection</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
