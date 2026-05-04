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
    <Card className="flex flex-col group transition-all duration-200 hover:shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="h-48 bg-brutal-cream relative border-b-3 border-black overflow-hidden">
        {bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brutal-charcoal bg-brutal-cream">
            <span className="font-heading text-sm uppercase tracking-wider">No Image</span>
          </div>
        )}
        <Badge className="absolute top-3 right-3" variant="secondary">
          {categoryName}
        </Badge>
      </div>

      {/* Content */}
      <CardHeader className="pb-1">
        <CardTitle className="text-xl line-clamp-1 uppercase">{title}</CardTitle>
        <p className="text-sm text-brutal-charcoal line-clamp-2 font-sans mt-1">{description}</p>
      </CardHeader>

      <CardContent className="flex-grow pt-3">
        <div className="mb-3 flex justify-between text-sm font-heading font-bold">
          <span className="text-brutal-black">₹{raisedAmount.toLocaleString()}</span>
          <span className="text-brutal-charcoal">₹{targetAmount.toLocaleString()} goal</span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex items-center justify-between">
          <span className="text-label text-brutal-charcoal">
            {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
          </span>
          <span className="text-label text-brutal-blue">
            {Math.round(progress)}%
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/events/${id}`} className="w-full">
          <Button className="w-full">
            View Details →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
