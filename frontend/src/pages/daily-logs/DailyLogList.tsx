import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { DailyLog } from "../../services/dailyLogService";
import { House } from "../../services/houseService";

interface Props {
  logs: DailyLog[];
  loading: boolean;
  onEdit: (log: DailyLog) => void;
  onDelete: (id: string) => void;
  onFilter: (filters: any) => void;
  houses?: House[];
  housesLoading?: boolean;
}

export default function DailyLogList({
  logs,
  loading,
  onEdit,
  onDelete,
  onFilter,
  houses = [],
  housesLoading = false,
}: Props) {
  const [houseId, setHouseId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleFilter = () => {
    onFilter({
      houseId: houseId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <div className="w-48">
          <label className="text-xs text-slate-600">House</label>
          <select
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            className="mt-1 block w-full rounded-md border px-2 py-2 text-sm"
            disabled={housesLoading}
          >
            <option value="">All</option>
            {houses.length > 0 ? (
              houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))
            ) : (
              // fallback static options
              <>
                <option value="house-1">House 1</option>
                <option value="house-2">House 2</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-600">From</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">To</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <Button onClick={handleFilter}>Filter</Button>
        </div>
        <div className="ml-auto">
          <Button onClick={() => onEdit({} as DailyLog)}>New Entry</Button>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">House</th>
              <th className="p-3">Eggs (AM/PM)</th>
              <th className="p-3">Feed</th>
              <th className="p-3">Mortality</th>
              <th className="p-3">Recorded By</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  No entries found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer"
                  tabIndex={0}
                  onClick={() => onEdit(log)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onEdit(log);
                  }}
                >
                  <td className="p-3">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {houses.find((h) => h.id === log.houseId)?.name ??
                      log.houseId}
                  </td>
                  <td className="p-3">
                    {log.morningEggs}/{log.afternoonEggs}
                  </td>
                  <td className="p-3">{log.feedConsumed} kg</td>
                  <td className="p-3">{log.mortality}</td>
                  <td className="p-3">{log.recordedBy}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(log);
                        }}
                      >
                        Edit
                      </Button>

                      {confirming === log.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirming(null);
                              onDelete(log.id);
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirming(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirming(log.id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
