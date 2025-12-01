// import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // ===========================
// // Font Registration
// // ===========================
// Font.register({
//   family: "Oswald",
//   src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
// });

// Font.register({
//   family: "Noto",
//   fonts: [
//     {
//       src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

// // ===========================
// // Constants
// // ===========================
// const VAT = 0.05;

// // ===========================
// // Styles
// // ===========================
// const styles = StyleSheet.create({
//   page: { flexDirection: "row" },
//   section: { margin: 20, padding: 20, flexGrow: 1 },
//   heading: { fontSize: 20, fontWeight: 700, textAlign: "center" },
//   contactBar: { backgroundColor: "#3f5277", fontSize: 10, textAlign: "center", color: "white", padding: 4, marginTop: 5 },
//   smallText: { fontSize: 8 },
//   boldSmallText: { fontSize: 8, fontWeight: 700 },
//   table: { width: "100%", borderWidth: 1, borderColor: "gray", marginVertical: 8 },
//   tableRow: { flexDirection: "row" },
//   tableCol: { borderLeftWidth: 0, borderTopWidth: 0, borderStyle: "solid", padding: 4 },
//   tableHeader: { backgroundColor: "#D4D4D4" },
//   summaryRow: { flexDirection: "row", justifyContent: "flex-end" },
//   summaryCol: {
//     width: "30%",
//     borderWidth: 0.5,
//     borderColor: "gray",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 8,
//     padding: 4,
//   },
// });

// // ===========================
// // Reusable Components
// // ===========================
// const SummaryRow = ({ label, value }: { label: string; value: string | number }) => (
//   <View style={styles.summaryRow}>
//     <View style={styles.summaryCol}>
//       <Text style={styles.boldSmallText}>{label}</Text>
//       <Text style={styles.boldSmallText}>{value}</Text>
//     </View>
//   </View>
// );

// const TableHeader = () => (
//   <View style={[styles.tableRow, styles.tableHeader]}>
//     {["Item #", "Description", "Qty", "Amount", "With VAT (5%)"].map((text, idx) => (
//       <View
//         key={idx}
//         style={[styles.tableCol, { width: idx === 1 ? "40%" : "15%" }]}
//       >
//         <Text style={styles.smallText}>{text}</Text>
//       </View>
//     ))}
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vatAmount = item.subtotal * VAT;
//   return (
//     <View style={styles.tableRow}>
//       <View style={[styles.tableCol, { width: "15%" }]}>
//         <Text style={styles.smallText}>{index + 1}</Text>
//       </View>
//       <View style={[styles.tableCol, { width: "40%" }]}>
//         <Text style={styles.smallText}>{item.name}</Text>
//       </View>
//       <View style={[styles.tableCol, { width: "15%" }]}>
//         <Text style={styles.smallText}>{item.quantity}</Text>
//       </View>
//       <View style={[styles.tableCol, { width: "15%" }]}>
//         <Text style={styles.smallText}>{item.subtotal.toFixed(2)}</Text>
//       </View>
//       <View style={[styles.tableCol, { width: "15%" }]}>
//         <Text style={styles.smallText}>{(item.subtotal + vatAmount).toFixed(2)}</Text>
//       </View>
//     </View>
//   );
// };

// // ===========================
// // Main Document
// // ===========================
// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         {/* Titles */}
//         <Text style={{ fontFamily: "Noto", textAlign: "center", fontWeight: 700 }}>
//           ورشه جسر الحياه لحيانه السارات
//         </Text>
//         <Text style={styles.heading}>JESR AL HAYAH MAIN W. SHOP</Text>

//         {/* Contact */}
//         <Text style={styles.contactBar}>
//           Mob: +971558757029, +971503315047 — Email: jesralhayah2024@gmail.com
//         </Text>

//         {/* Invoice Info */}
//         <Text style={{ ...styles.smallText, fontWeight: 600, textAlign: "center", marginVertical: 2 }}>
//           Invoice
//         </Text>
//         <Text style={{ ...styles.smallText, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
//           TRN: 104712178300003
//         </Text>

//         {/* Vehicle Info */}
//         <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 8, marginTop: 4 }}>
//           <Text>Vehicle: {details.service.vehicle_number}</Text>
//           <Text>Chassis: {details.service.chassis_number}</Text>
//           <Text>Make: {details.service.make}</Text>
//           <Text>Model: {details.service.model}</Text>
//           <Text>Date: {dateFormatter(details.service.created_at)}</Text>
//         </View>

//         {/* Customer Info */}
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, fontSize: 8 }}>
//           <Text>Mr./Mrs./Miss: <Text style={{ fontWeight: 700 }}>{details.service.name}</Text></Text>
//           <Text>Invoice no: <Text style={{ fontWeight: 700 }}>{details.service.id}</Text></Text>
//         </View>
//         <Text style={{ fontSize: 8, marginTop: 4 }}>Phone number: <Text style={{ fontWeight: 700 }}>{details.service.phone_number}</Text></Text>
//         {isTrnInclude && (
//           <Text style={{ fontSize: 8, marginTop: 4 }}>TRN: <Text style={{ fontWeight: 700 }}>{details.service.trn || "N/A"}</Text></Text>
//         )}

//         {/* Items Table */}
//         <View style={styles.table}>
//           <TableHeader />
//           {details.serviceItems.map((item: any, index: number) => (
//             <TableRow key={index} item={item} index={index} />
//           ))}
//         </View>

//         {/* Summary */}
//         <SummaryRow label="Subtotal" value={details.serviceBill.subtotal} />
//         <SummaryRow label="With VAT (5%)" value={details.serviceBill.vat_amount} />
//         <SummaryRow label="Discount" value={`${details.serviceBill.discount}%`} />
//         <SummaryRow label="Total" value={details.serviceBill.total} />

//         {/* Payment Method */}
//         <View style={{ fontSize: 10, marginVertical: 8 }}>
//           <Text style={{ marginBottom: 4 }}>Payment method</Text>
//           <View style={{ flexDirection: "row", gap: 8 }}>
//             {["Cash", "Card"].map((method, idx) => (
//               <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
//                 <Text>{method}</Text>
//                 <View style={{ width: 16, height: 12, borderWidth: 0.5 }} />
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Signatures */}
//         <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 8, marginTop: 32 }}>
//           <View>
//             <View style={{ borderBottomWidth: 1, marginBottom: 4 }} />
//             <Text>Receiver's sign</Text>
//           </View>
//           <View>
//             <View style={{ borderBottomWidth: 1, marginBottom: 4 }} />
//             <Text>JESRAL HAYAH MAIN W.SHOP</Text>
//           </View>
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// export default MyDocument;

// import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // Fonts
// Font.register({ family: "Oswald", src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf" });
// Font.register({
//   family: "Noto",
//   fonts: [{
//     src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
//     fontWeight: 700
//   }]
// });

// const VAT = 0.05;

// const styles = StyleSheet.create({
//   page: { padding: 20, fontSize: 10, fontFamily: "Oswald" },
//   header: { backgroundColor: "#173468", color: "white", padding: 10, textAlign: "center", fontSize: 18, fontWeight: 700 },
//   arabicHeader: { fontFamily: "Noto", textAlign: "center", fontSize: 16, marginBottom: 4 },
//   contactBar: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f2f2f2", padding: 6, marginVertical: 8 },
//   section: { marginVertical: 8 },
//   sectionRow: { flexDirection: "row", justifyContent: "space-between" },
//   table: { width: "100%", borderWidth: 1, borderColor: "#ccc", marginTop: 8 },
//   tableRow: { flexDirection: "row" },
//   tableHeader: { backgroundColor: "#f2f2f2" },
//   tableCell: { padding: 4, fontSize: 8 },
//   tableCol: (width: string) => ({ width, borderRightWidth: 1, borderRightColor: "#ccc" }),
//   stripe: { backgroundColor: "#fafafa" },
//   summaryBox: { marginTop: 12, padding: 8, borderWidth: 1, borderColor: "#ccc", width: "40%", alignSelf: "flex-end" },
//   summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
//   paymentBox: { flexDirection: "row", gap: 12, marginTop: 12 },
//   paymentItem: { flexDirection: "row", alignItems: "center", gap: 4 },
//   signatureBox: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
//   signatureLine: { borderBottomWidth: 1, width: 120, marginBottom: 4 }
// });

// const TableHeader = () => (
//   <View style={[styles.tableRow, styles.tableHeader]}>
//     {["#", "Description", "Qty", "Amount", "With VAT"].map((text, idx) => (
//       <View key={idx} style={styles.tableCol(idx === 1 ? "40%" : "15%")}>
//         <Text style={styles.tableCell}>{text}</Text>
//       </View>
//     ))}
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vatAmount = item.subtotal * VAT;
//   return (
//     <View style={[styles.tableRow, index % 2 === 0 && styles.stripe]}>
//       <View style={styles.tableCol("15%")}><Text style={styles.tableCell}>{index + 1}</Text></View>
//       <View style={styles.tableCol("40%")}><Text style={styles.tableCell}>{item.name}</Text></View>
//       <View style={styles.tableCol("15%")}><Text style={styles.tableCell}>{item.quantity}</Text></View>
//       <View style={styles.tableCol("15%")}><Text style={styles.tableCell}>{item.subtotal.toFixed(2)}</Text></View>
//       <View style={styles.tableCol("15%")}><Text style={styles.tableCell}>{(item.subtotal + vatAmount).toFixed(2)}</Text></View>
//     </View>
//   );
// };

// const SummaryRow = ({ label, value }: { label: string; value: string | number }) => (
//   <View style={styles.summaryRow}>
//     <Text>{label}</Text>
//     <Text>{value}</Text>
//   </View>
// );

// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.header}>JESR AL HAYAH MAIN W. SHOP</Text>
//       <Text style={styles.arabicHeader}>ورشه جسر الحياه لحيانه السارات</Text>

//       <View style={styles.contactBar}>
//         <Text>Mob: +971558757029, +971503315047</Text>
//         <Text>Email: jesralhayah2024@gmail.com</Text>
//         <Text>TRN: 104712178300003</Text>
//       </View>

//       <View style={styles.sectionRow}>
//         <View>
//           <Text>Vehicle: {details.service.vehicle_number}</Text>
//           <Text>Chassis: {details.service.chassis_number}</Text>
//           <Text>Make: {details.service.make}</Text>
//           <Text>Model: {details.service.model}</Text>
//           <Text>Date: {dateFormatter(details.service.created_at)}</Text>
//         </View>
//         <View>
//           <Text>Customer: {details.service.name}</Text>
//           <Text>Invoice no: {details.service.id}</Text>
//           <Text>Phone: {details.service.phone_number}</Text>
//           {isTrnInclude && <Text>TRN: {details.service.trn || "N/A"}</Text>}
//         </View>
//       </View>

//       {/* Item Table */}
//       <View style={styles.table}>
//         <TableHeader />
//         {details.serviceItems.map((item: any, index: number) => (
//           <TableRow key={index} item={item} index={index} />
//         ))}
//       </View>

//       {/* Summary */}
//       <View style={styles.summaryBox}>
//         <SummaryRow label="Subtotal" value={details.serviceBill.subtotal} />
//         <SummaryRow label="VAT (5%)" value={details.serviceBill.vat_amount} />
//         <SummaryRow label="Discount" value={`${details.serviceBill.discount}%`} />
//         <SummaryRow label="Total" value={details.serviceBill.total} />
//       </View>

//       {/* Payment Method */}
//       <View style={styles.paymentBox}>
//         {["Cash", "Card"].map((method, idx) => (
//           <View key={idx} style={styles.paymentItem}>
//             <Text>{method}</Text>
//             <View style={{ width: 16, height: 12, borderWidth: 0.5 }} />
//           </View>
//         ))}
//       </View>

//       {/* Signatures */}
//       <View style={styles.signatureBox}>
//         <View>
//           <View style={styles.signatureLine} />
//           <Text>Receiver's sign</Text>
//         </View>
//         <View>
//           <View style={styles.signatureLine} />
//           <Text>JESRAL HAYAH MAIN W.SHOP</Text>
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// export default MyDocument;

import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { dateFormatter } from "../ui/utils/DateFormatter";

// ===========================
// Font Registration
// ===========================
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
Font.register({
  family: "Montserrat",
  src: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
});
Font.register({
  family: "Noto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
      fontWeight: 700,
    },
  ],
});

const VAT = 0.05;

// ===========================
// Styles
// ===========================
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: "Oswald" },
  header: {
    backgroundColor: "#2d2d2d",
    color: "white",
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 700,
  },
  arabicHeader: { fontFamily: "Noto", textAlign: "center", fontSize: 16, marginBottom: 4 },
  contactBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e2e2e2",
    padding: 6,
    marginVertical: 8,
    fontSize: 8,
  },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  table: { width: "100%", borderWidth: 1, borderColor: "#ccc", marginTop: 8 },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#f2f2f2" },
  tableCell: {
    padding: 4,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  stripe: { backgroundColor: "#eaeaea" },
  summaryBox: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "40%",
    alignSelf: "flex-end",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
  paymentBox: { flexDirection: "row", gap: 12, marginTop: 12 },
  paymentItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  signatureBox: { flexDirection: "row", justifyContent: "space-between", marginTop: 32 },
  signatureLine: { borderBottomWidth: 1, width: 120, marginBottom: 4 },
});

// ===========================
// Reusable Components
// ===========================
const TableHeader = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    {["#", "Description", "Qty", "Amount", "With VAT"].map((text, idx) => (
      <View
        key={idx}
        style={[
          styles.tableCell,
          { width: idx === 1 ? "40%" : "15%", borderRightWidth: idx === 4 ? 0 : 1 },
        ]}
      >
        <Text>{text}</Text>
      </View>
    ))}
  </View>
);

const TableRow = ({ item, index }: { item: any; index: number }) => {
  const vatAmount = item.subtotal * VAT;
  return (
    <View style={[styles.tableRow, ...(index % 2 === 0 ? [styles.stripe] : [])]}>
      <View style={[styles.tableCell, { width: "15%" }]}>
        <Text>{index + 1}</Text>
      </View>
      <View style={[styles.tableCell, { width: "40%" }]}>
        <Text>{item.name}</Text>
      </View>
      <View style={[styles.tableCell, { width: "15%" }]}>
        <Text>{item.quantity}</Text>
      </View>
      <View style={[styles.tableCell, { width: "15%" }]}>
        <Text>{item.subtotal.toFixed(2)}</Text>
      </View>
      <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}>
        <Text>{(item.subtotal + vatAmount).toFixed(2)}</Text>
      </View>
    </View>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.summaryRow}>
    <Text>{label}</Text>
    <Text>{value}</Text>
  </View>
);

// ===========================
// Main Document
// ===========================
const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>JESR AL HAYAH MAIN W. SHOP</Text>
      <Text style={styles.arabicHeader}>ورشه جسر الحياه لحيانه السارات</Text>

      {/* Contact Info */}
      <View style={styles.contactBar}>
        <Text>Mob: +971558757029, +971503315047</Text>
        <Text style={{fontWeight:700 }}>TRN: 104712178300003</Text>
        <Text>Email: jesralhayah2024@gmail.com</Text>
      </View>
      <View >
        <Text style={{fontWeight:700, fontSize:14,textAlign:"center"}}>Invoice</Text>
      </View>

      {/* Vehicle & Customer Info */}
      <View style={styles.sectionRow}>
        <View>
          <Text>Customer: {details.service.name}</Text>
          <Text>Phone: {details.service.phone_number}</Text>
          <Text>Vehicle: {details.service.vehicle_number}</Text>
          <Text>Chassis: {details.service.chassis_number}</Text>
          <Text>Make & Model: {details.service.make} • {details.service.model}</Text>
          <Text></Text>
        </View>
        <View>
          <Text style={{ fontSize: 14,fontWeight:700 }}>Invoice no: {details.service.id}</Text>
          <Text>Date: {dateFormatter(details.service.created_at)}</Text>
          {isTrnInclude && <Text>TRN: {details.service.trn || "N/A"}</Text>}
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <TableHeader />
        {details.serviceItems.map((item: any, index: number) => (
          <TableRow key={index} item={item} index={index} />
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <SummaryRow label="Labor cost" value={details.service.labor_cost} />
        <SummaryRow label="Subtotal" value={details.serviceBill.subtotal} />
        <SummaryRow label="VAT (5%)" value={details.serviceBill.vat_amount} />
        <SummaryRow label="Discount" value={`${details.serviceBill.discount}%`} />
        <SummaryRow label="Total" value={details.serviceBill.total} />
      </View>

      {/* Payment Method */}
      <View style={styles.paymentBox}>
        {["Cash", "Card"].map((method, idx) => (
          <View key={idx} style={styles.paymentItem}>
            <Text>{method}</Text>
            <View style={{ width: 16, height: 12, borderWidth: 0.5 }} />
          </View>
        ))}
      </View>

      {/* Signatures */}
      <View style={styles.signatureBox}>
        <View>
          <View style={styles.signatureLine} />
          <Text>Receiver's sign</Text>
        </View>
        <View>
          <View style={styles.signatureLine} />
          <Text>JESRAL HAYAH MAIN W.SHOP</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;

// import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // Font Registration
// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
//       fontWeight: 300,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
//       fontWeight: 400,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
//       fontWeight: 500,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

// Font.register({
//   family: "NotoArabic",
//   src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
//   fontWeight: 600,
// });

// const VAT_RATE = 0.05;

// // Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 10,
//     fontFamily: "Roboto",
//     fontWeight: 400,
//     color: "#1a1a1a",
//   },

//   // Header Section
//   header: {
//     marginBottom: 30,
//     borderBottom: 2,
//     borderBottomColor: "#2d2d2d",
//     paddingBottom: 20,
//   },
//   companyName: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 4,
//     letterSpacing: 0.5,
//   },
//   arabicName: {
//     fontFamily: "NotoArabic",
//     fontSize: 16,
//     color: "#4a4a4a",
//     marginBottom: 12,
//   },
//   contactRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
//   contactText: {
//     fontSize: 9,
//     color: "#666666",
//     marginBottom: 2,
//   },

//   // Invoice Info Section
//   invoiceHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//   },
//   invoiceTitle: {
//     fontSize: 28,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 4,
//   },
//   invoiceNumber: {
//     fontSize: 11,
//     color: "#666666",
//   },

//   // Details Section
//   detailsSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//   },
//   detailsBox: {
//     width: "48%",
//     padding: 12,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 4,
//   },
//   detailsTitle: {
//     fontSize: 11,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 8,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   detailLabel: {
//     fontSize: 9,
//     color: "#666666",
//     width: 80,
//   },
//   detailValue: {
//     fontSize: 9,
//     color: "#2d2d2d",
//     fontWeight: 500,
//     flex: 1,
//   },

//   // Table Section
//   table: {
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#2d2d2d",
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//   },
//   tableHeaderText: {
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#ffffff",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
//   tableRowAlt: {
//     backgroundColor: "#fafafa",
//   },
//   tableCell: {
//     fontSize: 9,
//     color: "#2d2d2d",
//   },
//   tableCellBold: {
//     fontWeight: 500,
//   },

//   // Summary Section
//   summarySection: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   summaryBox: {
//     width: "45%",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   summaryLabel: {
//     fontSize: 10,
//     color: "#666666",
//   },
//   summaryValue: {
//     fontSize: 10,
//     color: "#2d2d2d",
//     fontWeight: 500,
//   },
//   summaryTotal: {
//     backgroundColor: "#2d2d2d",
//     marginTop: 8,
//   },
//   summaryTotalLabel: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#ffffff",
//   },
//   summaryTotalValue: {
//     fontSize: 14,
//     fontWeight: 700,
//     color: "#ffffff",
//   },

//   // Payment Section
//   paymentSection: {
//     marginTop: 30,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#e5e5e5",
//   },
//   paymentTitle: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 10,
//     textTransform: "uppercase",
//   },
//   paymentMethods: {
//     flexDirection: "row",
//     gap: 20,
//   },
//   paymentMethod: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   checkbox: {
//     width: 14,
//     height: 14,
//     borderWidth: 1.5,
//     borderColor: "#2d2d2d",
//     borderRadius: 2,
//   },
//   paymentText: {
//     fontSize: 9,
//     color: "#2d2d2d",
//   },

//   // Footer Section
//   footer: {
//     position: "absolute",
//     bottom: 40,
//     left: 40,
//     right: 40,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#e5e5e5",
//   },
//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   signatureBox: {
//     width: "45%",
//   },
//   signatureLine: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#2d2d2d",
//     marginBottom: 6,
//     paddingTop: 30,
//   },
//   signatureLabel: {
//     fontSize: 8,
//     color: "#666666",
//     textAlign: "center",
//   },
//   footerText: {
//     fontSize: 8,
//     color: "#999999",
//     textAlign: "center",
//   },
// });

// // Components
// const TableHeader = () => (
//   <View style={styles.tableHeader}>
//     <Text style={[styles.tableHeaderText, { width: "8%" }]}>#</Text>
//     <Text style={[styles.tableHeaderText, { width: "42%" }]}>Description</Text>
//     <Text style={[styles.tableHeaderText, { width: "12%", textAlign: "right" }]}>Qty</Text>
//     <Text style={[styles.tableHeaderText, { width: "18%", textAlign: "right" }]}>Amount</Text>
//     <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>Total + VAT</Text>
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vatAmount = item.subtotal * VAT_RATE;
//   const totalWithVat = item.subtotal + vatAmount;

//   return (
//     <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
//       <Text style={[styles.tableCell, { width: "8%" }]}>{index + 1}</Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "42%" }]}>
//         {item.name}
//       </Text>
//       <Text style={[styles.tableCell, { width: "12%", textAlign: "right" }]}>
//         {item.quantity}
//       </Text>
//       <Text style={[styles.tableCell, { width: "18%", textAlign: "right" }]}>
//         {item.subtotal.toFixed(2)} AED
//       </Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "20%", textAlign: "right" }]}>
//         {totalWithVat.toFixed(2)} AED
//       </Text>
//     </View>
//   );
// };

// // Main Document
// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => {
//   const currentDate = new Date().toLocaleDateString("en-GB");

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.companyName}>JESR AL HAYAH MAIN W. SHOP</Text>
//           <Text style={styles.arabicName}>ورشه جسر الحياه لحيانه السارات</Text>
//           <View style={styles.contactRow}>
//             <View>
//               <Text style={styles.contactText}>Mobile: +971 558 757 029 | +971 503 315 047</Text>
//               <Text style={styles.contactText}>Email: jesralhayah2024@gmail.com</Text>
//             </View>
//             <View>
//               <Text style={styles.contactText}>TRN: 104712178300003</Text>
//               <Text style={styles.contactText}>Dubai, UAE</Text>
//             </View>
//           </View>
//         </View>

//         {/* Invoice Title & Number */}
//         <View style={styles.invoiceHeader}>
//           <View>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text style={styles.invoiceNumber}>Date: {dateFormatter(details.service.created_at)}</Text>
//           </View>
//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.invoiceNumber}>Invoice Number</Text>
//             <Text style={[styles.invoiceTitle, { fontSize: 20 }]}>#{details.service.id}</Text>
//           </View>
//         </View>

//         {/* Customer & Vehicle Details */}
//         <View style={styles.detailsSection}>
//           {/* Customer Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Bill To</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Customer:</Text>
//               <Text style={styles.detailValue}>{details.service.name}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Phone:</Text>
//               <Text style={styles.detailValue}>{details.service.phone_number}</Text>
//             </View>
//             {details.service.company_name && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Company:</Text>
//                 <Text style={styles.detailValue}>{details.service.company_name}</Text>
//               </View>
//             )}
//             {isTrnInclude && details.service.trn && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>TRN:</Text>
//                 <Text style={styles.detailValue}>{details.service.trn}</Text>
//               </View>
//             )}
//           </View>

//           {/* Vehicle Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Vehicle Details</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Vehicle No:</Text>
//               <Text style={styles.detailValue}>{details.service.vehicle_number}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Chassis No:</Text>
//               <Text style={styles.detailValue}>{details.service.chassis_number}</Text>
//             </View>
//             {details.service.make && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Make/Model:</Text>
//                 <Text style={styles.detailValue}>
//                   {details.service.make} {details.service.model || ""}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.table}>
//           <TableHeader />
//           {details.serviceItems.map((item: any, index: number) => (
//             <TableRow key={index} item={item} index={index} />
//           ))}
//         </View>

//         {/* Summary */}
//         <View style={styles.summarySection}>
//           <View style={styles.summaryBox}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.subtotal.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>VAT (5%)</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.vat_amount.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Discount ({details.serviceBill.discount}%)</Text>
//               <Text style={styles.summaryValue}>
//                 -{((details.serviceBill.subtotal * details.serviceBill.discount) / 100).toFixed(2)} AED
//               </Text>
//             </View>
//             <View style={[styles.summaryRow, styles.summaryTotal]}>
//               <Text style={styles.summaryTotalLabel}>TOTAL</Text>
//               <Text style={styles.summaryTotalValue}>{details.serviceBill.total.toFixed(2)} AED</Text>
//             </View>
//           </View>
//         </View>

//         {/* Payment Method */}
//         <View style={styles.paymentSection}>
//           <Text style={styles.paymentTitle}>Payment Method</Text>
//           <View style={styles.paymentMethods}>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Cash</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Card</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Bank Transfer</Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer with Signatures */}
//         <View style={styles.footer}>
//           <View style={styles.signatureSection}>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Customer Signature</Text>
//             </View>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Authorized Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.footerText}>
//             Thank you for your business | JESR AL HAYAH MAIN W. SHOP
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default MyDocument;

// import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // Font Registration
// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
//       fontWeight: 300,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
//       fontWeight: 400,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
//       fontWeight: 500,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

// Font.register({
//   family: "NotoArabic",
//   src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
//   fontWeight: 600,
// });

// const VAT_RATE = 0.05;

// // Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 9,
//     fontFamily: "Roboto",
//     fontWeight: 400,
//     color: "#1a1a1a",
//   },

//   // Header Section
//   header: {
//     marginBottom: 15,
//     borderBottom: 1.5,
//     borderBottomColor: "#2d2d2d",
//     paddingBottom: 10,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 3,
//   },
//   arabicName: {
//     fontFamily: "NotoArabic",
//     fontSize: 13,
//     color: "#4a4a4a",
//     marginBottom: 8,
//   },
//   contactRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 4,
//   },
//   contactText: {
//     fontSize: 8,
//     color: "#666666",
//     marginBottom: 1,
//   },

//   // Invoice Info Section
//   invoiceHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//     alignItems: "flex-end",
//   },
//   invoiceTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 2,
//   },
//   invoiceNumber: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   invoiceNumberLarge: {
//     fontSize: 16,
//     fontWeight: 700,
//     color: "#2d2d2d",
//   },

//   // Details Section
//   detailsSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   detailsBox: {
//     width: "48%",
//     padding: 8,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 3,
//   },
//   detailsTitle: {
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 5,
//     textTransform: "uppercase",
//     letterSpacing: 0.3,
//   },
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 2,
//   },
//   detailLabel: {
//     fontSize: 8,
//     color: "#666666",
//     width: 65,
//   },
//   detailValue: {
//     fontSize: 8,
//     color: "#2d2d2d",
//     fontWeight: 500,
//     flex: 1,
//   },

//   // Table Section
//   table: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#2d2d2d",
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//   },
//   tableHeaderText: {
//     fontSize: 8,
//     fontWeight: 700,
//     color: "#ffffff",
//     textTransform: "uppercase",
//     letterSpacing: 0.3,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 7,
//     paddingHorizontal: 8,
//   },
//   tableRowAlt: {
//     backgroundColor: "#fafafa",
//   },
//   tableCell: {
//     fontSize: 8,
//     color: "#2d2d2d",
//   },
//   tableCellBold: {
//     fontWeight: 500,
//   },

//   // Summary Section
//   summarySection: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   summaryBox: {
//     width: "40%",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   summaryLabel: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   summaryValue: {
//     fontSize: 9,
//     color: "#2d2d2d",
//     fontWeight: 500,
//   },
//   summaryTotal: {
//     backgroundColor: "#2d2d2d",
//     marginTop: 5,
//   },
//   summaryTotalLabel: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#ffffff",
//   },
//   summaryTotalValue: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#ffffff",
//   },

//   // Payment Section
//   paymentSection: {
//     marginTop: 15,
//     paddingTop: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: "#e5e5e5",
//   },
//   paymentTitle: {
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 6,
//     textTransform: "uppercase",
//   },
//   paymentMethods: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   paymentMethod: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   checkbox: {
//     width: 11,
//     height: 11,
//     borderWidth: 1.2,
//     borderColor: "#2d2d2d",
//     borderRadius: 1.5,
//   },
//   paymentText: {
//     fontSize: 8,
//     color: "#2d2d2d",
//   },

//   // Footer Section
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 30,
//     right: 30,
//     paddingTop: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: "#e5e5e5",
//   },
//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   signatureBox: {
//     width: "45%",
//   },
//   signatureLine: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#2d2d2d",
//     marginBottom: 4,
//     paddingTop: 20,
//   },
//   signatureLabel: {
//     fontSize: 7,
//     color: "#666666",
//     textAlign: "center",
//   },
//   footerText: {
//     fontSize: 7,
//     color: "#999999",
//     textAlign: "center",
//   },
// });

// // Components
// const TableHeader = () => (
//   <View style={styles.tableHeader}>
//     <Text style={[styles.tableHeaderText, { width: "8%" }]}>#</Text>
//     <Text style={[styles.tableHeaderText, { width: "42%" }]}>Description</Text>
//     <Text style={[styles.tableHeaderText, { width: "12%", textAlign: "right" }]}>Qty</Text>
//     <Text style={[styles.tableHeaderText, { width: "18%", textAlign: "right" }]}>Amount</Text>
//     <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>Total + VAT</Text>
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vatAmount = item.subtotal * VAT_RATE;
//   const totalWithVat = item.subtotal + vatAmount;

//   return (
//     <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
//       <Text style={[styles.tableCell, { width: "8%" }]}>{index + 1}</Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "42%" }]}>
//         {item.name}
//       </Text>
//       <Text style={[styles.tableCell, { width: "12%", textAlign: "right" }]}>
//         {item.quantity}
//       </Text>
//       <Text style={[styles.tableCell, { width: "18%", textAlign: "right" }]}>
//         {item.subtotal.toFixed(2)}
//       </Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "20%", textAlign: "right" }]}>
//         {totalWithVat.toFixed(2)}
//       </Text>
//     </View>
//   );
// };

// // Main Document
// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.companyName}>JESR AL HAYAH MAIN W. SHOP</Text>
//           <Text style={styles.arabicName}>ورشه جسر الحياه لحيانه السارات</Text>
//           <View style={styles.contactRow}>
//             <View>
//               <Text style={styles.contactText}>Mobile: +971 558 757 029 | +971 503 315 047</Text>
//               <Text style={styles.contactText}>Email: jesralhayah2024@gmail.com</Text>
//             </View>
//             <View>
//               <Text style={styles.contactText}>TRN: 104712178300003</Text>
//               <Text style={styles.contactText}>Dubai, UAE</Text>
//             </View>
//           </View>
//         </View>

//         {/* Invoice Title & Number */}
//         <View style={styles.invoiceHeader}>
//           <View>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text style={styles.invoiceNumber}>Date: {dateFormatter(details.service.created_at)}</Text>
//           </View>
//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.invoiceNumber}>Invoice No.</Text>
//             <Text style={styles.invoiceNumberLarge}>#{details.service.id}</Text>
//           </View>
//         </View>

//         {/* Customer & Vehicle Details */}
//         <View style={styles.detailsSection}>
//           {/* Customer Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Bill To</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Customer:</Text>
//               <Text style={styles.detailValue}>{details.service.name}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Phone:</Text>
//               <Text style={styles.detailValue}>{details.service.phone_number}</Text>
//             </View>
//             {details.service.company_name && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Company:</Text>
//                 <Text style={styles.detailValue}>{details.service.company_name}</Text>
//               </View>
//             )}
//             {isTrnInclude && details.service.trn && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>TRN:</Text>
//                 <Text style={styles.detailValue}>{details.service.trn}</Text>
//               </View>
//             )}
//           </View>

//           {/* Vehicle Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Vehicle Details</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Vehicle:</Text>
//               <Text style={styles.detailValue}>{details.service.vehicle_number}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Chassis:</Text>
//               <Text style={styles.detailValue}>{details.service.chassis_number}</Text>
//             </View>
//             {details.service.make && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Make/Model:</Text>
//                 <Text style={styles.detailValue}>
//                   {details.service.make} {details.service.model || ""}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.table}>
//           <TableHeader />
//           {details.serviceItems.map((item: any, index: number) => (
//             <TableRow key={index} item={item} index={index} />
//           ))}
//         </View>

//         {/* Summary */}
//         <View style={styles.summarySection}>
//           <View style={styles.summaryBox}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.subtotal.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>VAT (5%)</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.vat_amount.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Discount ({details.serviceBill.discount}%)</Text>
//               <Text style={styles.summaryValue}>
//                 -{((details.serviceBill.subtotal * details.serviceBill.discount) / 100).toFixed(2)} AED
//               </Text>
//             </View>
//             <View style={[styles.summaryRow, styles.summaryTotal]}>
//               <Text style={styles.summaryTotalLabel}>TOTAL</Text>
//               <Text style={styles.summaryTotalValue}>{details.serviceBill.total.toFixed(2)} AED</Text>
//             </View>
//           </View>
//         </View>

//         {/* Payment Method */}
//         <View style={styles.paymentSection}>
//           <Text style={styles.paymentTitle}>Payment Method</Text>
//           <View style={styles.paymentMethods}>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Cash</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Card</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Bank Transfer</Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer with Signatures */}
//         <View style={styles.footer}>
//           <View style={styles.signatureSection}>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Customer Signature</Text>
//             </View>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Authorized Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.footerText}>
//             Thank you for your business | JESR AL HAYAH MAIN W. SHOP
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default MyDocument;

// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // Font Registration (unchanged)
// Font.register({
//   family: "Roboto",
//   fonts: [
//     { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
//     { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
//     { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
//     { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
//   ],
// });

// Font.register({
//   family: "NotoArabic",
//   src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
// });

// const VAT_RATE = 0.05;

// // Modern Minimal Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontFamily: "Roboto",
//     fontSize: 9,
//     color: "#1a1a1a",
//     backgroundColor: "#ffffff",
//   },

//   // Header
//   header: {
//     marginBottom: 30,
//   },
//   companyName: {
//     fontSize: 22,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     letterSpacing: 0.5,
//   },
//   arabicName: {
//     fontFamily: "NotoArabic",
//     fontSize: 16,
//     color: "#2d2d2d",
//     marginTop: 4,
//     marginBottom: 12,
//   },
//   contactInfo: {
//     fontSize: 8.5,
//     color: "#555",
//     lineHeight: 1.5,
//   },

//   // Invoice Title Bar
//   invoiceBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     backgroundColor: "#2d2d2d",
//     borderRadius: 6,
//     marginBottom: 25,
//   },
//   invoiceTitle: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#ffffff",
//     letterSpacing: 1,
//   },
//   invoiceNumber: {
//     fontSize: 18,
//     fontWeight: 700,
//     color: "#ffffff",
//   },
//   invoiceDate: {
//     fontSize: 10,
//     color: "#e0e0e0",
//     marginTop: 4,
//   },

//   // Info Cards
//   infoSection: {
//     flexDirection: "row",
//     gap: 20,
//     marginBottom: 25,
//   },
//   infoCard: {
//     flex: 1,
//     backgroundColor: "#fafafa",
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eaeaea",
//   },
//   cardTitle: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 10,
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   cardRow: {
//     flexDirection: "row",
//     marginBottom: 6,
//   },
//   cardLabel: {
//     width: 80,
//     fontSize: 8.5,
//     color: "#666",
//   },
//   cardValue: {
//     flex: 1,
//     fontSize: 9,
//     fontWeight: 500,
//     color: "#2d2d2d",
//   },

//   // Table
//   table: {
//     marginBottom: 25,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#2d2d2d",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//   },
//   tableHeaderText: {
//     color: "#fff",
//     fontSize: 8.5,
//     fontWeight: 700,
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   tableRowAlt: {
//     backgroundColor: "#fdfdfd",
//   },
//   cell: {
//     fontSize: 9,
//     color: "#2d2d2d",
//   },
//   cellBold: { fontWeight: 600 },
//   textRight: { textAlign: "right" },

//   // Summary (Right Aligned)
//   summaryContainer: {
//     alignItems: "flex-end",
//   },
//   summaryBox: {
//     width: "45%",
//     backgroundColor: "#f8f8f8",
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#eaeaea",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 5,
//   },
//   summaryLabel: {
//     fontSize: 10,
//     color: "#555",
//   },
//   summaryValue: {
//     fontSize: 10,
//     fontWeight: 600,
//     color: "#2d2d2d",
//   },
//   totalRow: {
//     marginTop: 10,
//     paddingTop: 12,
//     borderTopWidth: 2,
//     borderTopColor: "#2d2d2d",
//     backgroundColor: "#2d2d2d",
//     borderRadius: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//   },
//   totalLabel: {
//     fontSize: 13,
//     fontWeight: 700,
//     color: "#fff",
//   },
//   totalValue: {
//     fontSize: 16,
//     fontWeight: 700,
//     color: "#fff",
//   },

//   // Payment Method
//   paymentSection: {
//     marginTop: 20,
//   },
//   paymentTitle: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 10,
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//   },
//   paymentOptions: {
//     flexDirection: "row",
//     gap: 20,
//   },
//   paymentOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   checkbox: {
//     width: 14,
//     height: 14,
//     borderRadius: 3,
//     borderWidth: 1.5,
//     borderColor: "#2d2d2d",
//   },
//   checkboxChecked: {
//     backgroundColor: "#2d2d2d",
//     position: "relative",
//   },
//   checkmark: {
//     position: "absolute",
//     top: -2,
//     left: 2,
//     fontSize: 10,
//     color: "#fff",
//     fontWeight: 700,
//   },
//   paymentText: {
//     fontSize: 9,
//     color: "#2d2d2d",
//   },

//   // Footer
//   footer: {
//     marginTop: 40,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#eaeaea",
//   },
//   signatureRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   signatureBox: {
//     width: "45%",
//     alignItems: "center",
//   },
//   signatureLine: {
//     width: "100%",
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#2d2d2d",
//     marginBottom: 8,
//   },
//   signatureLabel: {
//     fontSize: 8,
//     color: "#666",
//   },
//   thankYou: {
//     textAlign: "center",
//     fontSize: 9,
//     color: "#777",
//     marginTop: 10,
//     fontWeight: 500,
//   },
// });

// // Reusable Components
// const TableHeader = () => (
//   <View style={styles.tableHeader}>
//     <Text style={[styles.tableHeaderText, { width: "8%" }]}>#</Text>
//     <Text style={[styles.tableHeaderText, { width: "42%" }]}>Description</Text>
//     <Text style={[styles.tableHeaderText, { width: "12%", textAlign: "right" }]}>Qty</Text>
//     <Text style={[styles.tableHeaderText, { width: "18%", textAlign: "right" }]}>Amount</Text>
//     <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>Total + VAT</Text>
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vat = item.subtotal * VAT_RATE;
//   const total = item.subtotal + vat;

//   return (
//     <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
//       <Text style={[styles.cell, { width: "8%" }]}>{index + 1}</Text>
//       <Text style={[styles.cell, styles.cellBold, { width: "42%" }]}>{item.name}</Text>
//       <Text style={[styles.cell, styles.textRight, { width: "12%" }]}>{item.quantity}</Text>
//       <Text style={[styles.cell, styles.textRight, { width: "18%" }]}>{item.subtotal.toFixed(2)}</Text>
//       <Text style={[styles.cell, styles.cellBold, styles.textRight, { width: "20%" }]}>
//         {total.toFixed(2)}
//       </Text>
//     </View>
//   );
// };

// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.companyName}>JESR AL HAYAH MAIN W. SHOP</Text>
//           <Text style={styles.arabicName}>ورشه جسر الحياه لحيانه السارات</Text>
//           <Text style={styles.contactInfo}>
//             Mobile: +971 558 757 029 | +971 503 315 047 • Email: jesralhayah2024@gmail.com • TRN: 104712178300003 • Dubai, UAE
//           </Text>
//         </View>

//         {/* Invoice Title Bar */}
//         <View style={styles.invoiceBar}>
//           <View>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text style={styles.invoiceDate}>Date: {dateFormatter(details.service.created_at)}</Text>
//           </View>
//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.invoiceNumber}>#{details.service.id}</Text>
//           </View>
//         </View>

//         {/* Customer & Vehicle Info Cards */}
//         <View style={styles.infoSection}>
//           <View style={styles.infoCard}>
//             <Text style={styles.cardTitle}>Bill To</Text>
//             <View style={styles.cardRow}><Text style={styles.cardLabel}>Customer:</Text><Text style={styles.cardValue}>{details.service.name}</Text></View>
//             <View style={styles.cardRow}><Text style={styles.cardLabel}>Phone:</Text><Text style={styles.cardValue}>{details.service.phone_number}</Text></View>
//             {details.service.company_name && <View style={styles.cardRow}><Text style={styles.cardLabel}>Company:</Text><Text style={styles.cardValue}>{details.service.company_name}</Text></View>}
//             {isTrnInclude && details.service.trn && <View style={styles.cardRow}><Text style={styles.cardLabel}>TRN:</Text><Text style={styles.cardValue}>{details.service.trn}</Text></View>}
//           </View>

//           <View style={styles.infoCard}>
//             <Text style={styles.cardTitle}>Vehicle Details</Text>
//             <View style={styles.cardRow}><Text style={styles.cardLabel}>Plate No:</Text><Text style={styles.cardValue}>{details.service.vehicle_number}</Text></View>
//             <View style={styles.cardRow}><Text style={styles.cardLabel}>Chassis:</Text><Text style={styles.cardValue}>{details.service.chassis_number}</Text></View>
//             {details.service.make && <View style={styles.cardRow}><Text style={styles.cardLabel}>Make/Model:</Text><Text style={styles.cardValue}>{details.service.make} {details.service.model || ""}</Text></View>}
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.table}>
//           <TableHeader />
//           {details.serviceItems.map((item: any, i: number) => (
//             <TableRow key={i} item={item} index={i} />
//           ))}
//         </View>

//         {/* Summary */}
//         <View style={styles.summaryContainer}>
//           <View style={styles.summaryBox}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.subtotal.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>VAT (5%)</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.vat_amount.toFixed(2)} AED</Text>
//             </View>
//             {details.serviceBill.discount > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Discount ({details.serviceBill.discount}%)</Text>
//                 <Text style={styles.summaryValue}>-{((details.serviceBill.subtotal * details.serviceBill.discount) / 100).toFixed(2)} AED</Text>
//               </View>
//             )}
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
//               <Text style={styles.totalValue}>{details.serviceBill.total.toFixed(2)} AED</Text>
//             </View>
//           </View>
//         </View>

//         {/* Payment Method */}
//         <View style={styles.paymentSection}>
//           <Text style={styles.paymentTitle}>Payment Method</Text>
//           <View style={styles.paymentOptions}>
//             <View style={styles.paymentOption}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Cash</Text>
//             </View>
//             <View style={styles.paymentOption}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Card</Text>
//             </View>
//             <View style={styles.paymentOption}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Bank Transfer</Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <View style={styles.signatureRow}>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Customer Signature</Text>
//             </View>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Authorized Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.thankYou}>
//             Thank you for choosing Jesr Al Hayah Main Workshop • We appreciate your business!
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default MyDocument;

// import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
// import { dateFormatter } from "../ui/utils/DateFormatter";

// // Font Registration
// Font.register({
//   family: "Roboto",
//   fonts: [
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
//       fontWeight: 300,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
//       fontWeight: 400,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
//       fontWeight: 500,
//     },
//     {
//       src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
//       fontWeight: 700,
//     },
//   ],
// });

// Font.register({
//   family: "NotoArabic",
//   src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
//   fontWeight: 600,
// });

// const VAT_RATE = 0.05;

// // Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 9,
//     fontFamily: "Roboto",
//     fontWeight: 400,
//     color: "#1a1a1a",
//   },

//   // Header Section
//   header: {
//     marginBottom: 15,
//     borderBottom: 1.5,
//     borderBottomColor: "#2d2d2d",
//     paddingBottom: 10,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 3,
//   },
//   arabicName: {
//     fontFamily: "NotoArabic",
//     fontSize: 13,
//     color: "#4a4a4a",
//     marginBottom: 8,
//   },
//   contactRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 4,
//   },
//   contactText: {
//     fontSize: 8,
//     color: "#666666",
//     marginBottom: 1,
//   },

//   // Invoice Info Section
//   invoiceHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//     alignItems: "flex-end",
//   },
//   invoiceTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 2,
//   },
//   invoiceNumber: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   invoiceNumberLarge: {
//     fontSize: 16,
//     fontWeight: 700,
//     color: "#2d2d2d",
//   },

//   // Details Section
//   detailsSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   detailsBox: {
//     width: "48%",
//     padding: 8,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 3,
//   },
//   detailsTitle: {
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 5,
//     textTransform: "uppercase",
//     letterSpacing: 0.3,
//   },
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 2,
//   },
//   detailLabel: {
//     fontSize: 8,
//     color: "#666666",
//     width: 65,
//   },
//   detailValue: {
//     fontSize: 8,
//     color: "#2d2d2d",
//     fontWeight: 500,
//     flex: 1,
//   },

//   // Table Section
//   table: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   tableWrapper: {
//     minHeight: 300,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#2d2d2d",
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//   },
//   tableHeaderText: {
//     fontSize: 8,
//     fontWeight: 700,
//     color: "#ffffff",
//     textTransform: "uppercase",
//     letterSpacing: 0.3,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#e5e5e5",
//     paddingVertical: 7,
//     paddingHorizontal: 8,
//   },
//   tableRowAlt: {
//     backgroundColor: "#fafafa",
//   },
//   tableCell: {
//     fontSize: 8,
//     color: "#2d2d2d",
//   },
//   tableCellBold: {
//     fontWeight: 500,
//   },

//   // Summary Section
//   summarySection: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   summaryBox: {
//     width: "40%",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//   },
//   summaryLabel: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   summaryValue: {
//     fontSize: 9,
//     color: "#2d2d2d",
//     fontWeight: 500,
//   },
//   summaryTotal: {
//     backgroundColor: "#2d2d2d",
//     marginTop: 5,
//   },
//   summaryTotalLabel: {
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#ffffff",
//   },
//   summaryTotalValue: {
//     fontSize: 12,
//     fontWeight: 700,
//     color: "#ffffff",
//   },

//   // Payment Section
//   paymentSection: {
//     marginTop: 15,
//     paddingTop: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: "#e5e5e5",
//   },
//   paymentTitle: {
//     fontSize: 9,
//     fontWeight: 700,
//     color: "#2d2d2d",
//     marginBottom: 6,
//     textTransform: "uppercase",
//   },
//   paymentMethods: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   paymentMethod: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   checkbox: {
//     width: 11,
//     height: 11,
//     borderWidth: 1.2,
//     borderColor: "#2d2d2d",
//     borderRadius: 1.5,
//   },
//   paymentText: {
//     fontSize: 8,
//     color: "#2d2d2d",
//   },

//   // Footer Section
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 30,
//     right: 30,
//     paddingTop: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: "#e5e5e5",
//   },
//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   signatureBox: {
//     width: "45%",
//   },
//   signatureLine: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#2d2d2d",
//     marginBottom: 4,
//     paddingTop: 20,
//   },
//   signatureLabel: {
//     fontSize: 7,
//     color: "#666666",
//     textAlign: "center",
//   },
//   footerText: {
//     fontSize: 7,
//     color: "#999999",
//     textAlign: "center",
//   },
// });

// // Components
// const TableHeader = () => (
//   <View style={styles.tableHeader}>
//     <Text style={[styles.tableHeaderText, { width: "8%" }]}>#</Text>
//     <Text style={[styles.tableHeaderText, { width: "42%" }]}>Description</Text>
//     <Text style={[styles.tableHeaderText, { width: "12%", textAlign: "right" }]}>Qty</Text>
//     <Text style={[styles.tableHeaderText, { width: "18%", textAlign: "right" }]}>Amount</Text>
//     <Text style={[styles.tableHeaderText, { width: "20%", textAlign: "right" }]}>Total + VAT</Text>
//   </View>
// );

// const TableRow = ({ item, index }: { item: any; index: number }) => {
//   const vatAmount = item.subtotal * VAT_RATE;
//   const totalWithVat = item.subtotal + vatAmount;

//   return (
//     <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]} wrap={false}>
//       <Text style={[styles.tableCell, { width: "8%" }]}>{index + 1}</Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "42%" }]}>
//         {item.name}
//       </Text>
//       <Text style={[styles.tableCell, { width: "12%", textAlign: "right" }]}>
//         {item.quantity}
//       </Text>
//       <Text style={[styles.tableCell, { width: "18%", textAlign: "right" }]}>
//         {item.subtotal.toFixed(2)}
//       </Text>
//       <Text style={[styles.tableCell, styles.tableCellBold, { width: "20%", textAlign: "right" }]}>
//         {totalWithVat.toFixed(2)}
//       </Text>
//     </View>
//   );
// };

// // Main Document
// const MyDocument = ({ details, isTrnInclude }: { details: any; isTrnInclude: boolean }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.companyName}>JESR AL HAYAH MAIN W. SHOP</Text>
//           <Text style={styles.arabicName}>ورشه جسر الحياه لحيانه السارات</Text>
//           <View style={styles.contactRow}>
//             <View>
//               <Text style={styles.contactText}>Mobile: +971 558 757 029 | +971 503 315 047</Text>
//               <Text style={styles.contactText}>Email: jesralhayah2024@gmail.com</Text>
//             </View>
//             <View>
//               <Text style={styles.contactText}>TRN: 104712178300003</Text>
//               <Text style={styles.contactText}>Dubai, UAE</Text>
//             </View>
//           </View>
//         </View>

//         {/* Invoice Title & Number */}
//         <View style={styles.invoiceHeader}>
//           <View>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//             <Text style={styles.invoiceNumber}>Date: {dateFormatter(details.service.created_at)}</Text>
//           </View>
//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.invoiceNumber}>Invoice No.</Text>
//             <Text style={styles.invoiceNumberLarge}>#{details.service.id}</Text>
//           </View>
//         </View>

//         {/* Customer & Vehicle Details */}
//         <View style={styles.detailsSection}>
//           {/* Customer Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Bill To</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Customer:</Text>
//               <Text style={styles.detailValue}>{details.service.name}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Phone:</Text>
//               <Text style={styles.detailValue}>{details.service.phone_number}</Text>
//             </View>
//             {details.service.company_name && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Company:</Text>
//                 <Text style={styles.detailValue}>{details.service.company_name}</Text>
//               </View>
//             )}
//             {isTrnInclude && details.service.trn && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>TRN:</Text>
//                 <Text style={styles.detailValue}>{details.service.trn}</Text>
//               </View>
//             )}
//           </View>

//           {/* Vehicle Info */}
//           <View style={styles.detailsBox}>
//             <Text style={styles.detailsTitle}>Vehicle Details</Text>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Vehicle:</Text>
//               <Text style={styles.detailValue}>{details.service.vehicle_number}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Chassis:</Text>
//               <Text style={styles.detailValue}>{details.service.chassis_number}</Text>
//             </View>
//             {details.service.make && (
//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Make/Model:</Text>
//                 <Text style={styles.detailValue}>
//                   {details.service.make} {details.service.model || ""}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.table} wrap={false}>
//           <TableHeader />
//         </View>
//         <View style={styles.tableWrapper}>
//           {details.serviceItems.map((item: any, index: number) => (
//             <TableRow key={index} item={item} index={index} />
//           ))}
//         </View>

//         {/* Summary */}
//         <View style={styles.summarySection}>
//           <View style={styles.summaryBox}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.subtotal.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>VAT (5%)</Text>
//               <Text style={styles.summaryValue}>{details.serviceBill.vat_amount.toFixed(2)} AED</Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Discount ({details.serviceBill.discount}%)</Text>
//               <Text style={styles.summaryValue}>
//                 -{((details.serviceBill.subtotal * details.serviceBill.discount) / 100).toFixed(2)} AED
//               </Text>
//             </View>
//             <View style={[styles.summaryRow, styles.summaryTotal]}>
//               <Text style={styles.summaryTotalLabel}>TOTAL</Text>
//               <Text style={styles.summaryTotalValue}>{details.serviceBill.total.toFixed(2)} AED</Text>
//             </View>
//           </View>
//         </View>

//         {/* Payment Method */}
//         <View style={styles.paymentSection}>
//           <Text style={styles.paymentTitle}>Payment Method</Text>
//           <View style={styles.paymentMethods}>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Cash</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Card</Text>
//             </View>
//             <View style={styles.paymentMethod}>
//               <View style={styles.checkbox} />
//               <Text style={styles.paymentText}>Bank Transfer</Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer with Signatures */}
//         <View style={styles.footer}>
//           <View style={styles.signatureSection}>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Customer Signature</Text>
//             </View>
//             <View style={styles.signatureBox}>
//               <View style={styles.signatureLine} />
//               <Text style={styles.signatureLabel}>Authorized Signature</Text>
//             </View>
//           </View>
//           <Text style={styles.footerText}>
//             Thank you for your business | JESR AL HAYAH MAIN W. SHOP
//           </Text>
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default MyDocument;
