import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function ManageEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-navy dark:text-white mb-8">Manage Campaigns</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium line-clamp-1">{event.title}</TableCell>
                  <TableCell>{event.category.name}</TableCell>
                  <TableCell>₹{event.targetAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{event.raisedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === "ACTIVE" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(event.deadline).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
