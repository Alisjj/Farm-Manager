"use client";

import { useState, useEffect } from "react";
import { getHouses, createDailyLog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Egg,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";

interface House {
  id: string;
  name: string;
  capacity: number;
  currentBirds: number;
  location: string;
  status: "active" | "maintenance" | "inactive";
}

export function StaffDailyEntry() {
  const [selectedHouse, setSelectedHouse] = useState("");
  const [eggData, setEggData] = useState({
    gradeA: "",
    gradeB: "",
    gradeC: "",
    cracked: "",
    mortality: "",
  });
  const [feedData, setFeedData] = useState({
    amount: "",
    type: "",
    notes: "",
  });
  const [issues, setIssues] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<
    { id: string; text: string; type?: "success" | "error" }[]
  >([]);

  const pushToast = (text: string, type: "success" | "error" = "success") => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, text, type }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 3500);
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getHouses()
      .then((data: unknown[]) => {
        if (!mounted) return;
        const normalized: House[] = data.map((h) => {
          const obj = h as Record<string, unknown>;
          return {
            id: String(obj.id),
            name: (obj.houseName as string) || (obj.name as string) || "",
            capacity:
              typeof obj.capacity === "number"
                ? (obj.capacity as number)
                : Number(obj.capacity) || 0,
            currentBirds:
              typeof obj.currentBirdCount === "number"
                ? (obj.currentBirdCount as number)
                : Number(obj.currentBirdCount) || 0,
            location: (obj.location as string) || "",
            status:
              (obj.status as "active" | "maintenance" | "inactive") || "active",
          } as House;
        });
        const active = normalized.filter((hh) => hh.status === "active");
        setHouses(active);
        try {
          localStorage.setItem("farm-pilot-houses", JSON.stringify(data));
        } catch {
          // ignore
        }
      })
      .catch(() => {
        const savedHouses = localStorage.getItem("farm-pilot-houses");
        if (savedHouses) {
          const allHouses = JSON.parse(savedHouses);
          if (!mounted) return;
          setHouses(
            allHouses.filter((house: House) => house.status === "active")
          );
        }
      })
      .finally(() => setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const feedTypes = [
    "Layer Mash",
    "Grower Feed",
    "Starter Feed",
    "Finisher Feed",
  ];

  const handleSubmitEggCollection = async () => {
    if (!selectedHouse) return;

    setIsSubmitting(true);
    // Build payload matching backend model column names
    const eggsA = Number(eggData.gradeA) || 0;
    const eggsB = Number(eggData.gradeB) || 0;
    const eggsC = Number(eggData.gradeC) || 0;
    const cracked = Number(eggData.cracked) || 0;
    const mortality = Number(eggData.mortality) || 0;
    const total = eggsA + eggsB + eggsC;

    const payload = {
      logDate: new Date().toISOString().slice(0, 10),
      houseId: Number(selectedHouse),
      eggsTotal: total,
      eggsGradeA: eggsA,
      eggsGradeB: eggsB,
      eggsGradeC: eggsC,
      crackedEggs: cracked,
      mortalityCount: mortality,
    } as Record<string, unknown>;

    // optimistic update: reduce currentBirds by mortality immediately
    const prevHouses = houses;
    if (mortality > 0) {
      setHouses((hs) =>
        hs.map((h) =>
          h.id === selectedHouse
            ? { ...h, currentBirds: Math.max(0, h.currentBirds - mortality) }
            : h
        )
      );
    }

    try {
      const saved = await createDailyLog(payload);
      console.log("Submitted egg collection", saved);
      pushToast("Egg collection logged", "success");
      // reset form
      setEggData({
        gradeA: "",
        gradeB: "",
        gradeC: "",
        cracked: "",
        mortality: "",
      });
    } catch (err) {
      console.error("Failed to submit egg collection", err);
      // revert optimistic update on failure
      setHouses(prevHouses);
      pushToast("Failed to log egg collection", "error");
    } finally {
      setIsSubmitting(false);
    }

    // Reset form
    setEggData({
      gradeA: "",
      gradeB: "",
      gradeC: "",
      cracked: "",
      mortality: "",
    });
    setIsSubmitting(false);
  };

  const handleSubmitFeedLog = async () => {
    if (!selectedHouse || !feedData.amount) return;

    setIsSubmitting(true);
    const payload = {
      logDate: new Date().toISOString().slice(0, 10),
      houseId: Number(selectedHouse),
      feedGivenKg: Number(feedData.amount) || 0,
      feedType: feedData.type || null,
      notes: feedData.notes || "",
    } as Record<string, unknown>;

    try {
      const saved = await createDailyLog(payload);
      console.log("Submitted feed log", saved);
      pushToast("Feed log saved", "success");
      setFeedData({ amount: "", type: "", notes: "" });
    } catch (err) {
      console.error("Failed to submit feed log", err);
      pushToast("Failed to save feed log", "error");
    } finally {
      setIsSubmitting(false);
    }

    setFeedData({
      amount: "",
      type: "",
      notes: "",
    });
    setIsSubmitting(false);
  };

  const handleSubmitIssues = async () => {
    if (!issues.trim()) return;

    setIsSubmitting(true);
    const payload = {
      logDate: new Date().toISOString().slice(0, 10),
      houseId: selectedHouse ? Number(selectedHouse) : null,
      notes: issues,
    } as Record<string, unknown>;

    try {
      const saved = await createDailyLog(payload);
      console.log("Submitted issues report", saved);
      pushToast("Report submitted", "success");
      setIssues("");
    } catch (err) {
      console.error("Failed to submit issues", err);
      pushToast("Failed to submit report", "error");
    } finally {
      setIsSubmitting(false);
    }

    setIssues("");
    setIsSubmitting(false);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Toasts */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md px-3 py-2 text-sm shadow-md ${
              t.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">
            Daily Farm Logging
          </h2>
          <p className="text-muted-foreground">
            Record today&#39;s farm activities and observations
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {today}
          {isLoading && <span className="ml-2 text-xs">Loading…</span>}
        </div>
      </div>

      {/* House Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Egg className="h-5 w-5" />
            Select House
          </CardTitle>
          <CardDescription>
            Choose which house you&#39;re logging data for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedHouse} onValueChange={setSelectedHouse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a house..." />
            </SelectTrigger>
            <SelectContent>
              {houses.map((house) => (
                <SelectItem key={house.id} value={house.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{house.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {house.currentBirds} birds
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedHouse && (
        <>
          {/* Egg Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Egg className="h-5 w-5" />
                Egg Collection
              </CardTitle>
              <CardDescription>
                Record today&#39;s egg collection by grade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeA">Grade A</Label>
                  <Input
                    id="gradeA"
                    type="number"
                    placeholder="0"
                    value={eggData.gradeA}
                    onChange={(e) =>
                      setEggData((prev) => ({
                        ...prev,
                        gradeA: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeB">Grade B</Label>
                  <Input
                    id="gradeB"
                    type="number"
                    placeholder="0"
                    value={eggData.gradeB}
                    onChange={(e) =>
                      setEggData((prev) => ({
                        ...prev,
                        gradeB: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeC">Grade C</Label>
                  <Input
                    id="gradeC"
                    type="number"
                    placeholder="0"
                    value={eggData.gradeC}
                    onChange={(e) =>
                      setEggData((prev) => ({
                        ...prev,
                        gradeC: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cracked">Cracked</Label>
                  <Input
                    id="cracked"
                    type="number"
                    placeholder="0"
                    value={eggData.cracked}
                    onChange={(e) =>
                      setEggData((prev) => ({
                        ...prev,
                        cracked: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortality">Mortality</Label>
                  <Input
                    id="mortality"
                    type="number"
                    placeholder="0"
                    value={eggData.mortality}
                    onChange={(e) =>
                      setEggData((prev) => ({
                        ...prev,
                        mortality: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmitEggCollection}
                disabled={isSubmitting || !selectedHouse}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Log Egg Collection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Feed Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Feed Distribution
              </CardTitle>
              <CardDescription>
                Record feed given to the selected house
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feedAmount">Amount (kg)</Label>
                  <Input
                    id="feedAmount"
                    type="number"
                    placeholder="0"
                    value={feedData.amount}
                    onChange={(e) =>
                      setFeedData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedType">Feed Type</Label>
                  <Select
                    value={feedData.type}
                    onValueChange={(value) =>
                      setFeedData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feed type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {feedTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedNotes">Notes (optional)</Label>
                <Textarea
                  id="feedNotes"
                  placeholder="Any observations about feed quality, bird behavior, etc."
                  value={feedData.notes}
                  onChange={(e) =>
                    setFeedData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSubmitFeedLog}
                disabled={isSubmitting || !selectedHouse || !feedData.amount}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Log Feed Distribution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Issues & Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issues & Observations
          </CardTitle>
          <CardDescription>
            Report any issues, concerns, or notable observations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe any issues with equipment, bird health, unusual behavior, maintenance needs, etc."
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            rows={4}
          />
          <Button
            onClick={handleSubmitIssues}
            disabled={isSubmitting || !issues.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
