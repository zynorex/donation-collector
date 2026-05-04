import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import { prisma } from "@/lib/prisma";

// Revalidate every hour for homepage
export const revalidate = 3600;

export default async function Home() {
  const events = await prisma.event.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = await prisma.$transaction([
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.donation.count({
      where: { status: "SUCCESS" },
    }),
    prisma.event.count({
      where: { status: "ACTIVE" },
    }),
  ]);

  const totalRaised = stats[0]._sum.amount || 0;
  const totalDonors = stats[1];
  const activeEvents = stats[2];

  return (
    <div>
      <Hero />
      
      {/* Stats Section */}
      <section className="py-12 bg-white border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Raised */}
            <div className="bg-brutal-lime border-3 border-black shadow-brutal p-6 text-center">
              <h3 className="font-heading text-4xl md:text-5xl font-bold text-brutal-black mb-1">
                ₹{totalRaised.toLocaleString()}
              </h3>
              <p className="text-label text-brutal-black/70">Total Raised</p>
            </div>
            {/* Donors */}
            <div className="bg-brutal-blue border-3 border-black shadow-brutal p-6 text-center">
              <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-1">
                {totalDonors}
              </h3>
              <p className="text-label text-white/80">Donors</p>
            </div>
            {/* Active Events */}
            <div className="bg-brutal-coral border-3 border-black shadow-brutal p-6 text-center">
              <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-1">
                {activeEvents}
              </h3>
              <p className="text-label text-white/80">Active Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-brutal-black">
              Featured Campaigns
            </h2>
            <div className="flex-1 h-[3px] bg-black hidden md:block" />
            <div className="w-6 h-6 bg-brutal-lime border-3 border-black rotate-45 hidden md:block" />
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 border-3 border-black bg-white shadow-brutal">
              <p className="font-heading text-xl uppercase text-brutal-charcoal">
                No active campaigns at the moment.
              </p>
              <p className="text-brutal-charcoal/60 mt-2 font-sans">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  bannerImage={event.bannerImage}
                  targetAmount={event.targetAmount}
                  raisedAmount={event.raisedAmount}
                  deadline={event.deadline}
                  categoryName={event.category.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
