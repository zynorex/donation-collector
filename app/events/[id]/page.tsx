import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DonateButton from "@/components/DonateButton"; // We will create this client component

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      donations: {
        where: { status: "SUCCESS" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!event) {
    notFound();
  }

  const progress = Math.min((event.raisedAmount / event.targetAmount) * 100, 100);
  const daysLeft = Math.ceil((new Date(event.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isEnded = daysLeft <= 0 || event.status !== "ACTIVE" || event.raisedAmount >= event.targetAmount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 bg-neutral-200 rounded-xl overflow-hidden relative mb-8">
        {event.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-navy/10 text-xl">
            No Image Available
          </div>
        )}
        <Badge className="absolute top-4 right-4 text-lg py-1 px-3 bg-navy text-white">
          {event.category.name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-navy dark:text-white mb-4">{event.title}</h1>
          <div className="prose dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300">
            {event.description.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Sidebar / Donation Card */}
        <div>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 sticky top-8">
            <h3 className="text-3xl font-bold text-navy dark:text-white mb-2">
              ₹{event.raisedAmount.toLocaleString()}
            </h3>
            <p className="text-neutral-500 mb-4">raised of ₹{event.targetAmount.toLocaleString()} goal</p>
            
            <Progress value={progress} className="h-3 mb-6 bg-neutral-100" />
            
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400 mb-6 font-medium">
              <span>{event.donations.length} donors</span>
              <span>{daysLeft > 0 ? `${daysLeft} days left` : "Campaign Ended"}</span>
            </div>

            {!isEnded ? (
              <DonateButton eventId={event.id} />
            ) : (
              <div className="bg-neutral-100 dark:bg-neutral-700 text-center py-3 rounded-lg text-neutral-600 font-medium">
                This campaign is no longer active.
              </div>
            )}

            {/* Recent Donors */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <h4 className="font-bold text-navy dark:text-white mb-4">Recent Donors</h4>
              {event.donations.length === 0 ? (
                <p className="text-neutral-500 text-sm">Be the first to donate!</p>
              ) : (
                <ul className="space-y-4">
                  {event.donations.map((donation) => (
                    <li key={donation.id} className="flex items-start gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold flex-shrink-0">
                        {donation.isAnonymous ? "A" : (donation.user?.name?.[0] || "U")}
                      </div>
                      <div>
                        <p className="font-medium text-navy dark:text-white">
                          {donation.isAnonymous ? "Anonymous" : (donation.user?.name || "Student")}
                        </p>
                        <p className="text-neutral-500 font-bold">₹{donation.amount.toLocaleString()}</p>
                        {donation.message && (
                          <p className="text-neutral-600 dark:text-neutral-400 italic mt-1">"{donation.message}"</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
