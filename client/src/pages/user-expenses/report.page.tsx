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
import { categoryMap, constants, dateAdd, formatPrice } from "@/util";
import { IExpense, IExpenseSearch, ExpenseSearch } from "@/models";
import { getCategory, getExpenseReportAsync } from "@/services";
import { Icon } from "@/components";
import { ExpenseReportSearchPage } from "./report.search.page";
import { useStore } from "@/contexts";

export function ExpenseReportPage() {
  const { user } = useStore();
  const hasMounted = useRef(false);
  const [records, setRecords] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<IExpenseSearch>({
    ...ExpenseSearch,
    startDate: dateAdd(-30),
    endDate: dateAdd(1),
    page: 0,
    size: constants.PAGE_SIZE
  });
  const queryRef = useRef(payload);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getExpenseReportAsync(queryRef.current);
      const sortedData = [...response].sort((a, b) => {
        const nameA = categoryMap[a.categoryId ?? String.empty]?.name || "";
        const nameB = categoryMap[b.categoryId ?? String.empty]?.name || "";
        return nameA.localeCompare(nameB);
      });
      setRecords(prev => [...prev, ...sortedData]);
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
      taxable: item?.taxable
    }));
    setTimeout(() => {
      setRecords([]);
      fetchData();
    }, constants.DELAY);
  };

  if (loading) return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: { xs: window.innerHeight - 212, sm: 600 } }}
      className="tableContainer">
      <Table className="styled-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">Category</TableCell>
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
                  <Box className={item.price < 0 ? "text-red-700" : String.empty}>
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
