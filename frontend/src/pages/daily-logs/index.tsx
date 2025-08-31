import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import TopHeader from "../../components/layout/TopHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import DailyLogForm from "./DailyLogForm";
import {
  DailyLogService,
  type DailyLog,
  type DailyLogFilters,
} from "../../services/dailyLogService";
import HouseService, { type House } from "../../services/houseService";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

type DailyLogListProps = {
  logs: DailyLog[];
  loading: boolean;
  onEdit: (l: DailyLog) => void;
  onDelete: (id: string) => void;
  onFilter: (f: DailyLogFilters) => void;
  houses?: House[];
  housesLoading?: boolean;
};

const DailyLogList = ({
  logs,
  loading,
  onEdit,
  onDelete,
  onFilter,
}: DailyLogListProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      onFilter({ q: query } as DailyLogFilters);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!logs || logs.length === 0)
    return <div className="p-4 text-sm text-gray-500">No logs found.</div>;

  return (
    <div>
      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter..."
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <ul className="space-y-2">
        {logs.map((l) => (
          <li
            key={l.id}
            className="p-3 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{(l as any).title ?? "Entry"}</div>
              <div className="text-sm text-gray-500">
                {(l as any).description ?? ""}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => onEdit(l)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(l.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function DailyLogsPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DailyLogFilters>({});
  const [selected, setSelected] = useState<DailyLog | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [housesLoading, setHousesLoading] = useState(false);
  const { user } = useAuth();
  const [newHouseName, setNewHouseName] = useState("");
  const [newHouseLocation, setNewHouseLocation] = useState("");
  const { toast } = useToast();

  const fetchLogs = async (f: DailyLogFilters = {}) => {
    try {
      setLoading(true);
      const res = await DailyLogService.getDailyLogs(f);
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(filters);
  }, [filters]);

  useEffect(() => {
    (async () => {
      try {
        setHousesLoading(true);
        const hs = await HouseService.getHouses();
        setHouses(hs || []);
      } catch (err) {
        console.error("Failed to load houses", err);
      } finally {
        setHousesLoading(false);
      }
    })();
  }, []);

  const createHouse = async () => {
    if (!newHouseName.trim())
      return toast({
        title: "Validation",
        description: "House name required",
        variant: "destructive",
      });
    try {
      await HouseService.createHouse({
        name: newHouseName.trim(),
        location: newHouseLocation.trim() || undefined,
      });
      setNewHouseName("");
      setNewHouseLocation("");
      const hs = await HouseService.getHouses();
      setHouses(hs || []);
      toast({ title: "Created", description: "House created" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create house",
        variant: "destructive",
      });
    }
  };

  const removeHouse = async (id: string) => {
    if (!confirm("Delete this house?")) return;
    try {
      await HouseService.deleteHouse(id);
      const hs = await HouseService.getHouses();
      setHouses(hs || []);
      toast({ title: "Deleted", description: "House deleted" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete house",
        variant: "destructive",
      });
    }
  };

  const onCreate = async (payload: any) => {
    try {
      await DailyLogService.createDailyLog(payload);
      setSelected(null);
      await fetchLogs(filters);
      toast({
        title: "Created",
        description: "Daily log created successfully",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Failed to create daily log",
        variant: "destructive",
      });
      throw err;
    }
  };

  const onUpdate = async (id: string, payload: any) => {
    try {
      await DailyLogService.updateDailyLog(id, payload);
      setSelected(null);
      await fetchLogs(filters);
      toast({ title: "Updated", description: "Daily log updated" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "Failed to update daily log",
        variant: "destructive",
      });
      throw err;
    }
  };

  const onDelete = async (id: string) => {
    // optimistic remove
    const prev = logs;
    setLogs((s) => s.filter((l) => l.id !== id));
    try {
      await DailyLogService.deleteDailyLog(id);
      toast({ title: "Deleted", description: "Daily log deleted" });
    } catch (err: any) {
      console.error(err);
      setLogs(prev);
      toast({
        title: "Error",
        description: err?.message || "Failed to delete daily log",
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader
          title="Daily Operations"
          subtitle="Record daily production and consumption"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyLogList
                    logs={logs}
                    loading={loading}
                    onEdit={(l) => setSelected(l)}
                    onDelete={onDelete}
                    onFilter={(f) => setFilters(f)}
                    houses={houses}
                    housesLoading={housesLoading}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {user?.role === "owner" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Houses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-600">Name</label>
                        <input
                          value={newHouseName}
                          onChange={(e) => setNewHouseName(e.target.value)}
                          className="mt-1 block w-full rounded-md border px-2 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-600">
                          Location
                        </label>
                        <input
                          value={newHouseLocation}
                          onChange={(e) => setNewHouseLocation(e.target.value)}
                          className="mt-1 block w-full rounded-md border px-2 py-2 text-sm"
                        />
                      </div>

                      <div className="flex gap-2 justify-between items-center">
                        <div className="text-xs text-slate-500">
                          {houses.length} houses
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={createHouse}
                            className="bg-primary text-white px-3 py-1 rounded"
                          >
                            Create
                          </button>
                        </div>
                      </div>

                      <ul className="mt-3 space-y-2">
                        {houses.map((h) => (
                          <li
                            key={h.id}
                            className="flex justify-between items-center bg-white p-2 rounded"
                          >
                            <div>
                              <div className="font-medium">{h.name}</div>
                              <div className="text-xs text-slate-500">
                                {h.location}
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => removeHouse(h.id)}
                                className="text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>{selected ? "Edit Entry" : "New Entry"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyLogForm
                    initial={selected || undefined}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                    onCancel={() => setSelected(null)}
                    houses={houses}
                    housesLoading={housesLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
