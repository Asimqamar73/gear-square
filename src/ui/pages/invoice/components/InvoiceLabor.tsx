import { Button } from "../../../../components/ui/button";
import { Trash, Plus } from "lucide-react";

interface LabourCharge {
  labour_type: string;
  description: string;
  amount: string;
}

interface LabourChargesProps {
  labourItems: LabourCharge[];
  setLabourItems: any;
  setTotalLaborCost: any;
  deleteLaborItem:any
}

const LabourCharges = ({ labourItems, setLabourItems, setTotalLaborCost,deleteLaborItem }: LabourChargesProps) => {
  const addNewLabour = () => {
    setLabourItems([...labourItems, { labour_type: "", description: "", amount: "" }]);
  };

  const handleChange = (idx: number, field: keyof LabourCharge, value: string) => {
    const updated = [...labourItems];
    updated[idx][field] = value;
    setLabourItems(updated);
  };

  // const deleteLabour = (idx: number) => {
  //   setLabourItems(labourItems.filter((_, i) => i !== idx));
  // };

  const totalLabourAmount = labourItems.reduce(
    (acc, item) => acc + (parseFloat(item.amount) || 0),
    0
  );
  setTotalLaborCost(totalLabourAmount);

  return (
    <div className="p-6 bg-white rounded-2xl flex flex-col gap-6 border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Labour Charges</h2>

      {labourItems.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 md:flex-row md:items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            {/* Labour Type */}
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Labour Type</label>
              <input
                type="text"
                value={item.labour_type}
                onChange={(e) => handleChange(idx, "labour_type", e.target.value)}
                className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
                placeholder="Enter labour type"
                required
              />
            </div>
            {/* Amount */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Amount (AED)</label>
              <input
                type="number"
                min="0"
                value={item.amount}
                onChange={(e) => handleChange(idx, "amount", e.target.value)}
                className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2 flex gap-2 h-full">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Details</label>
              <textarea
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
                placeholder="Optional details..."
                rows={4}
              />
            </div>
            {/* Delete Button */}
            {labourItems.length > 1 && (
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="bg-red-400 text-white h-11 w-11"
                  onClick={() => deleteLaborItem(idx)}
                >
                  <Trash />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      <Button
        variant="outline"
        className="w-fit items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium shadow-sm hover:shadow-md"
        onClick={addNewLabour}
      >
        <Plus className="w-4 h-4" />
        Add Labour Charge
      </Button>

      {/* Total Amount */}
      <div className="text-right font-semibold text-gray-800">
        Total Labor cost: AED {totalLabourAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default LabourCharges;
