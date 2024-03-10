// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import {  shops } from "../../find/page";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { cn, haversine } from "@/lib/utils";
// import {
//   Command,
//   CommandEmpty,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import AddressAutocomplete, {
//   Suggestion,
// } from "@/actions/adress-autocompleteFR";
// import { ShopCard } from "../../find/components/shop-card";
// import { Shop } from "@prisma/client";

// const PickLocation = ({
//   setShop,
//   className,
// }: {
//   setShop: Dispatch<SetStateAction<Shop | undefined>>;
//   className?: string;
// }) => {
//   const [coordinates, setCoordinates] = useState<
//     [number | undefined, number | undefined]
//   >([undefined, undefined]);
//   const [sortedShops, setSortedShops] = useState<Shop[]>([]);

//   useEffect(() => {
//     if (coordinates[0] !== undefined && coordinates[1] !== undefined) {
//       const shopsWithDistance = shops.map((shop) => ({
//         ...shop,
//         distance: haversine(coordinates, shop.coordinates),
//       }));

//       const sorted = shopsWithDistance
//         .filter((shop) => shop.distance !== undefined)
//         .sort((a, b) => a.distance! - b.distance!);
//       setSortedShops(sorted);
//     } else {
//       setSortedShops(shops); // Default to original order if no coordinates
//     }
//   }, [coordinates]);

//   return (
//     <Card
//       className={cn(
//         "mt-6 flex h-[450px] max-w-[500px] flex-col justify-between",
//         className,
//       )}
//     >
//       <CardHeader className="text-center text-2xl font-semibold ">
//         Selectionner votre lieu de livraison
//       </CardHeader>
//       <CardContent className="flex  flex-col items-center justify-center">
//         <AddressInput setCoordinates={setCoordinates} />
//         <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//           {sortedShops.map((shop) => (
//             <ShopCard shop={shop} key={shop.name} coordinates={coordinates} />
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PickLocation;

// const AddressInput = ({
//   setCoordinates,
// }: {
//   setCoordinates: Dispatch<
//     SetStateAction<[number | undefined, number | undefined]>
//   >;
// }) => {
//   const [suggestions, setSuggestions] = useState([] as Suggestion[]);
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);

//   const setSearchTerm = async (value: string) => {
//     setQuery(() => value);
//     const temp = await AddressAutocomplete(value);
//     setSuggestions(() => temp);
//   };

//   return (
//     <Command
//       filter={() => {
//         return 1;
//       }}
//       loop
//     >
//       <CommandInput
//         placeholder="Entrer l'adresse..."
//         className="h-9 "
//         value={query}
//         onFocus={() => setOpen(true)}
//         onValueChange={async (e) => {
//           await setSearchTerm(e);
//           setCoordinates(() =>
//             suggestions[0] && suggestions[0].coordinates
//               ? suggestions[0].coordinates
//               : [undefined, undefined],
//           );
//           setOpen(true);
//         }}
//       />
//       {open && (
//         <CommandList>
//           {query.length > 2 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
//           {suggestions.map((address, index) => (
//             <CommandItem
//               className="cursor-pointer
//                           bg-popover  text-popover-foreground"
//               value={String(index)}
//               key={address.label}
//               onSelect={() => {
//                 setCoordinates(address.coordinates);
//                 console.log(address.coordinates);
//                 setOpen(false);
//               }}
//             >
//               {address.label}
//             </CommandItem>
//           ))}
//         </CommandList>
//       )}
//     </Command>
//   );
// };
