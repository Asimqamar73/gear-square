import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";


const Table = ({ data }: any) => {
  return (
    <T>
      <TableCaption>Table Caption.</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Description</TableHead>
          <TableHead>Base price (aed)</TableHead>
          <TableHead>Quantity (units)</TableHead>
          <TableHead className="text-right">SKU</TableHead>
          <TableHead className="text-right">Barcode</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum: any) => (
          <TableRow>
            <TableCell>
              <img src={`file://${datum.image}`} alt={datum.name} className="rounded-md object-contain w-16 h-16" />
            </TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.description}</TableCell>
            <TableCell>{datum.base_price}</TableCell>
            <TableCell>{datum.quantity}</TableCell>
            <TableCell className="text-right">{datum.sku}</TableCell>
            <TableCell className="text-right">{datum.barcode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default Table;
