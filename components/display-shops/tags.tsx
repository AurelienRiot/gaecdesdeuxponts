import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";
import { MdLocalBar, MdOutlineStorefront } from "react-icons/md";
import { PiFarm } from "react-icons/pi";
import { LuCigarette, LuCoffee } from "react-icons/lu";
import { GiBread } from "react-icons/gi";

const tagOptions: Option[] = [
  { label: "Bar", value: "bar", Icon: MdLocalBar },
  { label: "Épicerie", value: "epicerie", Icon: MdOutlineStorefront },
  { label: "Ferme", value: "ferme", Icon: PiFarm },
  { label: "Tabac", value: "tabac", Icon: LuCigarette },
  { label: "Café", value: "cafe", Icon: LuCoffee },
  { label: "Boulangerie", value: "boulangerie", Icon: GiBread },
];

type TagsMultipleSelectorProps = {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  disabled?: boolean;
};
const TagsMultipleSelector = ({ selectedTags, setSelectedTags, disabled }: TagsMultipleSelectorProps) => {
  const selectedTagOptions = selectedTags
    .map((tag) => tagOptions.find((option) => option.value === tag))
    .filter((option) => option !== undefined) as Option[];
  function setSelectedTagOptions(tags: Option[]) {
    setSelectedTags(tags.map((tag) => tag.value));
  }
  return (
    <div className="w-full">
      <MultipleSelector
        disabled={disabled}
        value={selectedTagOptions}
        onChange={setSelectedTagOptions}
        options={tagOptions}
        placeholder="Rechercher des tags"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">Aucun résultat</p>
        }
      />
    </div>
  );
};

export default TagsMultipleSelector;
