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
  console.log(data)
  return (
    <T>
      <TableCaption>List of invoice items</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead>Sr#</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Unit price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((datum: any, idx: number) => (
          <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell><img src={`file://${datum.image}`} className="w-16 h-16 rounded-lg" alt="item image" /></TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.retail_price}</TableCell>
            <TableCell>{datum.quantity}</TableCell>
            <TableCell>{datum.subtotal}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default ServiceItemTable;
