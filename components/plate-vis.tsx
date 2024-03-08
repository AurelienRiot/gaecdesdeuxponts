import { plugins } from "@/lib/plate/plate-plugins";
import { Plate } from "@udecode/plate-common";
import { Editor } from "./plate-ui/editor";
import { cn } from "@/lib/utils";

export const PlateVis = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  return (
    <Plate initialValue={JSON.parse(value)} plugins={plugins}>
      <Editor
        className={cn("p-4 cursor-default bg-white ", className)}
        autoFocus
        focusRing={false}
        variant="ghost"
        size="md"
        readOnly
      />
    </Plate>
  );
};
