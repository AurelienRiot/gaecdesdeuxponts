import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockCardProps {
  title?: string;
  stock?: number;
  id?: string;
  action?: (formData: FormData) => void;
}

function StockCard({ title, id, stock, action }: StockCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title === undefined ? <Skeleton size={"lg"} /> : title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Stock :</span>
            <span>{stock === undefined ? <Skeleton size={"sm"} /> : stock}</span>
          </div>
          <form action={action} className="space-y-1">
            <Label htmlFor={id}>Mettre à jour le Stock:</Label>
            <div className="flex gap-2 ">
              <Input type={"number"} required id={id} name={id} placeholder="quantité" className="w-3/5" />

              <Button type="submit" className="w-full">
                Mettre à jour
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default StockCard;
