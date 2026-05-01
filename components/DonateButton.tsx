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
          color: "#1e3a5f",
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
        <DialogTrigger render={<Button className="w-full bg-navy text-white hover:bg-navy/90 text-lg py-6 shadow-lg shadow-navy/20">Donate Now</Button>} />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-navy">Make a Donation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDonate} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="flex gap-2 mb-2 mt-1">
                {[50, 100, 500, 1000].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset ? "default" : "outline"}
                    className={amount === preset ? "bg-navy text-white" : "text-navy border-navy"}
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
            
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="anonymous"
                className="rounded border-neutral-300 text-navy focus:ring-navy h-4 w-4"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                Donate anonymously (hide my name)
              </Label>
            </div>

            {!session && (
              <p className="text-sm text-neutral-500 bg-neutral-100 p-3 rounded-md">
                You are donating as a guest. <a href="/auth/login" className="text-navy font-bold hover:underline">Log in</a> to track your contributions!
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gold text-navy hover:bg-gold/90 font-bold mt-2">
              {loading ? "Processing..." : "Proceed to Pay"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
