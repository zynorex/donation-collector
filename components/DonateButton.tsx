"use client";

import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DonateButton({ eventId }: { eventId: string }) {
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  const presets = [50, 100, 500, 1000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      toast.error("Please enter an amount of at least ₹10");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, eventId, message, isAnonymous }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxx",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "UniFund",
        description: "Event Donation",
        order_id: data.order.id,
        handler: function (response: any) {
          toast.success("Donation successful! Thank you for your contribution.");
          setOpen(false);
          router.refresh();
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#C5F82A",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <Button className="w-full text-lg py-6 shadow-brutal-md">
            ✦ Donate Now
          </Button>
        } />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDonate} className="space-y-5 mt-4">
            {/* Amount Presets */}
            <div>
              <Label htmlFor="amount" className="text-label mb-2 block">Amount (₹)</Label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {presets.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAmount(preset)}
                  >
                    ₹{preset}
                  </Button>
                ))}
              </div>
              <Input
                id="amount"
                type="number"
                min="10"
                placeholder="Custom Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || "")}
                required
              />
            </div>
            
            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-label mb-2 block">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="anonymous"
                className="w-5 h-5 border-3 border-black bg-white checked:bg-brutal-lime appearance-none cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-brutal-black checked:after:font-bold checked:after:text-xs"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <Label htmlFor="anonymous" className="text-sm font-sans font-normal cursor-pointer">
                Donate anonymously (hide my name)
              </Label>
            </div>

            {/* Guest message */}
            {!session && (
              <div className="bg-brutal-yellow/30 border-3 border-black p-3 text-sm font-sans">
                You are donating as a guest.{" "}
                <a href="/auth/login" className="font-bold underline underline-offset-2 hover:text-brutal-blue">
                  Log in
                </a>{" "}
                to track your contributions!
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full text-base">
              {loading ? "Processing..." : "Proceed to Pay →"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
