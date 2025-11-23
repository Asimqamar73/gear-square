import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const AlertBoxPDF = ({
  open,
  setOpen,
  continueProcessHandler,
  text,
  subtext,
  pdfAction,
  setPdfAction,
}: {
  open: any;
  setOpen: any;
  continueProcessHandler: any;
  text: string;
  subtext: string;
  pdfAction: any;
  setPdfAction: any;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>{text}</AlertDialogTitle>
          <AlertDialogDescription>{subtext}</AlertDialogDescription>

          <div className="flex items-center gap-2 mt-3">
            <p className="text-sm">Add TRN</p>
            <input
              type="checkbox"
              className="size-3 cursor-pointer"
              checked={pdfAction.addTRN}
              onChange={(e) =>
                setPdfAction((prev: any) => ({
                  ...prev,
                  addTRN: e.target.checked,
                }))
              }
            />
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setPdfAction({ name: "", addTRN: false });
            }}
            className="cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={continueProcessHandler}
            className="bg-[#173468] text-white cursor-pointer"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBoxPDF;
