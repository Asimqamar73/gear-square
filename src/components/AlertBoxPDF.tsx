// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "./ui/alert-dialog";

// const AlertBoxPDF = ({
//   open,
//   setOpen,
//   continueProcessHandler,
//   text,
//   subtext,
//   pdfAction,
//   setPdfAction,
// }: {
//   open: any;
//   setOpen: any;
//   continueProcessHandler: any;
//   text: string;
//   subtext: string;
//   pdfAction: any;
//   setPdfAction: any;
// }) => {
//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogContent className="bg-gray-200">
//         <AlertDialogHeader>
//           <AlertDialogTitle>{text}</AlertDialogTitle>
//           <AlertDialogDescription>{subtext}</AlertDialogDescription>

//           <div className="flex items-center gap-2 mt-3">
//             <p className="text-sm">Add TRN</p>
//             <input
//               type="checkbox"
//               className="size-3 cursor-pointer"
//               checked={pdfAction.addTRN}
//               onChange={(e) =>
//                 setPdfAction((prev: any) => ({
//                   ...prev,
//                   addTRN: e.target.checked,
//                 }))
//               }
//             />
//           </div>
//             <div className="flex items-center gap-2 mt-3">
//             <p className="text-sm">Add Payment details (Paid and due amount)</p>
//             <input
//               type="checkbox"
//               className="size-3 cursor-pointer"
//               checked={pdfAction.addPaymentDetails}
//               onChange={(e) =>
//                 setPdfAction((prev: any) => ({
//                   ...prev,
//                   addPaymentDetails: e.target.checked,
//                 }))
//               }
//             />
//           </div>
//         </AlertDialogHeader>

//         <AlertDialogFooter>
//           <AlertDialogCancel
//             onClick={() => {
//               setPdfAction({ name: "", addTRN: false,addPaymentDetails:false });
//             }}
//             className="cursor-pointer"
//           >
//             Cancel
//           </AlertDialogCancel>

//           <AlertDialogAction
//             onClick={continueProcessHandler}
//             className="bg-[#173468] text-white cursor-pointer"
//           >
//             Continue
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default AlertBoxPDF;






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
}:any) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-800">
            {text}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm text-gray-600">
            {subtext}
          </AlertDialogDescription>

          {/* TRN Option */}
          <div className="flex items-center gap-3 mt-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              className="size-4 cursor-pointer"
              checked={pdfAction.addTRN}
              onChange={(e) =>
                setPdfAction((prev:any) => ({
                  ...prev,
                  addTRN: e.target.checked,
                }))
              }
            />
            <p className="text-sm font-medium text-gray-700">
              Include TRN on the invoice
            </p>
          </div>

          {/* Payment Details Option */}
          <div className="flex items-center gap-3 mt-3 bg-gray-100 p-3 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              className="size-4 cursor-pointer"
              checked={pdfAction.addPaymentDetails}
              onChange={(e) =>
                setPdfAction((prev:any) => ({
                  ...prev,
                  addPaymentDetails: e.target.checked,
                }))
              }
            />
            <p className="text-sm font-medium text-gray-700">
              Add payment details (Paid & Due amount)
            </p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex justify-end gap-3">
          <AlertDialogCancel
            onClick={() => {
              setPdfAction({ name: "", addTRN: false, addPaymentDetails: false });
            }}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={continueProcessHandler}
            className="cursor-pointer px-4 py-2 rounded-lg bg-[#173468] text-white hover:bg-[#1e447f] transition"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBoxPDF;