import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-brutal-cream overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-brutal-lime border-3 border-black rotate-12 hidden md:block" />
      <div className="absolute top-24 right-16 w-12 h-12 bg-brutal-coral border-3 border-black -rotate-6 hidden md:block" />
      <div className="absolute bottom-12 left-1/4 w-10 h-10 bg-brutal-blue border-3 border-black rotate-45 hidden md:block" />
      <div className="absolute bottom-8 right-1/3 w-8 h-8 bg-brutal-yellow border-3 border-black rotate-12 hidden md:block" />
      
      <div className="container mx-auto px-4 py-20 md:py-28 text-center relative z-10">
        {/* Eyebrow */}
        <div className="inline-block bg-brutal-lime border-3 border-black px-4 py-1.5 mb-6 shadow-brutal-sm">
          <span className="font-heading text-sm font-bold uppercase tracking-widest text-brutal-black">
            🎓 University Student Portal
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] tracking-tighter text-brutal-black mb-6">
          Support<br />
          <span className="relative inline-block">
            University
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-brutal-lime -z-10 -skew-x-3" />
          </span>{" "}
          <br className="md:hidden" />
          Events
        </h1>

        {/* Description */}
        <p className="font-sans text-lg md:text-xl text-brutal-charcoal mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
          Join your fellow students in funding the best cultural, technical, and
          sports events. Your contribution makes a real difference.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/events">
            <Button size="lg" className="text-lg px-10">
              Browse Events
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="text-lg px-10">
              Join Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="h-4 bg-brutal-black" />
    </section>
  );
}
