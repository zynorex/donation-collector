import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

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

  if (!user) {
    redirect("/auth/login");
  }

  const totalContributed = user.donations.reduce((sum, d) => sum + d.amount, 0);

  // Badge logic
  const badges = [];
  if (totalContributed >= 100) badges.push({ name: "Supporter", color: "bg-blue-100 text-blue-800" });
  if (totalContributed >= 1000) badges.push({ name: "Champion", color: "bg-gold text-navy" });
  if (user.donations.length >= 5) badges.push({ name: "Frequent Giver", color: "bg-green-100 text-green-800" });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-navy dark:text-white mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-navy text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-neutral-300">Total Contributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹{totalContributed.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-navy dark:text-white">My Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap pt-4">
            {badges.length === 0 ? (
              <p className="text-neutral-500">Make your first donation to earn a badge!</p>
            ) : (
              badges.map((badge, idx) => (
                <Badge key={idx} className={`${badge.color} px-3 py-1 text-sm font-medium border-none`}>
                  {badge.name}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-navy dark:text-white">Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {user.donations.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No donations yet. Start making an impact today!</p>
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
                    <TableCell className="font-medium">{donation.event.title}</TableCell>
                    <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                        Success
                      </Badge>
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
