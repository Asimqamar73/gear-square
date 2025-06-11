import { Edit2, RefreshCcw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../../../../components/ui/tooltip";

const Table = ({ data, handleSheetToggle }: any) => {
  const navigate = useNavigate();
  return (
    <T>
      <TableCaption>All products list</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Description</TableHead>
          <TableHead>Cost price (aed)</TableHead>
          <TableHead>Retail price (aed)</TableHead>
          <TableHead>Quantity (units)</TableHead>
          <TableHead className="text-right">SKU</TableHead>
          <TableHead className="text-right">Barcode</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum: any) => (
          <TableRow key={datum.id}>
            <TableCell>
              <img
                src={`file://${datum.image}`}
                alt={datum.name}
                className="rounded-md object-contain w-16 h-16"
              />
            </TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.description}</TableCell>
            <TableCell>{datum.cost_price}</TableCell>
            <TableCell>{datum.retail_price}</TableCell>
            <TableCell>{datum.quantity}</TableCell>
            <TableCell className="text-right">{datum.sku}</TableCell>
            <TableCell className="text-right">{datum.barcode}</TableCell>
            <TableCell className="text-right">
              <div className="text-right flex gap-2 justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="bg-gray-200"
                      onClick={() => navigate(`/edit-product/${datum.id}`)}
                    >
                      <Edit2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-300">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="bg-gray-200 border"
                      onClick={() => handleSheetToggle(datum)}
                    >
                      <RefreshCcw />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-300">
                    <p>Restock</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default Table;
