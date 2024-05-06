"use client";
import ProductCart from "@/components/product/product-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainProductWithProducts, ProductWithOptionsAndMain } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type FilterValue = {
  search: string;
  name: string;
  options: { name: string; value: string }[];
};

const initialFilter = {
  search: "",
  name: "",
  options: [],
};

const DisplayProducts = ({
  products,
}: {
  products: MainProductWithProducts[];
}) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filterValue, setFilterValue] = useState<FilterValue>(initialFilter);

  // useEffect(() => {
  //   setFilteredProducts(filterProducts(products, filterValue));
  // }, [filterValue, products]);

  // const resetFilter = () => {
  //   setFilterValue(initialFilter);
  // };
  return (
    <div className="flex gap-12">
      {/* <div className="space-y-6">
        <FilterProducts
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        <SelectName
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          products={products}
        />
        <SelectedOptions
          filterValue={filterValue}
          products={products}
          setFilterValue={setFilterValue}
        />
        {products.length !== filteredProducts.length && (
          <Button
            onClick={resetFilter}
            variant={"outline"}
            className="border-dashed"
          >
            {" "}
            Réinitialiser les filtres
          </Button>
        )}
      </div> */}
      {/* <div className="justify-left mx-auto flex flex-wrap gap-12">
        {filteredProducts.map((item) => (
          <ProductCart data={item} key={item.id} />
        ))}
      </div> */}
    </div>
  );
};

export default DisplayProducts;

const SelectName = ({
  setFilterValue,
  filterValue,
  products,
}: {
  setFilterValue: Dispatch<SetStateAction<FilterValue>>;
  filterValue: FilterValue;
  products: ProductWithOptionsAndMain[];
}) => {
  const uniqueName = [...new Set(products.map((item) => item.name))];

  return (
    <Select
      value={filterValue.name}
      onValueChange={(value) => setFilterValue({ ...filterValue, name: value })}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choisisez un produit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {uniqueName.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const FilterProducts = ({
  setFilterValue,
  filterValue,
}: {
  setFilterValue: Dispatch<SetStateAction<FilterValue>>;
  filterValue: FilterValue;
}) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  return (
    <div className="filter-container">
      <Input
        type="text"
        value={filterValue.search}
        onChange={handleFilterChange}
        placeholder="Rechercher..."
        className="filter-input"
      />
    </div>
  );
};

const SelectedOptions = ({
  setFilterValue,
  products,
  filterValue,
}: {
  setFilterValue: Dispatch<SetStateAction<FilterValue>>;
  products: ProductWithOptionsAndMain[];
  filterValue: FilterValue;
}) => {
  const onSelect = (key: string, value: string, index: number) => {
    if (index === 0) {
      setFilterValue((prev) => ({
        ...prev,
        options: [{ name: key, value: value }],
      }));
    } else {
      setFilterValue((prev) => ({
        ...prev,
        options: prev.options
          .filter((option) => option.name !== key)
          .concat({ name: key, value: value }),
      }));
    }
  };

  const optionsMap = extractOptionNamesAndValues(products);

  return (
    <div className="space-y-6">
      {Object.entries(optionsMap).map(([key, value], index) => (
        <RadioGroup
          key={key}
          value={
            filterValue.options.find((option) => option.name === key)?.value ||
            ""
          }
          onValueChange={(value) => onSelect(key, value, index)}
        >
          <Label htmlFor={key} className="text-lg font-bold">
            {key}
          </Label>
          {value.map((item) => {
            const isAvailable =
              index === 0 ||
              filterProducts(products, {
                ...filterValue,
                options: filterValue.options
                  .filter((option) => option.name !== key) // Remove the option with the name that matches the key
                  .concat([{ name: key, value: item }]),
              }).length > 0;
            // console.log(key, item);
            // console.log(isAvailable);
            return (
              <div key={item} className="flex items-center space-x-2 pl-2">
                <RadioGroupItem
                  value={item}
                  id={item}
                  disabled={!isAvailable}
                />
                <Label
                  htmlFor={item}
                  className="peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  {item}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      ))}
    </div>
  );
};
function extractOptionNamesAndValues(
  products: ProductWithOptionsAndMain[],
): Record<string, string[]> {
  const optionMap: Record<string, Set<string>> = {};

  products.forEach((product) => {
    product.options.forEach((option) => {
      if (!optionMap[option.name]) {
        optionMap[option.name] = new Set();
      }
      optionMap[option.name].add(option.value);
    });
  });

  const optionMapWithArrays: Record<string, string[]> = {};
  for (const [key, valueSet] of Object.entries(optionMap)) {
    optionMapWithArrays[key] = Array.from(valueSet);
  }

  return optionMapWithArrays;
}

function filterProducts(
  products: ProductWithOptionsAndMain[],
  filterValue: FilterValue,
) {
  return products.filter((product) => {
    const namesMatch = !filterValue.name || product.name === filterValue.name;

    // Check for product name match
    const searchMatch = product.name
      .toLowerCase()
      .includes(filterValue.search.toLowerCase());

    // Check for options match

    const optionsMatch =
      filterValue.options.length === 0 ||
      filterValue.options.every((filterOption) =>
        product.options.some(
          (productOption) =>
            filterOption.name === productOption.name &&
            filterOption.value === productOption.value,
        ),
      );

    return searchMatch && optionsMatch && namesMatch;
  });
}
