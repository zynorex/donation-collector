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
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Banner */}
      <div className="w-full h-64 md:h-96 bg-brutal-cream relative border-3 border-black shadow-brutal-md overflow-hidden mb-10">
        {event.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brutal-charcoal">
            <span className="font-heading text-lg uppercase tracking-wider">No Image Available</span>
          </div>
        )}
        <Badge className="absolute top-4 right-4 text-sm py-1.5 px-4" variant="secondary">
          {event.category.name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-brutal-black mb-6 leading-tight">
            {event.title}
          </h1>
          <div className="border-3 border-black bg-white p-6 shadow-brutal font-sans text-brutal-charcoal leading-relaxed text-base">
            {event.description.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Sidebar / Donation Card */}
        <div>
          <div className="bg-white border-3 border-black shadow-brutal-md p-6 sticky top-24">
            {/* Amount Raised */}
            <div className="mb-4">
              <h3 className="font-heading text-4xl font-bold text-brutal-black">
                ₹{event.raisedAmount.toLocaleString()}
              </h3>
              <p className="text-label text-brutal-charcoal mt-1">
                raised of ₹{event.targetAmount.toLocaleString()} goal
              </p>
            </div>
            
            {/* Progress */}
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between items-center mb-6">
              <span className="text-label text-brutal-blue">{Math.round(progress)}% funded</span>
              <span className="text-label text-brutal-charcoal">
                {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
              </span>
            </div>

            {/* Donor count */}
            <div className="bg-brutal-cream border-3 border-black p-3 mb-6 text-center">
              <span className="font-heading text-2xl font-bold text-brutal-black">{event.donations.length}</span>
              <span className="text-label text-brutal-charcoal ml-2">donors</span>
            </div>

            {/* Donate CTA */}
            {!isEnded ? (
              <DonateButton eventId={event.id} />
            ) : (
              <div className="bg-brutal-cream border-3 border-black text-center py-4 font-heading text-sm uppercase tracking-wider text-brutal-charcoal">
                Campaign Ended
              </div>
            )}

            {/* Recent Donors */}
            <div className="mt-8 pt-6 border-t-3 border-black">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-brutal-black mb-4">
                Recent Donors
              </h4>
              {event.donations.length === 0 ? (
                <p className="text-brutal-charcoal text-sm font-sans">Be the first to donate!</p>
              ) : (
                <ul className="space-y-4">
                  {event.donations.map((donation) => (
                    <li key={donation.id} className="flex items-start gap-3 text-sm">
                      <div className="w-9 h-9 border-2 border-black bg-brutal-yellow flex items-center justify-center font-heading font-bold text-brutal-black flex-shrink-0">
                        {donation.isAnonymous ? "?" : (donation.user?.name?.[0] || "U")}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-brutal-black text-sm">
                          {donation.isAnonymous ? "Anonymous" : (donation.user?.name || "Student")}
                        </p>
                        <p className="font-heading font-bold text-brutal-blue text-sm">
                          ₹{donation.amount.toLocaleString()}
                        </p>
                        {donation.message && (
                          <p className="text-brutal-charcoal font-sans text-xs mt-1 italic">"{donation.message}"</p>
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
