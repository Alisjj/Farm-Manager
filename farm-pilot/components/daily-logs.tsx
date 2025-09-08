'use client';

import { useEffect, useState } from 'react';
import { getDailyLogs, deleteDailyLog } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Log = {
  id: string | number;
  logDate: string;
  houseId: number | string;
  eggsCollected: number;
  feedConsumedKg: number;
  notes?: string;
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

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDailyLog(String(id));
      setLogs((s) => s.filter((l) => String(l.id) !== String(id)));
    } catch (err) {
      console.error('Delete failed', err);
      setError('Failed to delete log');
    }
  };

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
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={String(log.id)}>
                    <TableCell className="font-medium">{String(log.id)}</TableCell>
                    <TableCell>{log.logDate}</TableCell>
                    <TableCell>{log.houseId}</TableCell>
                    <TableCell>{log.eggsCollected}</TableCell>
                    <TableCell>{log.feedConsumedKg}</TableCell>
                    <TableCell>{log.notes}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(log.id)}>
                        Delete
                      </Button>
                    </TableCell>
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
