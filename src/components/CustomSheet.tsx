import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface ISheet {
  isOpen: boolean;
  handleSheetToggle: () => void;
  title: string;
  description?: string;
  handleSubmit: any;
  children: any;
}

const CustomSheet = ({
  title,
  description,
  isOpen,
  handleSheetToggle,
  children,
  handleSubmit,
}: ISheet) => {
  return (
    <Sheet open={isOpen} onOpenChange={handleSheetToggle}>
      <SheetContent className="bg-gray-50">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          <Button type="submit" className="bg-[#173468] text-white" onClick={handleSubmit}>
            Update
          </Button>
          <SheetClose asChild>
            <Button variant="outline" onClick={handleSheetToggle}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
