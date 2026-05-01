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
      <section className="py-12 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-700">
            <div className="py-4">
              <h3 className="text-4xl font-bold text-navy dark:text-white mb-2">₹{totalRaised.toLocaleString()}</h3>
              <p className="text-neutral-500 uppercase tracking-wider text-sm">Total Raised</p>
            </div>
            <div className="py-4">
              <h3 className="text-4xl font-bold text-navy dark:text-white mb-2">{totalDonors}</h3>
              <p className="text-neutral-500 uppercase tracking-wider text-sm">Donors</p>
            </div>
            <div className="py-4">
              <h3 className="text-4xl font-bold text-navy dark:text-white mb-2">{activeEvents}</h3>
              <p className="text-neutral-500 uppercase tracking-wider text-sm">Active Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy dark:text-white mb-8 text-center">
            Featured Campaigns
          </h2>
          {events.length === 0 ? (
            <div className="text-center text-neutral-500">No active campaigns at the moment.</div>
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
