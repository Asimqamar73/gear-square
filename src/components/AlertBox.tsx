import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const AlertBox = ({
  open,
  setOpen,
  handleInvoiceGeneration,
}: {
  open: any;
  setOpen: any;
  handleInvoiceGeneration: any;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to generate invoice?</AlertDialogTitle>
          <AlertDialogDescription>Invoice will be stored in the database.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleInvoiceGeneration} className="bg-[#173468] text-white cursor-pointer">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBox;
