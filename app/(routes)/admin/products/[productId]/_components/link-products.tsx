// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
// import { UseFormReturn } from "react-hook-form";
// import { ProductFormValues } from "./product-form";

// interface LinkProductsProps {
//   form: UseFormReturn<ProductFormValues>;
//   options: Option[];
// }

// const LinkProducts = ({ form, options }: LinkProductsProps) => {
//   return (
//     <FormField
//       control={form.control}
//       name="linkProducts"
//       render={({ field }) => (
//         <FormItem className="w-96">
//           <FormLabel>Produits liés </FormLabel>
//           <FormControl>
//             <MultipleSelector
//               value={field.value}
//               onChange={field.onChange}
//               options={options}
//               placeholder="Selectionner les produits à liés"
//               emptyIndicator={
//                 <p className="ml-4 text-left text-sm  text-gray-600 dark:text-gray-400">
//                   Aucun résultat.
//                 </p>
//               }
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export default LinkProducts;
