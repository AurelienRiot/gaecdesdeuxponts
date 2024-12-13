import { Tag } from "lucide-react";
import { Badge } from "../ui/badge";
import { tagOptions } from ".";

function DisplayTags({ shopTags }: { shopTags: string[] }) {
  const tags = tagOptions.filter((option) => shopTags.includes(option.value));

  return (
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
  );
}

export default DisplayTags;
