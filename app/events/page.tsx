import { prisma } from "@/lib/prisma";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Note: In a real app, filtering/searching is better handled client-side with URL params,
// but for simplicity we'll render all active events and a search UI outline here.
// Revalidation time set to 60s
export const revalidate = 60;

export default async function EventsListingPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || "";
  const categoryFilter = searchParams.category || "";

  const events = await prisma.event.findMany({
    where: {
      status: "ACTIVE",
      title: { contains: query, mode: "insensitive" },
      ...(categoryFilter ? { categoryId: categoryFilter } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy dark:text-white mb-6">Browse Campaigns</h1>
      
      {/* Filters & Search - UI outline */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2">
          <Input 
            type="text" 
            name="q" 
            placeholder="Search campaigns..." 
            defaultValue={query}
            className="max-w-md"
          />
          <select 
            name="category" 
            defaultValue={categoryFilter}
            className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Button type="submit" className="bg-navy text-white hover:bg-navy/90">Search</Button>
        </form>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-neutral-500 py-12">No campaigns found.</div>
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
  );
}
