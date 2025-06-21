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
  continueProcessHandler,
  text,
  subtext
}: {
  open: any;
  setOpen: any;
  continueProcessHandler: any;
  text:string,
  subtext:string
  
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>{text}</AlertDialogTitle>
          <AlertDialogDescription>{subtext}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={continueProcessHandler} className="bg-[#173468] text-white cursor-pointer">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBox;
