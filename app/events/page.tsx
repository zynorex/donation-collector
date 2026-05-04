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
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-brutal-black">
          Browse Campaigns
        </h1>
        <div className="flex-1 h-[3px] bg-black hidden md:block" />
        <div className="w-6 h-6 bg-brutal-blue border-3 border-black rotate-45 hidden md:block" />
      </div>
      
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-10">
        <form className="flex-1 flex gap-3 flex-wrap md:flex-nowrap">
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
            className="h-11 w-[220px] border-3 border-black bg-white px-4 py-2 font-sans text-sm text-brutal-black outline-none focus:shadow-brutal-sm transition-all duration-150 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {/* Results */}
      {events.length === 0 ? (
        <div className="text-center py-16 border-3 border-black bg-white shadow-brutal">
          <p className="font-heading text-xl uppercase text-brutal-charcoal">
            No campaigns found.
          </p>
          <p className="text-brutal-charcoal/60 mt-2 font-sans">Try adjusting your search or filters.</p>
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
  );
}
