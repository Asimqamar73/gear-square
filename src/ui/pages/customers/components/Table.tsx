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
import { Button } from "../../../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip";

const Table = ({ data }: any) => {
  const navigate = useNavigate();
  return (
    <T>
      <TableCaption>List of all customers.</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Image</TableHead> */}
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{datum.name}</TableCell>
            <TableCell>{datum.phone_number}</TableCell>
            <TableCell>{datum.email}</TableCell>
            <TableCell>{datum.address}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="bg-gray-200"
                      size={"icon"}
                      onClick={() => navigate(`/customer-details/${datum.id}`)}
                    >
                      <Eye />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-300">
                    <p>View details</p>
                  </TooltipContent>
                </Tooltip>
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"outline"} className="bg-gray-200" size={"icon"}>
                      <View />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent  className="bg-gray-300">
                    <p>History</p>
                  </TooltipContent>
                </Tooltip> */}
                
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

export default Table;
