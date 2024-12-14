import NotFound from "@/components/not-found";
import Container from "@/components/ui/container";
import { Clock, LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { tagOptions, typeTextRecord } from "@/components/display-shops";
import { DisplayHoursContent } from "@/components/display-shops/display-hours";
import DisplayTags from "@/components/display-shops/display-tags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayLink } from "@/components/user";
import { formatFrenchPhoneNumber } from "@/lib/utils";
import { getShop, type ShopPageProps } from "./_functions/static-params";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const shop = await getShop(params.shopId);
  const tags = shop && tagOptions.filter((option) => shop.tags.includes(option.value));
  const keywords = tags?.map((tag) => tag.label);
  const title = shop?.name || "";
  const description = shop?.description?.substring(0, 150).split(" ").slice(0, -1).join(" ") || "";
  const images = shop?.imageUrl || "";
  const url = `${baseUrl}/ou-nous-trouver/${params.shopId}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const ShopPage = async ({ params }: ShopPageProps) => {
  const shop = await getShop(params.shopId);
  if (!shop) {
    return <NotFound />;
  }

  const typeText = typeTextRecord[shop.type];
  return (
    <Container className="max-w-3xl mb-4">
      <Card className="overflow-hidden">
        <CardHeader className="relative p-0 h-64">
          {
            <Image
              fill
              src={shop.imageUrl || "/skeleton-image.webp"}
              alt={`Image de ${shop.name}`}
              sizes="(max-width: 768px) 100vw,  768px"
              className={shop.imageUrl ? "object-contain" : "object-cover"}
            />
          }
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{shop.name}</h1>
            <p className="text-white/80">{typeText}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <DisplayTags shopTags={shop.tags} />
          <p className="text-muted-foreground">{shop.description}</p>
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
              <a
                href={`https://maps.google.com/?q=${shop.address} ${shop.name} `}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {shop.address}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
              <a href={`tel:${formatFrenchPhoneNumber(shop.phone)}`} className="text-primary hover:underline">
                {formatFrenchPhoneNumber(shop.phone)}
              </a>
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
