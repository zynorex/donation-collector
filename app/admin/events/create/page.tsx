"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    categoryId: "",
  });
  const [bannerImage, setBannerImage] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, bannerImage }),
      });

      if (!res.ok) throw new Error("Failed to create event");

      toast.success("Campaign created successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-navy dark:text-white mb-8">Create New Campaign</h1>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="100"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(val: any) => setFormData({ ...formData, categoryId: val || "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <CldUploadWidget
                uploadPreset="unifund_preset" // You will need to create an unsigned preset in Cloudinary
                onSuccess={(result: any) => {
                  setBannerImage(result.info.secure_url);
                }}
              >
                {({ open }) => {
                  return (
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" onClick={() => open()}>
                        Upload Image
                      </Button>
                      {bannerImage && <span className="text-sm text-green-600">Image uploaded successfully</span>}
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-navy text-white hover:bg-navy/90">
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
