'use client';

import { useEffect, useState } from 'react';
import { getDailyLogs } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

type Log = {
  id: string | number;
  logDate: string;
  houseId: number | string;
  eggsCollected: number;
  eggsTotal: number;
  feedConsumedKg: number;
  feedGivenKg?: number;
  feedBagsUsed?: number;
  feedBatchId?: number;
  notes?: string;
  House?: {
    id: number;
    houseName: string;
  };
  FeedBatch?: {
    id: number;
    batchName: string;
    costPerBag: number;
  };
};

export function DailyLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const today = new Date().toISOString().slice(0, 10);
    getDailyLogs({ date: today })
      .then((res) => {
        if (!mounted) return;
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError(err?.message || 'Failed to load logs');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Today's Logs</CardTitle>
          <CardDescription>Recent daily logs for today</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No logs for today</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>House</TableHead>
                  <TableHead>Eggs</TableHead>
                  <TableHead>Feed (kg)</TableHead>
                  <TableHead>Feed Batch</TableHead>
                  <TableHead>Bags Used</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={String(log.id)}>
                    <TableCell className="font-medium">{String(log.id)}</TableCell>
                    <TableCell>{log.logDate}</TableCell>
                    <TableCell>{log.House?.houseName || `House ${log.houseId}`}</TableCell>
                    <TableCell>{log.eggsTotal || log.eggsCollected || 0}</TableCell>
                    <TableCell>{log.feedConsumedKg || log.feedGivenKg || 0}</TableCell>
                    <TableCell>{log.FeedBatch?.batchName || 'N/A'}</TableCell>
                    <TableCell>{log.feedBagsUsed || 0}</TableCell>
                    <TableCell>{log.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
