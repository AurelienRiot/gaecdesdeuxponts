import NotFound from "@/components/not-found";
import Container from "@/components/ui/container";
import prismadb from "@/lib/prismadb";
import { Clock, LinkIcon, Mail, MapPin, Phone, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { tagOptions, typeTextRecord } from "@/components/display-shops";
import { DisplayHoursContent } from "@/components/display-shops/display-hours";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayLink } from "@/components/user";
import { formatFrenchPhoneNumber } from "@/lib/utils";
import { getShop, getStaticParams, type ShopPageProps } from "./_functions/static-params";

export async function generateStaticParams() {
  return await getStaticParams();
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const shop = await getShop(params.shopId);

  return {
    title: shop?.name,
    description: shop?.description,
    openGraph: {
      images: shop?.imageUrl || "",
    },
  };
}

const ShopPage: React.FC<ShopPageProps> = async ({ params }) => {
  const shop = await getShop(params.shopId);
  if (!shop) {
    return <NotFound />;
  }

  const typeText = typeTextRecord[shop.type];
  const tags = tagOptions.filter((option) => shop.tags.includes(option.value));
  return (
    <Container className="max-w-3xl">
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0">
          <Image
            src={shop.imageUrl || "/skeleton-image.webp"}
            alt={shop.name}
            width={1200}
            height={400}
            className="w-full h-64 object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
            <p className="text-white/80">{typeText}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const Icon = tag.Icon || Tag;
              return (
                <Badge key={tag.value} variant="secondary">
                  <Icon className="w-4 h-4 mr-1" />
                  {tag.label}
                </Badge>
              );
            })}
          </div>
          <p className="text-muted-foreground">{shop.description}</p>
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>{shop.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>{formatFrenchPhoneNumber(shop.phone)}</span>
            </div>
            {shop.email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                <a href={`mailto:${shop.email}`} className="text-primary hover:underline">
                  {shop.email}
                </a>
              </div>
            )}
          </div>
          {shop.shopHours.length > 0 && (
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Horraires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DisplayHoursContent shopHours={shop.shopHours} />
              </CardContent>
            </Card>
          )}
          {shop.links.length > 0 && (
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Liens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shop.links.map((link) => (
                    <DisplayLink key={link.id} value={link.value} label={link.label} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ShopPage;
