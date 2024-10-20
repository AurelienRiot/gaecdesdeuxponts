import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import updateStock from "../_actions/update-stock";
import DeleteButton from "@/components/delete-button";
import deleteStock from "../_actions/delete-stock";

interface StockCardProps {
  title?: string;
  stock?: number;
  name?: string;
  id?: string;
}

function StockCard({ title, name, stock, id }: StockCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-lg">{title === undefined ? <Skeleton size={"lg"} /> : title}</CardTitle>
        {!!id && <DeleteButton iconClassName="size-4" className="p-1 h-auto" action={deleteStock} data={{ id }} />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Stock :</span>
            <span>{stock === undefined ? <Skeleton size={"sm"} /> : stock}</span>
          </div>
          <form action={updateStock} className="space-y-1">
            <input type="hidden" name="name" value={name} />
            <Label htmlFor={name}>Mettre à jour le Stock:</Label>
            <div className="flex gap-2 ">
              <Input type={"number"} required name={"quantity"} placeholder="quantité" className="w-3/5" />

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
