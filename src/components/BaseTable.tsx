import { Table as T, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";

interface Column<T> {
  label: string;
  accessor?: keyof T;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

interface Action<T> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (row: T) => void;
  variant?: "outline" | "default";
  colorClass?: string;
}

interface BaseTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  caption?: string;
  emptyMessage?: string;
}
// const paymentStatuses: any = {
//   0: { value: "Unpaid", color: "bg-red-200 text-red-800" },
//   1: { value: "Partial", color: "bg-amber-200 text-amber-800" },
//   2: { value: "Paid", color: "bg-green-200 text-green-800" },
//   3: { value: "Overpaid", color: "bg-green-400 text-white" },
// };

export function BaseTable<T>({ data, columns, actions, caption, emptyMessage }: BaseTableProps<T>) {
//   const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-2xl border border-gray-200 overflow-x-auto">
      <T className="min-w-full">
        {caption && (
          <TableCaption className="text-gray-500 text-sm p-3">
            {data?.length ? `${caption} (${data.length})` : emptyMessage || "No data available."}
          </TableCaption>
        )}

        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-700">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={`font-medium ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                } ${col.width || ""}`}
              >
                {col.label}
              </TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="text-center w-[120px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((row, rowIdx) => (
            <TableRow
              key={rowIdx}
              className={`transition hover:bg-gray-50 ${
                rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {columns.map((col, colIdx) => (
                <TableCell
                  key={colIdx}
                  className={`${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } font-medium`}
                >
                  {col.render
                    ? col.render(row)
                    : col.accessor
                    ? (row[col.accessor] as React.ReactNode) ?? "-"
                    : "-"}
                </TableCell>
              ))}

              {actions && actions.length > 0 && (
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {actions.map((action, aIdx) => (
                      <Tooltip key={aIdx}>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant={action.variant || "outline"}
                            className={`${
                              action.colorClass || "bg-gray-200 hover:bg-gray-100"
                            }`}
                            onClick={() => action.onClick(row)}
                          >
                            {action.icon}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-300">
                          <p>{action.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </T>
    </div>
  );
}
