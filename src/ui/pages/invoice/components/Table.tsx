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

const Table = ({ data }: any) => {
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

          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum: any, idx: number) => (
          <TableRow>
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.phone_number}</TableCell>
            <TableCell>{datum.vehicle_number}</TableCell>
            <TableCell>{datum.note}</TableCell>
            <TableCell>{dateFormatter(datum.created_at)}</TableCell>
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
