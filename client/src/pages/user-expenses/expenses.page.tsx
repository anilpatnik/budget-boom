import { useRef, useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  useIonAlert,
  useIonModal,
  useIonToast
} from "@ionic/react";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { CrudType, formatddMMMyyyy, formatPrice, constants, QueryType } from "@/util";
import { IExpense, Expense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getExpensesAsync, deleteExpenseAsync, getCategory, getAllProjectsAsync } from "@/services";
import { Icon } from "@/components";
import { ExpensePage } from "./expense.page";

export function ExpensesPage() {
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IExpense[]>([]);
  const [record, setRecord] = useState<IExpense>(Expense);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    page: 0,
    size: constants.PAGE_SIZE
  });
  const [total, setTotal] = useState<number>(0);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const { isLoading: loadProjects, data: projects } = useQuery({
    queryKey: [QueryType.AllUserProjects],
    refetchOnMount: true,
    queryFn: async () => await getAllProjectsAsync()
  });

  const fetchData = async (pageNum: number = 0) => {
    if (loading) return;
    if (pageNum === 0) setInitLoading(true);
    else setLoading(true);
    try {
      const newPayload: IExpenseSearch = { ...payload, page: pageNum };
      const response = await getExpensesAsync(newPayload);
      setRecords(prev => [...prev, ...(response?.data ?? [])]);
      setTotal(response?.count ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      if (pageNum === 0) setInitLoading(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    fetchData();
  }, []);

  const loadMore = () => {
    if (records?.length < total) {
      const newPage = (payload?.page ?? 0) + 1;
      setPayload(prev => ({ ...prev, page: newPage }));
      setTimeout(() => fetchData(newPage), 200);
    }
  };

  const addRecord = (item: IExpense) => {
    setRecords(prev => [item, ...prev]);
    setTotal(prev => prev + 1);
  };
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(x => x?.id !== id));
    setTotal(prev => prev - 1);
  };
  const editRecord = (item: IExpense) => {
    setRecords(prev => prev.map(x => (x.id === item.id ? item : x)));
  };

  const [presentModal, dismissModal] = useIonModal(ExpensePage, {
    projects,
    expense: record,
    handleClose: () => dismissModal(),
    handleNew: (item?: any) => {
      addRecord(item);
      setTimeout(dismissModal, 200);
    },
    handleEdit: (item?: any) => {
      editRecord(item);
      setTimeout(dismissModal, 200);
    }
  });
  const handleOpen = (expense?: IExpense) => {
    setLoading(true);
    const newExpense = { ...expense, type: expense?.id ? CrudType.Update : CrudType.Create };
    setRecord(newExpense);
    setTimeout(() => {
      presentModal({
        backdropDismiss: false,
        keyboardClose: false
        // cssClass: "desktop-modal-class"
      });
      setLoading(false);
    }, 200);
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
      setLoading(false);
      return;
    } else {
      present({
        message: "Deleted Successfully",
        color: constants.SUCCESS,
        duration: 3000
      });
      setTimeout(() => {
        deleteRecord(id);
        setLoading(false);
      }, 200);
    }
  };
  const handleChange = (e: any) => {
    const input = e.target.value;
    setPayload(prev => ({ ...prev, searchInput: input }));
    if (input.includes("@")) setPayload(prev => ({ ...prev, searchType: 20 }));
    else setPayload(prev => ({ ...prev, searchType: 10 }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPayload(prev => ({ ...prev, page: 0 }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, 200);
  };

  if (loadProjects || initLoading)
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
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Amount
                  </TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Category
                  </TableCell>
                  <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Taxable
                  </TableCell>
                  <TableCell align="left">
                    <IonButton
                      id="id-create-button"
                      title="ADD EXPENSE"
                      size="small"
                      buttonType="icon"
                      onClick={() => handleOpen(Expense)}>
                      <IonIcon icon={addCircleOutline}></IonIcon>
                    </IonButton>
                  </TableCell>
                  <TableCell align="left">
                    {loading && <IonSpinner name="lines-sharp-small"></IonSpinner>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records?.map((item, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left" sx={{ minWidth: 150 }}>
                      <Box>{item?.entryDate && formatddMMMyyyy(item.entryDate)}</Box>
                      <Box sx={{ display: { xs: "table-cell", sm: "none" } }}>
                        <IonGrid className="p-0 mt-3">
                          <IonRow>
                            <IonCol className="p-0">
                              {item?.categoryId && (
                                <Icon
                                  name={getCategory(item.categoryId).icon}
                                  css="text-2xl text-black mr-3"
                                />
                              )}
                            </IonCol>
                            <IonCol className="p-0">
                              {item?.price && `${formatPrice(item?.price)}`}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ display: { xs: "none", sm: "table-cell", minWidth: 150 } }}
                      align="left">
                      {item?.price && `${formatPrice(item?.price)}`}
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }} align="left">
                      <Box className="flex items-center">
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
                        <Box>
                          {item?.notes && (
                            <IonButton
                              buttonType="icon"
                              onClick={() =>
                                present({
                                  message: item.notes,
                                  color: "dark",
                                  duration: 3000
                                })
                              }>
                              <Icon
                                name="information-circle-outline"
                                css="text-2xl text-blue-700"
                              />
                            </IonButton>
                          )}
                        </Box>
                      </Box>
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
                        buttonType="icon"
                        onClick={() => handleOpen(item)}>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                    </TableCell>
                    <TableCell align="left">
                      <IonButton
                        id="id-delete-button"
                        title="DELETE EXPENSE"
                        fill="clear"
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
      {records?.length < total && (
        <IonRow>
          <IonCol className="flex items-center justify-center my-2">
            <IonButton size="small" disabled={loading} onClick={loadMore}>
              {loading ? "Loading..." : "Load More"}
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
}
