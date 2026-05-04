import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      donations: {
        where: { status: "SUCCESS" },
        include: { event: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const totalContributed = user.donations.reduce((sum, d) => sum + d.amount, 0);

  // Badge logic
  const badges = [];
  if (totalContributed >= 100) badges.push({ name: "Supporter", variant: "default" as const });
  if (totalContributed >= 1000) badges.push({ name: "Champion", variant: "warning" as const });
  if (user.donations.length >= 5) badges.push({ name: "Frequent Giver", variant: "success" as const });

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-brutal-black">
          My Dashboard
        </h1>
        <div className="flex-1 h-[3px] bg-black hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-brutal-lime border-3 border-black shadow-brutal p-6">
          <p className="text-label text-brutal-black/70 mb-1">Total Contributed</p>
          <div className="font-heading text-4xl font-bold text-brutal-black">₹{totalContributed.toLocaleString()}</div>
        </div>

        <div className="md:col-span-2 bg-white border-3 border-black shadow-brutal p-6">
          <p className="text-label text-brutal-charcoal mb-3">My Badges</p>
          <div className="flex gap-2 flex-wrap">
            {badges.length === 0 ? (
              <p className="text-brutal-charcoal font-sans text-sm">Make your first donation to earn a badge!</p>
            ) : (
              badges.map((badge, idx) => (
                <Badge key={idx} variant={badge.variant}>{badge.name}</Badge>
              ))
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl uppercase">Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.donations.length === 0 ? (
            <div className="text-center py-10 border-3 border-black bg-brutal-cream">
              <p className="font-heading text-lg uppercase text-brutal-charcoal">No donations yet.</p>
              <p className="text-brutal-charcoal/60 mt-1 font-sans text-sm">Start making an impact today!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-heading font-bold">{donation.event.title}</TableCell>
                    <TableCell className="font-sans">{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-heading font-bold text-brutal-blue">₹{donation.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="success">Success</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
