import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";
import {
  FaConciergeBell,
  GiBread,
  GiPig,
  GiVendingMachine,
  IoRestaurantSharp,
  LuCigarette,
  LuCoffee,
  MdLocalBar,
  MdOutlineStorefront,
  PiBasket,
  PiFarm,
} from "../react-icons";

const tagOptions: Option[] = [
  { label: "Bar", value: "bar", Icon: MdLocalBar },
  { label: "Épicerie", value: "epicerie", Icon: MdOutlineStorefront },
  { label: "Ferme", value: "ferme", Icon: PiFarm },
  { label: "Tabac", value: "tabac", Icon: LuCigarette },
  { label: "Café", value: "cafe", Icon: LuCoffee },
  { label: "Boulangerie", value: "boulangerie", Icon: GiBread },
  { label: "AMAP", value: "amap", Icon: PiBasket },
  { label: "Restaurant", value: "restaurant", Icon: IoRestaurantSharp },
  { label: "Traiteur", value: "caterer", Icon: FaConciergeBell },
  { label: "Boucherie Charcuterie", value: "butcher", Icon: GiPig },
  { label: "Distributeur", value: "distributeur", Icon: GiVendingMachine },
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
