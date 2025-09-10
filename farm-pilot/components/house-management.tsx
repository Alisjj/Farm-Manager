'use client';

import { useState, useEffect } from 'react';
import { getHouses, createHouse, updateHouse, deleteHouse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Egg, Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import { House as HouseType, HouseStatus, House } from '@/types';

export function HouseManagement() {
  const [houses, setHouses] = useState<HouseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<HouseType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    currentBirds: '',
    location: '',
    status: HouseStatus.ACTIVE as HouseType['status'],
    notes: '',
  });

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getHouses()
      .then((data) => {
        if (!mounted) return;
        setHouses(data);
        try {
          localStorage.setItem('farm-pilot-houses', JSON.stringify(data));
        } catch {}
      })
      .catch(() => {
        const savedHouses = localStorage.getItem('farm-pilot-houses');
        if (savedHouses) {
          setHouses(JSON.parse(savedHouses));
        } else {
        }
      })
      .finally(() => setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (houses.length > 0) {
      localStorage.setItem('farm-pilot-houses', JSON.stringify(houses));
    }
  }, [houses]);

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      currentBirds: '',
      location: '',
      status: HouseStatus.ACTIVE,
      notes: '',
    });
    setEditingHouse(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.capacity || !formData.currentBirds) return;

    const houseData: House = {
      id: editingHouse?.id || `house-${Date.now()}`,
      houseName: formData.name,
      capacity: Number.parseInt(formData.capacity),
      currentBirds: Number.parseInt(formData.currentBirds),
      location: formData.location,
      status: formData.status,
      notes: formData.notes,
    };

    setIsLoading(true);
    const payload: Record<string, unknown> = {
      houseName: houseData.houseName,
      capacity: houseData.capacity,
      currentBirds: houseData.currentBirds,
      location: houseData.location,
      status: houseData.status,
      notes: houseData.notes,
    };

    const op = editingHouse ? updateHouse(editingHouse.id, payload) : createHouse(payload);

    op.then(() => getHouses())
      .then((data) => {
        setHouses(data);
        try {
          localStorage.setItem('farm-pilot-houses', JSON.stringify(data));
        } catch {
          // ignore
        }
        resetForm();
        setIsAddDialogOpen(false);
      })
      .catch((err) => {
        console.error('House save failed', err);
        alert((err && err.message) || 'Failed to save house. Try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (house: House) => {
    setEditingHouse(house);
    setFormData({
      name: house.houseName,
      capacity: house.capacity.toString(),
      currentBirds: house.currentBirds.toString(),
      location: house.location,
      status: house.status,
      notes: house.notes || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (houseId: string) => {
    if (!confirm('Are you sure you want to delete this house?')) return;

    setIsLoading(true);
    deleteHouse(houseId)
      .then(() => getHouses())
      .then((data) => {
        setHouses(data);
        try {
          localStorage.setItem('farm-pilot-houses', JSON.stringify(data));
        } catch {
          // ignore
        }
      })
      .catch((err) => {
        console.error('Delete failed', err);
        alert((err && err.message) || 'Failed to delete house. Try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const getStatusColor = (status: House['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCapacity = houses.reduce((sum, house) => sum + house.capacity, 0);
  const totalBirds = houses.reduce((sum, house) => sum + house.currentBirds, 0);
  const activeHouses = houses.filter((house) => house.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">House Management</h2>
          <p className="text-muted-foreground">Manage your farm houses and bird populations</p>
          {isLoading && <p className="text-xs text-muted-foreground">Loading…</p>}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add House
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHouse ? 'Edit House' : 'Add New House'}</DialogTitle>
              <DialogDescription>
                {editingHouse ? 'Update house information' : 'Create a new house for your farm'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="houseName">House Name</Label>
                <Input
                  id="houseName"
                  placeholder="e.g., House 1, Layer House A"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="500"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentBirds">Current Birds</Label>
                  <Input
                    id="currentBirds"
                    type="number"
                    placeholder="500"
                    value={formData.currentBirds}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentBirds: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., North Section, Block A"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as House['status'],
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information about this house"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingHouse ? 'Update House' : 'Add House'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{houses.length}</div>
            <p className="text-xs text-muted-foreground">{activeHouses} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">birds maximum</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Population</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBirds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalBirds / totalCapacity) * 100).toFixed(1)}% capacity
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Houses Overview</CardTitle>
          <CardDescription>Manage all your farm houses and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>House Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Current Birds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {houses.map((house) => (
                <TableRow key={house.id}>
                  <TableCell className="font-medium">{house.houseName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {house.location}
                    </div>
                  </TableCell>
                  <TableCell>{house.capacity.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {house.currentBirds.toLocaleString()}
                      <Badge variant="outline" className="text-xs">
                        {((house.currentBirds / house.capacity) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(house.status)}>{house.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(house)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(house.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
