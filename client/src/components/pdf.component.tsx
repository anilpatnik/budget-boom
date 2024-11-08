// import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
// import { IProject, IUser, IWorkRecord } from "../configs/models";

/*
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  headerTable: {
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerCell: {
    fontSize: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc"
  },
  headerCell1: { flex: 2 },
  headerCell2: { flex: 4 },
  headerCell3: { flex: 2 },
  headerCell4: { flex: 4 },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey"
  },
  table: {
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    marginTop: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  cell: {
    fontSize: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc"
  },
  cell1: { flex: 2 },
  cell2: { flex: 4 },
  cell3: { flex: 3 },
  cell4: { flex: 1 }
});

export const PdfComponent = ({
  payload,
  startDate,
  endDate,
  total,
  isProject = false,
  project,
  isUser = false,
  user
}: {
  payload: IWorkRecord[];
  startDate: string;
  endDate: string;
  total: number;
  isProject?: Boolean;
  project?: IProject;
  isUser?: Boolean;
  user?: IUser;
}) => (
  <Document>
    <Page style={styles.body}>
      {(isUser || isProject) && (
        <View style={styles.headerTable}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.headerCell3]}>Start Date</Text>
            <Text style={[styles.headerCell, styles.headerCell4]}>{startDate}</Text>
            <Text style={[styles.headerCell, styles.headerCell3]}>End Date</Text>
            <Text style={[styles.headerCell, styles.headerCell4]}>{endDate}</Text>
          </View>
          {project && project.name && project.code && (
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.headerCell1]}>Project</Text>
              <Text style={[styles.headerCell, styles.headerCell2]}>{project.name}</Text>
              <Text style={[styles.headerCell, styles.headerCell1]}>Project Code</Text>
              <Text style={[styles.headerCell, styles.headerCell2]}>{project.code}</Text>
            </View>
          )}
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.headerCell1]}>Actual hrs</Text>
            <Text style={[styles.headerCell, styles.headerCell2]}>{total?.toFixed(2)}</Text>
            <Text style={[styles.headerCell, styles.headerCell3]}>
              {isUser ? "Employee" : "Estimated hrs"}
            </Text>
            <Text style={[styles.headerCell, styles.headerCell4]}>
              {isUser ? user?.name : project?.budget?.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.cell1]}>Date</Text>
          {(!isUser || !isProject) && (
            <Text style={[styles.cell, styles.cell2]}>{isUser ? "Project" : "Employee"}</Text>
          )}
          <Text style={[styles.cell, styles.cell3]}>Type</Text>
          <Text style={[styles.cell, styles.cell4]}>Hours</Text>
        </View>
        {payload?.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={[styles.cell, styles.cell1]}>{item?.workDate}</Text>
            {(!isUser || !isProject) && (
              <Text style={[styles.cell, styles.cell2]}>
                {isUser ? item?.project?.name : item?.user?.name}
              </Text>
            )}
            <Text style={[styles.cell, styles.cell3]}>{item?.category?.name}</Text>
            <Text style={[styles.cell, styles.cell4]}>{item?.workTime?.toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);
*/
