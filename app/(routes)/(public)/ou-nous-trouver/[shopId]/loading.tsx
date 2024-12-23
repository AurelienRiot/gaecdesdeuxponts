import { Skeleton, SkeletonText } from "@/components/skeleton-ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/container";
import { Clock, LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <Container className="max-w-3xl mb-4">
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0 h-64">
          {
            <Image
              fill
              src={"/skeleton-image.webp"}
              alt={`Image skeleton`}
              sizes="(max-width: 768px) 100vw,  768px"
              className={"object-cover"}
            />
          }
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              <Skeleton size={"lg"} />
            </h1>
            <p className="text-white/80">
              <Skeleton size={"xl"} />
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="flex items-center gap-2">
            <Skeleton size={"icon"} className="w-16 h-4" />
            <Skeleton size={"icon"} className="w-16 h-4" />
            <Skeleton size={"icon"} className="w-16 h-4" />
          </div>
          <SkeletonText lines={7} />
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
              <Skeleton size={"lg"} />
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
              <Skeleton size={"lg"} />
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
              <Skeleton size={"lg"} />
            </div>
          </div>

          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Horraires d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="w-full h-96" />
            </CardContent>
          </Card>

          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Liens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton size={"lg"} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Container>
  );
}
