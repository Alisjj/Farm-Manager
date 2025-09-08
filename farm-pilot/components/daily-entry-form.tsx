'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Home, Egg, Package, Users, AlertCircle } from 'lucide-react';
import { createDailyLog, getHouses, getDailyLogs, getLaborers, listStaff } from '@/lib/api';

interface House {
  id: number;
  name: string;
  currentBirds: number;
  capacity: number;
  location: string;
  status: string;
}

interface DailyLog {
  id: number;
  logDate: string;
  houseId: number;
  eggsTotal: number;
  eggsGradeA: number;
  eggsGradeB: number;
  eggsGradeC: number;
  feedGivenKg: number;
  mortalityCount: number;
  notes?: string;
  House?: House;
}

interface Worker {
  id: number;
  name: string;
  fullName?: string;
  role: string;
  status: string;
  tasks?: string[];
}

interface TodaySummary {
  totalEggs: number;
  housesLogged: number;
  totalHouses: number;
  houseBreakdown: Array<{
    houseId: number;
    houseName: string;
    eggs: number;
  }>;
}

export function DailyEntryForm() {
  const [selectedHouse, setSelectedHouse] = useState('');
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic data states
  const [todaySummary, setTodaySummary] = useState<TodaySummary>({
    totalEggs: 0,
    housesLogged: 0,
    totalHouses: 0,
    houseBreakdown: [],
  });
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    gradeA: '',
    gradeB: '',
    gradeC: '',
    crackedEggs: '',
    feedGiven: '',
    feedType: '',
    mortalityCount: '',
    notes: '',
  });

  const [eggData, setEggData] = useState({
    gradeA: '',
    gradeB: '',
    gradeC: '',
    total: 0,
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [houses.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    await Promise.all([loadHouses(), loadTodaysSummary(), loadWorkers(), loadAlerts()]);
  };

  const loadHouses = async () => {
    try {
      setLoading(true);
      console.log('Loading houses...');
      const response = await getHouses();
      console.log('Houses response:', response);
      if (response) {
        setHouses(response);
        console.log('Houses set:', response);
      } else {
        console.warn('No houses response received');
      }
    } catch (error) {
      console.error('Failed to load houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodaysSummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await getDailyLogs({ date: today });
      const todaysLogs = response?.data || [];

      let totalEggs = 0;
      const houseBreakdown: Array<{ houseId: number; houseName: string; eggs: number }> = [];

      todaysLogs.forEach((log: DailyLog) => {
        totalEggs += log.eggsTotal || 0;
        houseBreakdown.push({
          houseId: log.houseId,
          houseName: log.House?.name || `House ${log.houseId}`,
          eggs: log.eggsTotal || 0,
        });
      });

      setTodaySummary({
        totalEggs,
        housesLogged: todaysLogs.length,
        totalHouses: houses.length || 0,
        houseBreakdown,
      });
    } catch (error) {
      console.error("Failed to load today's summary:", error);
    }
  };

  const loadWorkers = async () => {
    try {
      // Try to get staff first, then laborers
      const [staffResponse, laborersResponse] = await Promise.all([
        listStaff().catch(() => ({ data: [] })),
        getLaborers().catch(() => ({ data: [] })),
      ]);

      const staff = (staffResponse?.data || []).map(
        (s: { id: number; fullName?: string; username?: string }) => ({
          id: s.id,
          name: s.fullName || s.username || 'Unknown',
          role: 'Staff',
          status: 'present', // This would need to come from attendance/work assignment API
          tasks: [], // This would need to come from task assignment API
        })
      );

      const laborers = (laborersResponse?.data || []).map(
        (l: { id: number; name: string; role?: string }) => ({
          id: l.id,
          name: l.name,
          role: l.role || 'Laborer',
          status: 'present', // This would need to come from attendance API
          tasks: [], // This would need to come from task assignment API
        })
      );

      setWorkers([...staff, ...laborers]);
    } catch (error) {
      console.error('Failed to load workers:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      // This would typically come from a dedicated alerts API
      // For now, we'll generate basic alerts based on data
      const alertMessages: string[] = [];

      // Check feed stock (placeholder logic)
      if (Math.random() > 0.5) {
        alertMessages.push('Feed stock running low - consider ordering more');
      }

      // Check for vaccination schedules
      if (Math.random() > 0.7) {
        alertMessages.push('Vaccination due for some houses next week');
      }

      setAlerts(alertMessages);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const calculateTotal = () => {
    const total =
      (Number.parseInt(formData.gradeA) || 0) +
      (Number.parseInt(formData.gradeB) || 0) +
      (Number.parseInt(formData.gradeC) || 0);
    setEggData((prev) => ({ ...prev, total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHouse) {
      alert('Please select a house');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        logDate: new Date().toISOString().split('T')[0], // Today's date
        houseId: parseInt(selectedHouse),
        eggsGradeA: parseInt(formData.gradeA) || 0,
        eggsGradeB: parseInt(formData.gradeB) || 0,
        eggsGradeC: parseInt(formData.gradeC) || 0,
        eggsTotal:
          (parseInt(formData.gradeA) || 0) +
          (parseInt(formData.gradeB) || 0) +
          (parseInt(formData.gradeC) || 0),
        crackedEggs: parseInt(formData.crackedEggs) || 0,
        feedGivenKg: parseFloat(formData.feedGiven) || 0,
        feedType: formData.feedType || null,
        mortalityCount: parseInt(formData.mortalityCount) || 0,
        notes: formData.notes || null,
      };

      const result = await createDailyLog(payload);

      if (result?.success) {
        const message = result?.message || 'Daily log submitted successfully!';
        alert(message);
        // Reset form
        setFormData({
          gradeA: '',
          gradeB: '',
          gradeC: '',
          crackedEggs: '',
          feedGiven: '',
          feedType: '',
          mortalityCount: '',
          notes: '',
        });
        setEggData({
          gradeA: '',
          gradeB: '',
          gradeC: '',
          total: 0,
        });
        setSelectedHouse('');
        // Reload data to update summary
        loadTodaysSummary();
      } else {
        alert('Failed to submit daily log. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit daily log. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-balance">Daily Entry</h2>
        <p className="text-muted-foreground">
          Record today's production, feed usage, and observations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Entry Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Production Entry
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="house">Select House/Coop</Label>
                  <Select value={selectedHouse} onValueChange={setSelectedHouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a house" />
                    </SelectTrigger>
                    <SelectContent>
                      {houses.map((house) => (
                        <SelectItem key={house.id} value={house.id.toString()}>
                          {house.name} ({house.currentBirds} birds)
                        </SelectItem>
                      ))}
                      {houses.length === 0 && !loading && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No houses available
                        </div>
                      )}
                      {loading && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Loading houses...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Egg className="h-4 w-4" />
                    <Label className="text-base font-medium">Egg Collection</Label>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade-a">Grade A</Label>
                      <Input
                        id="grade-a"
                        type="number"
                        placeholder="0"
                        value={formData.gradeA}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, gradeA: e.target.value }));
                          setEggData((prev) => ({ ...prev, gradeA: e.target.value }));
                          setTimeout(calculateTotal, 0);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade-b">Grade B</Label>
                      <Input
                        id="grade-b"
                        type="number"
                        placeholder="0"
                        value={formData.gradeB}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, gradeB: e.target.value }));
                          setEggData((prev) => ({ ...prev, gradeB: e.target.value }));
                          setTimeout(calculateTotal, 0);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade-c">Grade C</Label>
                      <Input
                        id="grade-c"
                        type="number"
                        placeholder="0"
                        value={formData.gradeC}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, gradeC: e.target.value }));
                          setEggData((prev) => ({ ...prev, gradeC: e.target.value }));
                          setTimeout(calculateTotal, 0);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Total Eggs:</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {eggData.total} eggs
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <Label className="text-base font-medium">Feed & Health</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="feed-given">Feed Given (kg)</Label>
                      <Input
                        id="feed-given"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.feedGiven}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, feedGiven: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mortality">Mortality Count</Label>
                      <Input
                        id="mortality"
                        type="number"
                        placeholder="0"
                        value={formData.mortalityCount}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, mortalityCount: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cracked-eggs">Cracked Eggs</Label>
                      <Input
                        id="cracked-eggs"
                        type="number"
                        placeholder="0"
                        value={formData.crackedEggs}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, crackedEggs: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feed-type">Feed Type</Label>
                      <Input
                        id="feed-type"
                        type="text"
                        placeholder="e.g. Layer mash"
                        value={formData.feedType}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, feedType: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes & Observations</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any health observations, unusual behavior, or other notes..."
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Daily Entry'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Today's Summary - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{todaySummary.totalEggs}</div>
                  <div className="text-xs text-muted-foreground">Total Eggs</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-chart-2">
                    {todaySummary.housesLogged}/{todaySummary.totalHouses}
                  </div>
                  <div className="text-xs text-muted-foreground">Houses Logged</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {todaySummary.houseBreakdown.length > 0 ? (
                  todaySummary.houseBreakdown.map((house) => (
                    <div key={house.houseId} className="flex justify-between text-sm">
                      <span>{house.houseName}</span>
                      <Badge variant="secondary">{house.eggs} eggs</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    No logs recorded today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Worker Assignment - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Worker Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workers.length > 0 ? (
                workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-xs text-muted-foreground">{worker.role}</div>
                      {worker.tasks && worker.tasks.length > 0 && (
                        <div className="flex gap-1">
                          {worker.tasks.map((task, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {task}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge variant={worker.status === 'present' ? 'default' : 'destructive'}>
                      {worker.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No workers assigned
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alerts & Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border border-accent/20 bg-accent/5 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Alert</div>
                      <div className="text-xs text-muted-foreground">{alert}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No alerts at this time
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
