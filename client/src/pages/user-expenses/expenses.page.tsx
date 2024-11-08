import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PageType, CrudType, formatddMMMyyyy, formatPrice } from "@/util";
import { IExpense, Expense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getExpensesAsync, getExpenseAsync, deleteExpenseAsync } from "@/services";
import { Icon, PagingComponent } from "@/components";

type ComponentProps = {
  handleClick: (pageType: PageType, expense?: IExpense) => void;
};
export function ExpensesPage({ handleClick }: ComponentProps) {
  const [payload, setPayload] = useState<IExpenseSearch>(ExpenseSearch);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState(false);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();
  // fetch expenses
  const {
    isFetching: loadExpenses,
    data: expenses,
    refetch
  } = useQuery({
    queryKey: ["user-expenses"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => await getExpensesAsync(payload)
  });
  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const expense = await getExpenseAsync(id);
      if (expense) {
        const newExpense = { ...expense, type: CrudType.Update };
        handleClick(PageType.Step1, newExpense);
      }
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteExpenseAsync(id);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: "danger",
        duration: 5000
      });
    } else {
      present({
        message: "Deleted Successfully",
        color: "success",
        duration: 3000
      });
    }
    setTimeout(() => {
      setLoading(false);
      refetch();
    }, 200);
  };
  const handlePaging = (e: any, value: number) => {
    setPaging(true);
    setPayload(prev => ({
      ...prev,
      page: value - 1,
      skipPaging: false
    }));
    setTimeout(async () => {
      await refetch();
      setPaging(false);
    }, 1000);
  };

  if (loadExpenses)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <IonGrid className="ion-no-vertical">
      <IonRow>
        <IonCol>
          <TableContainer component={Paper}>
            <Table className="styled-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Taxable
                  </TableCell>
                  <TableCell align="left">
                    <IonButton
                      id="id-create-button"
                      title="CREATE EXPENSE"
                      size="small"
                      aria-hidden="false"
                      buttonType="icon"
                      onClick={() => {
                        const newExpense = { ...Expense, type: CrudType.Create };
                        handleClick(PageType.Step1, newExpense);
                      }}>
                      <IonIcon icon={addCircleOutline}></IonIcon>
                    </IonButton>
                  </TableCell>
                  <TableCell align="left">
                    {loading && <IonSpinner name="lines-sharp-small"></IonSpinner>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses?.data?.map((item, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left" sx={{ minWidth: 150 }}>
                      {item?.entryDate && formatddMMMyyyy(item.entryDate)}
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 150 }}>
                      {item?.price && `${formatPrice(item?.price)}`}
                    </TableCell>
                    <TableCell align="left">
                      <Box className="flex items-center">
                        {item?.categoryIcon && <Icon name={item.categoryIcon} css="mr-2" />}
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>{item.categoryName}</Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      <Checkbox checked={item.taxable} readOnly={true} color="info" />
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-edit-button"
                        title="EDIT EXPENSE"
                        size="small"
                        aria-hidden="false"
                        buttonType="icon"
                        onClick={() => handleEdit(item.id || String.empty)}>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-delete-button"
                        title="DELETE EXPENSE"
                        fill="clear"
                        aria-hidden="false"
                        onClick={() =>
                          presentAlert({
                            header: "Are you sure?",
                            buttons: [
                              { text: "Cancel" },
                              {
                                text: "Confirm",
                                handler: () => {
                                  handleDelete(item?.id || String.empty);
                                }
                              }
                            ]
                          })
                        }>
                        <IonIcon color="danger" icon={trashOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </IonCol>
      </IonRow>
      <IonRow
        className="ion-margin-top"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IonCol className="ion-text-start"></IonCol>
        <IonCol className="ion-text-end">
          <PagingComponent
            count={expenses?.count ?? 0}
            page={payload.page ?? 0}
            size={payload.size ?? 10}
            handlePaging={handlePaging}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
