import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-navy text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Support University Events
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto text-balance">
          Join your fellow students in funding the best cultural, technical, and sports events. Your contribution makes a difference.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/events">
            <Button size="lg" className="bg-gold text-navy hover:bg-gold/90 text-lg px-8">
              Browse Events
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="text-navy bg-white hover:bg-neutral-100 border-none text-lg px-8">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
