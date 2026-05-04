import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function ManageEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const events = await prisma.event.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-brutal-black">
          Manage Campaigns
        </h1>
        <div className="flex-1 h-[3px] bg-black hidden md:block" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl uppercase">All Campaigns</CardTitle>
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
                  <TableCell className="font-heading font-bold line-clamp-1">{event.title}</TableCell>
                  <TableCell className="font-sans">{event.category.name}</TableCell>
                  <TableCell className="font-heading font-bold">₹{event.targetAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-heading font-bold text-brutal-blue">₹{event.raisedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === "ACTIVE" ? "success" : "outline"}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-sans">{new Date(event.deadline).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
