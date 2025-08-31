import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import TopHeader from "../../components/layout/TopHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import HouseService, { type House } from "../../services/houseService";
import { useToast } from "../../hooks/use-toast";

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const hs = await HouseService.getHouses();
      setHouses(hs || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load houses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const onCreate = async () => {
    if (!name.trim())
      return toast({
        title: "Validation",
        description: "House name required",
        variant: "destructive",
      });
    try {
      const h = await HouseService.createHouse({ name, location });
      if (h) {
        toast({ title: "Created", description: "House created" });
        setName("");
        setLocation("");
        fetch();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create house",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this house?")) return;
    try {
      const ok = await HouseService.deleteHouse(id);
      if (ok) {
        toast({ title: "Deleted", description: "House deleted" });
        fetch();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete house",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader title="Houses" subtitle="Manage farm houses" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Houses</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <ul className="space-y-2">
                      {houses.map((h) => (
                        <li
                          key={h.id}
                          className="p-3 bg-white rounded shadow flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-sm text-gray-500">
                              {h.location}
                            </div>
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant="destructive"
                              onClick={() => onDelete(h.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>New House</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-600">Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600">Location</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={onCreate}>Create</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
