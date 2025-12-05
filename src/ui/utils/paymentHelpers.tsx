export const paymentStatuses = {
  0: { label: "Unpaid", color: "bg-red-100 text-red-700 border-red-200" },
  1: { label: "Partial", color: "bg-amber-100 text-amber-700 border-amber-200" },
  2: { label: "Paid", color: "bg-green-100 text-green-700 border-green-200" },
  3: { label: "Overpaid", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
} as any;
export const getStatusDot = (status: 0 | 1 | 2 | 3) => {
  const colors = {
    0: "bg-red-500",
    1: "bg-amber-500",
    2: "bg-green-500",
    3: "bg-emerald-500",
  } as any;
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status]} mr-2`}></span>;
};
