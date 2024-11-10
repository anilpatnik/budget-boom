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
import { PageType, CrudType, formatddMMMyyyy, formatPrice, constants } from "@/util";
import { IExpense, Expense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getExpensesAsync, getExpenseAsync, deleteExpenseAsync, getCategory } from "@/services";
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

  const handleEdit = async (expense: IExpense) => {
    setLoading(true);
    try {
      const newExpense = { ...expense, type: CrudType.Update };
      handleClick(PageType.Step1, newExpense);
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
        color: constants.DANGER,
        duration: 5000
      });
    } else {
      present({
        message: "Deleted Successfully",
        color: constants.SUCCESS,
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
    <IonGrid>
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
                      {item?.categoryId && (
                        <Box className="flex items-center">
                          <Icon
                            name={getCategory(item.categoryId).icon}
                            css="text-2xl text-black mr-2"
                          />
                          <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            {getCategory(item.categoryId).name}
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      <Icon
                        name={item.taxable ? "checkmark-outline" : "close-outline"}
                        css="text-2xl text-black"
                      />
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-edit-button"
                        title="EDIT EXPENSE"
                        size="small"
                        aria-hidden="false"
                        buttonType="icon"
                        onClick={() => handleEdit(item)}>
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
      <IonRow>
        <IonCol className="ion-margin-top ion-text-end">
          <PagingComponent
            count={expenses?.count ?? 0}
            page={payload.page ?? 0}
            size={payload.size ?? constants.PAGE_SIZE}
            handlePaging={handlePaging}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
