import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  targetAmount: number;
  raisedAmount: number;
  deadline: Date;
  categoryName: string;
}

export default function EventCard({
  id,
  title,
  description,
  bannerImage,
  targetAmount,
  raisedAmount,
  deadline,
  categoryName,
}: EventCardProps) {
  const progress = Math.min((raisedAmount / targetAmount) * 100, 100);
  const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-neutral-800 border-none">
      <div className="h-48 bg-neutral-200 relative">
        {bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-navy/10">
            No Image Available
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-navy text-white hover:bg-navy/90">
          {categoryName}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1 text-navy dark:text-white">{title}</CardTitle>
        <p className="text-sm text-neutral-500 line-clamp-2 dark:text-neutral-400">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span className="text-navy dark:text-white">₹{raisedAmount.toLocaleString()} raised</span>
          <span className="text-neutral-500">₹{targetAmount.toLocaleString()} goal</span>
        </div>
        <Progress value={progress} className="h-2 mb-4 bg-neutral-100" />
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${id}`} className="w-full">
          <Button className="w-full bg-navy text-white hover:bg-navy/90">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
