// import { Edit2, RefreshCcw } from "lucide-react";
// import { Button } from "../../../../components/ui/button";
// import {
//   Table as T,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../../components/ui/table";
// import { useNavigate } from "react-router-dom";
// import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
// import { TooltipContent } from "../../../../components/ui/tooltip";

// interface Product {
//   id: string;
//   image: string;
//   name: string;
//   description?: string;
//   cost_price: number;
//   retail_price: number;
//   quantity: number;
//   sku?: string;
//   part_number?: string;
// }

// interface ProductTableProps {
//   data: Product[];
//   handleSheetToggle: (product: Product) => void;
// }

// const Table = ({ data, handleSheetToggle }: ProductTableProps) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-x-auto">
//       <T className="min-w-full">
//         <TableCaption className="text-gray-500 text-sm p-3">
//           Complete Products Inventory
//         </TableCaption>

//         <TableHeader>
//           <TableRow className="bg-gray-100 text-gray-700">
//             <TableHead className="w-20 font-medium text-left">Photo</TableHead>
//             <TableHead className="w-32 font-medium text-left">Product Name</TableHead>
//             <TableHead className="w-48 font-medium text-left">Description</TableHead>
//             <TableHead className="text-right font-medium w-28">Cost Price (AED)</TableHead>
//             <TableHead className="text-right font-medium w-28">Retail Price (AED)</TableHead>
//             <TableHead className="text-right font-medium w-24">Stock Qty</TableHead>
//             <TableHead className="text-right font-medium w-28">SKU</TableHead>
//             <TableHead className="text-center font-medium w-28">Part No.</TableHead>
//             <TableHead className="text-center font-medium w-32">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.map((product, idx) => (
//             <TableRow
//               key={product.id}
//               className={`transition hover:bg-gray-50 ${
//                 idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//               }`}
//             >
//               <TableCell>
//                 <img
//                   src={`file://${product.image}`}
//                   alt={product.name}
//                   className="w-8 h-8 object-contain rounded-md"
//                 />
//               </TableCell>

//               <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
//               <TableCell>{product.description || "-"}</TableCell>
//               <TableCell className="text-right">{product.cost_price.toFixed(2)}</TableCell>
//               <TableCell className="text-right">{product.retail_price.toFixed(2)}</TableCell>
//               <TableCell className="text-right">{product.quantity}</TableCell>
//               <TableCell className="text-right">{product.sku || "-"}</TableCell>
//               <TableCell className="text-center">{product.part_number || "-"}</TableCell>

//               <TableCell className="flex justify-center gap-2">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="outline"
//                       className="bg-gray-100 hover:bg-gray-200"
//                       onClick={() => navigate(`/edit-product/${product.id}`)}
//                     >
//                       <Edit2 />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent className="bg-gray-800 text-white text-sm">
//                     Edit Product
//                   </TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="outline"
//                       className="bg-gray-100 hover:bg-gray-200"
//                       onClick={() => handleSheetToggle(product)}
//                     >
//                       <RefreshCcw />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent className="bg-gray-800 text-white text-sm">
//                     Restock Product
//                   </TooltipContent>
//                 </Tooltip>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </T>
//     </div>
//   );
// };

// export default Table;






import { Edit2, RefreshCcw, Package, AlertCircle, TrendingUp, Barcode } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  image: string;
  name: string;
  description?: string;
  cost_price: number;
  retail_price: number;
  quantity: number;
  sku?: string;
  part_number?: string;
}

interface ProductTableProps {
  data: Product[];
  onEdit: (productId: string) => void;
  onRestock: (product: Product) => void;
}

const ProductsTable = ({ data, onEdit, onRestock }: ProductTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data && data.length > 0;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
    } else if (quantity < 10) {
      return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-700 border-green-200" };
  };

  const calculateMargin = (cost: number, retail: number) => {
    if (retail === 0) return 0;
    return (((retail - cost) / retail) * 100).toFixed(1);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No products in inventory</p>
              <p className="text-gray-400 text-sm mt-1">Add products to start tracking inventory</p>
            </caption>
          )}
          
          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Product
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pricing (AED)
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Barcode className="w-4 h-4" />
                      Identifiers
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {data.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  const margin = calculateMargin(product.cost_price, product.retail_price);
                  
                  return (
                    <tr 
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            {product.image ? (
                              <img
                                src={`file://${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{product.name}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        {product.description ? (
                          <span className="text-sm text-gray-600 line-clamp-2">{product.description}</span>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No description</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Cost:</span>
                            <span className="text-sm font-medium text-gray-700">{product.cost_price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Retail:</span>
                            <span className="text-sm font-semibold text-gray-900">{product.retail_price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="w-3 h-3" />
                            <span>{margin}% margin</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                            {product.quantity === 0 && <AlertCircle className="w-3 h-3 mr-1" />}
                            {stockStatus.label}
                          </span>
                          <span className="text-lg font-bold text-gray-900">{product.quantity}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          {product.sku ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">SKU</span>
                              <span className="text-sm font-mono text-gray-900">{product.sku}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">No SKU</span>
                          )}
                          {product.part_number ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Part No.</span>
                              <span className="text-sm font-mono text-gray-900">{product.part_number}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">No Part No.</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-1.5">
                          <div className="relative">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                              onClick={() => onEdit(product.id)}
                              onMouseEnter={() => setHoveredTooltip(`edit-${product.id}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="Edit product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {hoveredTooltip === `edit-${product.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                                Edit product
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <button
                              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-green-50 hover:text-green-600 transition-colors text-gray-600"
                              onClick={() => onRestock(product)}
                              onMouseEnter={() => setHoveredTooltip(`restock-${product.id}`)}
                              onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="Restock product"
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </button>
                            {hoveredTooltip === `restock-${product.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                                Restock product
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Total products: {data.length}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;