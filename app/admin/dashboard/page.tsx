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

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await prisma.$transaction([
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.event.count({
      where: { status: "ACTIVE" },
    }),
    prisma.donation.count({
      where: { status: "SUCCESS" },
    }),
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-navy dark:text-white">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/events">
            <Button variant="outline" className="text-navy border-navy">Manage Events</Button>
          </Link>
          <Link href="/admin/events/create">
            <Button className="bg-gold text-navy hover:bg-gold/90">Create Event</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-navy text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-neutral-300">Total Funds Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{totalRaised.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-neutral-500">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-navy dark:text-white">{activeEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-neutral-500">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-navy dark:text-white">{totalDonations}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-navy dark:text-white">Recent Donations</CardTitle>
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
                  <TableCell className="font-medium">
                    {donation.isAnonymous ? "Anonymous" : (donation.user?.name || "Guest")}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">₹{donation.amount.toLocaleString()}</TableCell>
                  <TableCell>{donation.event.title}</TableCell>
                  <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
