import { Eye } from "lucide-react";
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
import { dateFormatter } from "../../../utils/DateFormatter";
import { Badge } from "../../../../components/ui/badge";

const Table = ({ data }: any) => {
  const paymentStatuses: any = {
    0: {
      value: "Unpaid",
      color: "bg-red-200",
    },
    1: {
      value: "Partial",
      color: "bg-amber-200",
    },
    2: {
      value: "Paid",
      color: "bg-green-200",
    },
  };
  const navigate = useNavigate();
  return (
    <T>
      <TableCaption>List of all recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead className="w-[100px]">Invoice no#</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Phone</TableHead>
          <TableHead>Vehicle no#</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Payment status</TableHead>

          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.phone_number}</TableCell>
            <TableCell>{datum.vehicle_number}</TableCell>
            <TableCell>{datum.note}</TableCell>
            <TableCell>{dateFormatter(datum.created_at)}</TableCell>
            <TableCell>
              <Badge variant={"outline"} className={`${paymentStatuses[datum.bill_status].color} border-gray-400`}>{paymentStatuses[datum.bill_status].value}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="cursor-pointer" onClick={() => navigate(`/invoice/${datum.id}`)}>
                <Eye className="text-gray-600" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default Table;
