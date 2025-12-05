import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Car, Hash, Calendar, Save } from "lucide-react";

interface VehicleData {
  id?: number;
  make: string;
  model: string;
  year: string;
  vehicle_number: string;
  chassis_number: string;
}

interface CustomDialogBoxProps {
  open: boolean;
  setOpen: (open: boolean | ((prev: { open: boolean; id?: number; action?: string }) => { open: boolean; id?: number; action?: string })) => void;
  handleSubmit: () => void;
  data: VehicleData;
  onMutateData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action: "add" | "edit";
}

export function CustomDialogBox({
  open,
  setOpen,
  handleSubmit,
  data,
  onMutateData,
  action,
}: CustomDialogBoxProps) {
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const isAddMode = action === "add";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {isAddMode ? "Add New Vehicle" : "Edit Vehicle"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {isAddMode ? "Enter vehicle details to add to the system" : "Update the vehicle information below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Make & Model Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="make" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-gray-400" />
                  Make
                </label>
                <Input
                  id="make"
                  name="make"
                  placeholder="e.g., Toyota"
                  value={data.make}
                  onChange={onMutateData}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium text-gray-700">
                  Model
                </label>
                <Input
                  id="model"
                  name="model"
                  placeholder="e.g., Camry"
                  value={data.model}
                  onChange={onMutateData}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Year
              </label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="e.g., 2024"
                value={data.year}
                onChange={onMutateData}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                min="1900"
                max="2099"
              />
            </div>

            {/* Vehicle Number */}
            <div className="space-y-2">
              <label htmlFor="vehicle_number" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-gray-400" />
                Vehicle Number
              </label>
              <Input
                id="vehicle_number"
                name="vehicle_number"
                placeholder="e.g., ABC-1234"
                value={data.vehicle_number}
                onChange={onMutateData}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* Chassis Number */}
            <div className="space-y-2">
              <label htmlFor="chassis_number" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-gray-400" />
                Chassis Number
              </label>
              <Input
                id="chassis_number"
                name="chassis_number"
                placeholder="e.g., 1HGBH41JXMN109186"
                value={data.chassis_number}
                onChange={onMutateData}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <DialogClose asChild>
              <Button 
                type="button"
                variant="outline" 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {isAddMode ? "Add Vehicle" : "Update Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}