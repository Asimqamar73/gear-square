import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { dateFormatter } from "../ui/utils/DateFormatter";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

Font.register({
  family: "Noto",
  src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
  fontWeight: 700,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#F2EBE2",
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1,
  },
  p: {
    fontSize: 20,
    fontWeight: 700,
  },
  heading: {
    textAlign: "center",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    borderColor: "gray",
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    // borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    fontSize: 8,
  },
});

// Create Document Component
const MyDocument = ({ details }: { details: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={{ fontFamily: "Noto", textAlign: "center", fontWeight: 700 }}>
          ورشه جسر الحياه لحيانه السارات
        </Text>
        <Text style={[styles.p, styles.heading]}>JESR AL HAYAH MAIN W. SHOP</Text>
        <View>
          <Text
            style={{
              backgroundColor: "#3f5277",
              fontSize: 10,
              textAlign: "center",
              color: "white",
              padding: 4,
              borderRadius: 4,
            }}
          >
            Mob: +971558757029, +971503315047, Email: jesralhayah2024@gmail.com
          </Text>
        </View>
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center", marginVertical: 8 }}>
          Customer invoice
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 4,
          }}
        >
          <Text style={{ fontSize: 8 }}>Vehicle number: <Text style={{fontWeight:700}}>{details?.service?.vehicle_number}</Text></Text>
          <Text style={{ fontSize: 8 }}>
            Make: <Text style={{fontWeight:700}}>{details?.service?.make}</Text>
          </Text>
          <Text style={{ fontSize: 8 }}>Model: <Text style={{fontWeight:700}}>{details?.service?.model}</Text></Text>
          <Text style={{ fontSize: 8 }}>Date: <Text style={{fontWeight:700}}>{dateFormatter(details?.service?.created_at)}</Text></Text>
        </View>
        <View style={{ display: "flex", marginTop: 8, gap: 4 }}>
          <Text style={{ fontSize: 8 }}>
            Invoice no. <Text style={{ fontWeight: 700 }}>{details?.service?.id}</Text>
          </Text>
          <Text style={{ fontSize: 8 }}>
            Mr./Mrs./Miss: <Text style={{ fontWeight: 700 }}>{details?.service?.name}</Text>
          </Text>
          <Text style={{ fontSize: 8 }}>
            Phone number: <Text style={{ fontWeight: 700 }}>{details?.service?.phone_number}</Text>
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#D4D4D4" }]}>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>Sr. no</Text>
            </View>
            <View style={[styles.tableCol, { width: "40%" }]}>
              <Text style={styles.tableCell}>Description</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>Qty parts</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>Rate</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
          </View>

          {/* Table Rows */}
          {details.serviceItems.map((item: any, i: number) => (
            <View style={[styles.tableRow]} key={i}>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>{i + 1}</Text>
              </View>
              <View style={[styles.tableCol, { width: "40%" }]}>
                <Text style={styles.tableCell}>{item.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>-</Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>{item.subtotal}</Text>
              </View>
            </View>
          ))}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>Total</Text>
            </View>
            <View style={[styles.tableCol, { width: "40%" }]}>
              <Text style={styles.tableCell}>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>-</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={[styles.tableCell, { fontWeight: 700 }]}>
                {details.serviceBill.subtotal}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
