import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";

const tagOptions: Option[] = [
  { label: "Bar", value: "bar" },
  { label: "Épicerie", value: "epicerie" },
  { label: "Ferme", value: "ferme" },
  { label: "Tabac", value: "tabac" },
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
