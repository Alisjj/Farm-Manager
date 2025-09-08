'use client';

import { useState, useEffect } from 'react';
import { getDailyLogs } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Egg,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  AlertTriangle,
} from 'lucide-react';

type Log = {
  id: string | number;
  logDate: string;
  houseId: number | string;
  eggsCollected: number;
  feedConsumedKg: number;
  notes?: string;
};

export function DashboardOverview() {
  const [stats, setStats] = useState({
    eggsCollected: 0,
    eggsYesterday: 0,
    salesAmount: 15000,
    salesYesterday: 12500,
    costPerEgg: 12.5,
    costYesterday: 13.2,
    activeWorkers: 4,
    totalWorkers: 5,
  });
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', eggs: 0, sales: 0 },
    { day: 'Tue', eggs: 0, sales: 0 },
    { day: 'Wed', eggs: 0, sales: 0 },
    { day: 'Thu', eggs: 0, sales: 0 },
    { day: 'Fri', eggs: 0, sales: 0 },
    { day: 'Sat', eggs: 0, sales: 0 },
    { day: 'Sun', eggs: 0, sales: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Fetch today and yesterday data
        const [todayLogsRes, yesterdayLogsRes] = await Promise.all([
          getDailyLogs({ date: today }),
          getDailyLogs({ date: yesterday }),
        ]);

        const todayLogs: Log[] = todayLogsRes.data || [];
        const yesterdayLogs: Log[] = yesterdayLogsRes.data || [];

        const totalEggsToday = todayLogs.reduce((sum, log) => sum + log.eggsCollected, 0);
        const totalEggsYesterday = yesterdayLogs.reduce((sum, log) => sum + log.eggsCollected, 0);

        // Fetch weekly data
        const weeklyPromises = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
          weeklyPromises.push(getDailyLogs({ date }));
        }

        const weeklyResults = await Promise.all(weeklyPromises);
        const newWeeklyData = weeklyResults.map((result, index) => {
          const logs: Log[] = result.data || [];
          const totalEggs = logs.reduce((sum, log) => sum + log.eggsCollected, 0);
          const dayIndex = new Date(Date.now() - (6 - index) * 86400000).getDay();

          return {
            day: dayNames[dayIndex],
            eggs: totalEggs,
            sales: totalEggs * 35, // Assuming 35 naira per egg
          };
        });

        setStats((prevStats) => ({
          ...prevStats,
          eggsCollected: totalEggsToday,
          eggsYesterday: totalEggsYesterday,
        }));

        setWeeklyData(newWeeklyData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const todayStats = stats;

  // Helper function to calculate percentage change safely
  const calculatePercentageChange = (current: number, previous: number): string => {
    // Ensure both values are valid numbers
    const currentVal = Number(current) || 0;
    const previousVal = Number(previous) || 0;

    if (previousVal === 0) return currentVal > 0 ? '100.0' : '0.0';
    const result = ((currentVal - previousVal) / previousVal) * 100;
    return isNaN(result) ? '0.0' : result.toFixed(1);
  };

  // Helper function to safely format numbers
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-balance">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Today:{' '}
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eggs Collected</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeNumber(todayStats.eggsCollected)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-chart-5" />+
              {calculatePercentageChange(
                safeNumber(todayStats.eggsCollected),
                safeNumber(todayStats.eggsYesterday)
              )}
              % from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{safeNumber(todayStats.salesAmount).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-chart-5" />+
              {calculatePercentageChange(
                safeNumber(todayStats.salesAmount),
                safeNumber(todayStats.salesYesterday)
              )}
              % from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Egg</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{safeNumber(todayStats.costPerEgg)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-chart-5" />-
              {calculatePercentageChange(
                safeNumber(todayStats.costYesterday),
                safeNumber(todayStats.costPerEgg)
              )}
              % from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeNumber(todayStats.activeWorkers)}/{safeNumber(todayStats.totalWorkers)}
            </div>
            <Progress
              value={
                (safeNumber(todayStats.activeWorkers) /
                  (safeNumber(todayStats.totalWorkers) || 1)) *
                100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Production Trend */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Production Trend</CardTitle>
            <CardDescription>Egg collection over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <Progress value={day.eggs > 0 ? (day.eggs / 450) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                  <div className="text-sm font-medium w-12 text-right">
                    {day.eggs > 0 ? day.eggs : '-'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common daily tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Egg className="h-4 w-4 text-primary" />
                  <span className="text-sm">Log Today's Collection</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm">Record Feed Usage</span>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Mark Attendance</span>
                </div>
                <Badge variant="secondary">Complete</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Review Alerts</span>
                </div>
                <Badge variant="destructive">2 New</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* House Performance */}
      <Card>
        <CardHeader>
          <CardTitle>House Performance Today</CardTitle>
          <CardDescription>Production breakdown by house/coop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'House A', eggs: 145, capacity: 150, efficiency: 97 },
              { name: 'House B', eggs: 138, capacity: 150, efficiency: 92 },
              { name: 'House C', eggs: 137, capacity: 150, efficiency: 91 },
            ].map((house) => (
              <div key={house.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{house.name}</h4>
                  <Badge
                    variant={
                      house.efficiency > 95
                        ? 'default'
                        : house.efficiency > 90
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {house.efficiency}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{house.eggs} eggs</div>
                <Progress value={(house.eggs / house.capacity) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {house.eggs}/{house.capacity} capacity
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
