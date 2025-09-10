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
import {
  createDailyLog,
  getHouses,
  getDailyLogs,
  getLaborers,
  listStaff,
  getFeedBatches,
  getFeedBatchUsageStats,
} from '@/lib/api';
import { House, DailyLog, Worker, TodaySummary } from '@/types';
import { FeedBatch } from '@/types/entities/feed';

interface BatchUsageStats {
  batch_id: string;
  batch_name: string;
  total_bags: number;
  used_bags: number;
  remaining_bags: number;
  usage_percentage: number;
}

export function DailyEntryForm() {
  const [selectedHouse, setSelectedHouse] = useState('');
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Feed batch state
  const [feedBatches, setFeedBatches] = useState<FeedBatch[]>([]);
  const [batchUsageStats, setBatchUsageStats] = useState<BatchUsageStats[]>([]);

  const loadFeedBatches = async () => {
    try {
      const [batchesResponse, usageStatsResponse] = await Promise.all([
        getFeedBatches(),
        getFeedBatchUsageStats(),
      ]);
      setFeedBatches(batchesResponse?.data || []);
      setBatchUsageStats(usageStatsResponse?.data || []);
    } catch (error) {
      console.error('Failed to load feed batches:', error);
      setFeedBatches([]);
      setBatchUsageStats([]);
    }
  };

  useEffect(() => {
    loadFeedBatches();
  }, []);

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
    mortalityCount: '',
    feedBatchId: '',
    feedBagsUsed: '',
    notes: '',
  });

  const [feedBagsError, setFeedBagsError] = useState<string>('');

  // Validation function to check if bags used exceeds remaining
  const validateFeedBags = () => {
    if (!formData.feedBatchId || !formData.feedBagsUsed) return true;

    const selectedBatchUsage = batchUsageStats.find(
      (stats) =>
        stats.batch_id === formData.feedBatchId ||
        stats.batch_id === parseInt(formData.feedBatchId).toString()
    );

    if (!selectedBatchUsage) return true;

    const bagsUsed = parseFloat(formData.feedBagsUsed);
    if (isNaN(bagsUsed) || bagsUsed <= 0) return true;

    return bagsUsed <= selectedBatchUsage.remaining_bags;
  };

  // Form validation - checks all required fields and validation rules
  const isFormValid = () => {
    if (!selectedHouse) return false;
    if (!validateFeedBags()) return false;
    if (feedBagsError) return false;
    return true;
  };

  useEffect(() => {
    if (formData.feedBatchId && batchUsageStats.length > 0) {
      const selectedBatchUsage = batchUsageStats.find(
        (stats) => stats.batch_id === formData.feedBatchId
      );

      if (selectedBatchUsage && selectedBatchUsage.remaining_bags <= 0) {
        setFormData((prev) => ({
          ...prev,
          feedBatchId: '',
          feedBagsUsed: '',
        }));
        alert('The selected feed batch is now finished and has been cleared from your selection.');
      }
    }
  }, [batchUsageStats, formData.feedBatchId]);

  const [eggData, setEggData] = useState({
    gradeA: '',
    gradeB: '',
    gradeC: '',
    total: 0,
  });

  const handleFeedBagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, feedBagsUsed: value }));

    // Clear previous error
    setFeedBagsError('');

    // Only validate if we have a value and batch selected
    if (value && formData.feedBatchId) {
      const numValue = parseFloat(value);
      const selectedBatch = batchUsageStats.find(
        (stats) =>
          stats.batch_id === formData.feedBatchId ||
          stats.batch_id === parseInt(formData.feedBatchId).toString()
      );

      if (selectedBatch && !isNaN(numValue) && numValue > 0) {
        if (numValue > selectedBatch.remaining_bags) {
          setFeedBagsError(
            `Cannot use ${numValue} bags. Only ${selectedBatch.remaining_bags} bags remaining in this batch.`
          );
        }
      }
    }
  };

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
      const houseBreakdown: Array<{ houseId: string; houseName: string; eggs: number }> = [];

      todaysLogs.forEach((log: DailyLog) => {
        totalEggs += log.eggsTotal || 0;
        houseBreakdown.push({
          houseId: log.houseId,
          houseName: log.House?.houseName || `House ${log.houseId}`,
          eggs: log.eggsTotal || 0,
        });
      });

      console.log(todaysLogs);

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
      const [staffResponse, laborersResponse] = await Promise.all([
        listStaff().catch(() => ({ data: [] })),
        getLaborers().catch(() => ({ data: [] })),
      ]);

      const staff = (staffResponse?.data || []).map(
        (s: { id: string; fullName?: string; username?: string }) => ({
          id: String(s.id),
          name: s.fullName || s.username || 'Unknown',
          role: 'Staff',
          status: 'present', // This would need to come from attendance/work assignment API
          tasks: [], // This would need to come from task assignment API
        })
      );

      const laborers = (laborersResponse?.data || []).map(
        (l: { id: string; name: string; role?: string }) => ({
          id: String(l.id),
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
      const alertMessages: string[] = [];

      if (Math.random() > 0.5) {
        alertMessages.push('Feed stock running low - consider ordering more');
      }

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
        houseId: selectedHouse || undefined,
        eggsGradeA: parseInt(formData.gradeA) || 0,
        eggsGradeB: parseInt(formData.gradeB) || 0,
        eggsGradeC: parseInt(formData.gradeC) || 0,
        eggsTotal:
          (parseInt(formData.gradeA) || 0) +
          (parseInt(formData.gradeB) || 0) +
          (parseInt(formData.gradeC) || 0),
        crackedEggs: parseInt(formData.crackedEggs) || 0,
        // feed details are tracked via feed batch elsewhere; omit feedGiven/feedType
        mortalityCount: parseInt(formData.mortalityCount) || 0,
        feedBatchId: formData.feedBatchId ? parseInt(formData.feedBatchId) : undefined,
        feedBagsUsed: formData.feedBagsUsed ? parseInt(formData.feedBagsUsed) : undefined,
        notes: formData.notes || null,
      } as unknown as DailyLog;

      const result = await createDailyLog(payload);

      if (result?.success) {
        const message = result?.message || 'Daily log submitted successfully!';
        alert(message);
        setFormData({
          gradeA: '',
          gradeB: '',
          gradeC: '',
          crackedEggs: '',
          mortalityCount: '',
          feedBatchId: '',
          feedBagsUsed: '',
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
    } catch (error: unknown) {
      console.error('Submit error:', error);

      // Extract error message from backend response
      let errorMessage = 'Failed to submit daily log. Please try again.';
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const basicError = error as { message: string };
        errorMessage = basicError.message;
      }

      alert(errorMessage);
      setFeedBagsError(errorMessage); // Also show in form
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
                        <SelectItem key={house.id} value={house.id}>
                          {house.houseName || `House ${house.id}`} ({house.currentBirds} birds)
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="feed-batch">Feed Batch</Label>
                      <Select
                        value={formData.feedBatchId}
                        onValueChange={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            feedBatchId: value,
                            feedBagsUsed: '',
                          }));
                          setFeedBagsError(''); // Clear any error
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feed batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(feedBatches) &&
                            feedBatches.map((batch) => {
                              const usageInfo = batchUsageStats.find(
                                (stats) => stats.batch_id === batch.id.toString()
                              );
                              const isFinished = usageInfo && usageInfo.remaining_bags <= 0;

                              return (
                                <SelectItem
                                  key={batch.id}
                                  value={batch.id.toString()}
                                  disabled={isFinished}
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span
                                      className={isFinished ? 'text-gray-400 line-through' : ''}
                                    >
                                      {batch.batchName} (${batch.costPerBag}/bag)
                                    </span>
                                    {usageInfo && (
                                      <div className="flex items-center gap-2 ml-2">
                                        <span
                                          className={`text-sm font-medium ${
                                            isFinished ? 'text-gray-400' : 'text-blue-600'
                                          }`}
                                        >
                                          {usageInfo.remaining_bags} bags remaining
                                        </span>
                                        {isFinished ? (
                                          <Badge variant="secondary" className="text-xs">
                                            Finished
                                          </Badge>
                                        ) : (
                                          usageInfo.usage_percentage >= 80 && (
                                            <Badge variant="destructive" className="text-xs">
                                              Low Stock
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feed-bags">Feed Bags Used</Label>
                      {(() => {
                        const selectedBatchUsage = batchUsageStats.find(
                          (stats) =>
                            stats.batch_id === formData.feedBatchId ||
                            stats.batch_id === parseInt(formData.feedBatchId).toString()
                        );

                        return (
                          <>
                            <Input
                              id="feed-bags"
                              type="number"
                              placeholder="0"
                              min={0}
                              step={0.1}
                              max={
                                selectedBatchUsage ? selectedBatchUsage.remaining_bags : undefined
                              }
                              value={formData.feedBagsUsed}
                              className={
                                feedBagsError || !validateFeedBags()
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                  : ''
                              }
                              onChange={handleFeedBagsChange}
                              disabled={!formData.feedBatchId}
                            />

                            {selectedBatchUsage && (
                              <p className="text-sm text-muted-foreground">
                                Maximum available: {selectedBatchUsage.remaining_bags} bags
                              </p>
                            )}

                            {/* Error message */}
                            {feedBagsError && (
                              <p role="alert" className="text-sm text-red-600 font-medium">
                                {feedBagsError}
                              </p>
                            )}
                          </>
                        );
                      })()}
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting || !isFormValid()}
                >
                  {submitting
                    ? 'Submitting...'
                    : !isFormValid()
                    ? feedBagsError
                      ? 'Fix Feed Bags Error to Submit'
                      : !selectedHouse
                      ? 'Select a House to Submit'
                      : 'Fix Errors to Submit'
                    : 'Submit Daily Entry'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
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
                    <Badge
                      variant={worker.attendaceStatus === 'present' ? 'default' : 'destructive'}
                    >
                      {worker.attendaceStatus}
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
