import { Edit2, Eye } from "lucide-react";
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
import { Button } from "../../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip";
import { dateFormatter } from "../../../utils/DateFormatter";
import { Badge } from "../../../../components/ui/badge";

const CustomerServicesTable = ({ data }: any) => {
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
    3: {
      value: "Overpaid",
      color: "bg-green-400",
    },
  };
  const navigate = useNavigate();
  return (
    <T>
      <TableCaption>
        {data?.length
          ? `List of all recent services. Total services (${data?.length}).`
          : "No service done yet."}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead>Invoice number</TableHead>
          <TableHead className="text-left">Vehicle number</TableHead>
          <TableHead className="">Make</TableHead>
          <TableHead className="">Model</TableHead>
          <TableHead className="">Year</TableHead>
          <TableHead className="">Service note</TableHead>
          <TableHead className="">Payment status</TableHead>
          <TableHead className="">Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((datum: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{datum.id}</TableCell>
            <TableCell className="text-left">{datum.vehicle_number}</TableCell>
            <TableCell className="">{datum.make}</TableCell>
            <TableCell>{datum.model}</TableCell>
            <TableCell>{datum.year}</TableCell>
            <TableCell>{datum.note}</TableCell>
            {/* <TableCell >
              {" "}
              <span className={`${paymentStatuses[datum.bill_status].color} px-3 py-1.5 rounded-xl text-gray-700`}>{paymentStatuses[datum.bill_status].value}</span>
            </TableCell> */}
            <TableCell>
              <Badge
                variant={"outline"}
                className={`${paymentStatuses[datum.bill_status].color} border-gray-400`}
              >
                {paymentStatuses[datum.bill_status].value}
              </Badge>
            </TableCell>
            <TableCell>{dateFormatter(datum.created_at)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="bg-gray-200"
                      size={"icon"}
                      onClick={() => navigate(`/invoice/${datum.id}`)}
                    >
                      <Eye />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-300">
                    <p>View details</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="bg-gray-200"
                      size={"icon"}
                      onClick={() => navigate(`/edit-invoice/${datum.id}`)}
                    >
                      <Edit2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-300">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {/* <div className="cursor-pointer" onClick={() => navigate(`/invoice/${datum.id}`)}>
                <Eye className="text-gray-600" />
              </div> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default CustomerServicesTable;
