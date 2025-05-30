import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const ServiceItemTable = ({ data }: any) => {
  return (
    <T>
      <TableCaption>List of invoice items</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead className="w-[100px]">Sr#</TableHead>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Base price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((datum: any, idx: number) => (
          <TableRow>
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell className="font-medium"><img src={`file://${datum.image}`} className="w-16 h-16 rounded-lg" alt="item image" /></TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.base_price}</TableCell>
            <TableCell>{datum.quantity}</TableCell>
            <TableCell>{datum.subtotal}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default ServiceItemTable;
