import { useRef, useState, useEffect } from "react";
import { IonFabButton, IonSpinner, useIonModal } from "@ionic/react";
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
import { categoryMap, constants, dateAdd, dateFormat, formatPrice } from "@/util";
import { IExpense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getCategory, getExpenseReportAsync, getAllProjectsAsync } from "@/services";
import { Icon } from "@/components";
import { useStore } from "@/contexts";
import { ExpenseReportSearchPage } from "./report.search.page";

export function ExpenseReportPage() {
  const { user } = useStore();
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IExpense[]>([]);
  const [expenseTotal, setExpense] = useState<number>(0);
  const [incomeTotal, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    startDate: dateAdd(-30),
    endDate: dateAdd(1),
    page: 0,
    size: constants.PAGE_SIZE
  });
  const queryRef = useRef(payload);

  const { isLoading: loadingProjects, data: projects } = useQuery({
    queryKey: ["all-user-projects"],
    refetchOnMount: true,
    queryFn: async () => await getAllProjectsAsync()
  });

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getExpenseReportAsync(queryRef.current);
      const sortedData = [...(response?.data ?? [])].sort((a, b) => {
        const nameA = categoryMap[a.categoryId ?? String.empty]?.name || "";
        const nameB = categoryMap[b.categoryId ?? String.empty]?.name || "";
        return nameA.localeCompare(nameB);
      });
      setRecords(prev => [...prev, ...sortedData]);
      setExpense(response?.expense ?? 0);
      setIncome(response?.income ?? 0);
    } catch (error) {
      console.error("error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    fetchData();
  }, []);

  useEffect(() => {
    queryRef.current = payload;
  }, [payload]);

  const [presentSearchModal, dismissSearchModal] = useIonModal(ExpenseReportSearchPage, {
    search: payload,
    projects,
    handleClose: () => dismissSearchModal(),
    handleSearch: (item?: any) => {
      handleSearch(item);
      setTimeout(dismissSearchModal, constants.DELAY);
    }
  });
  const handleSearchOpen = () => {
    setTimeout(() => {
      presentSearchModal({
        backdropDismiss: false,
        keyboardClose: false
        // cssClass: "desktop-modal-class"
      });
    }, constants.DELAY);
  };
  const handleSearch = (item: IExpenseSearch) => {
    setPayload(prev => ({
      ...prev,
      page: 0,
      startDate: item?.startDate,
      endDate: item?.endDate,
      taxable: item?.taxable,
      projectId: item?.projectId
    }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, constants.DELAY);
  };

  if (loadingProjects || loading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
      className="tableContainer">
      <Table className="styled-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <div className="flex justify-between items-center">
                <div className="mr-2">💰 Income</div>
                <div className="text-green-700">
                  {formatPrice(incomeTotal, user?.countryId, user?.currency)}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="mr-2">💰 Expense</div>
                <div className="text-red-700">
                  {formatPrice(expenseTotal, user?.countryId, user?.currency)}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="mr-2">💰 Total</div>
                <div className={incomeTotal + expenseTotal < 0 ? "text-red-700" : "text-green-700"}>
                  {formatPrice(incomeTotal + expenseTotal, user?.countryId, user?.currency)}
                </div>
              </div>
              <div className="mt-2 flex items-center text-blue-700">
                <div className="mr-2">📅</div>
                <div>{dateFormat(queryRef.current.startDate ?? String.empty)}</div>
                <div className="mx-2">-</div>
                <div>{dateFormat(queryRef.current.endDate ?? String.empty)}</div>
              </div>
            </TableCell>
            <TableCell align="left">
              <IonFabButton
                id="id-search-button"
                title="SEARCH EXPENSES"
                color="warning"
                size="small"
                onClick={() => handleSearchOpen()}>
                <Icon name="options-sharp" />
              </IonFabButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records?.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left" sx={{ minWidth: 150 }}>
                {item?.categoryId && (
                  <Box className="flex items-center">
                    <Icon name={getCategory(item.categoryId).icon} css="text-2xl text-black mr-2" />
                    {getCategory(item.categoryId).name}
                  </Box>
                )}
              </TableCell>
              <TableCell align="left">
                {item?.price && (
                  <Box
                    className={
                      item.price < 0 ? "text-red-700 font-bold" : "text-green-700 font-bold"
                    }>
                    {formatPrice(item.price, user?.countryId, user?.currency)}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
