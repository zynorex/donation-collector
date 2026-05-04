import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const stats = await prisma.$transaction([
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.event.count({ where: { status: "ACTIVE" } }),
    prisma.donation.count({ where: { status: "SUCCESS" } }),
  ]);

  const totalRaised = stats[0]._sum.amount || 0;
  const activeEvents = stats[1];
  const totalDonations = stats[2];

  const recentDonations = await prisma.donation.findMany({
    where: { status: "SUCCESS" },
    include: { event: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-brutal-black">
          Admin Dashboard
        </h1>
        <div className="flex gap-3">
          <Link href="/admin/events">
            <Button variant="outline">Manage Events</Button>
          </Link>
          <Link href="/admin/events/create">
            <Button>Create Event</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-brutal-lime border-3 border-black shadow-brutal p-6">
          <p className="text-label text-brutal-black/70 mb-1">Total Raised</p>
          <div className="font-heading text-4xl font-bold text-brutal-black">₹{totalRaised.toLocaleString()}</div>
        </div>
        <div className="bg-brutal-blue border-3 border-black shadow-brutal p-6">
          <p className="text-label text-white/80 mb-1">Active Campaigns</p>
          <div className="font-heading text-4xl font-bold text-white">{activeEvents}</div>
        </div>
        <div className="bg-brutal-coral border-3 border-black shadow-brutal p-6">
          <p className="text-label text-white/80 mb-1">Total Donations</p>
          <div className="font-heading text-4xl font-bold text-white">{totalDonations}</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl uppercase">Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-heading font-bold">
                    {donation.isAnonymous ? "Anonymous" : (donation.user?.name || "Guest")}
                  </TableCell>
                  <TableCell className="font-heading font-bold text-brutal-blue">
                    ₹{donation.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-sans">{donation.event.title}</TableCell>
                  <TableCell className="font-sans">{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
