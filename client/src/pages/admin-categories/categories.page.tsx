import { useState } from "react";
import { IonButton, IonIcon, IonSpinner, useIonAlert, useIonToast } from "@ionic/react";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PageType, CrudType } from "@/util";
import { ICategory, Category } from "@/models";
import { deleteCategoryAsync, getCategoryAsync, getCategoriesAsync } from "@/services";
import { Icon } from "@/components";

type ComponentProps = {
  handleClick: (pageType: PageType, category?: ICategory) => void;
};
export function CategoriesPage({ handleClick }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();

  const {
    isFetching,
    data: categories,
    refetch
  } = useQuery({
    queryKey: ["admin-categories"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => await getCategoriesAsync()
  });

  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const category = await getCategoryAsync(id);
      if (category) {
        const newCategory = { ...category, type: CrudType.Update };
        handleClick(PageType.Step1, newCategory);
      }
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await deleteCategoryAsync(id);
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

  if (isFetching)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <div className="ion-margin">
      <TableContainer component={Paper}>
        <Table className="styled-table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Code</TableCell>
              <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                Icon
              </TableCell>
              <TableCell align="left">
                <IonButton
                  id="id-create-button"
                  title="CREATE CATEGORY"
                  size="small"
                  aria-hidden="false"
                  buttonType="icon"
                  onClick={() => {
                    const newCategory = { ...Category, type: CrudType.Create };
                    handleClick(PageType.Step1, newCategory);
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
            {categories?.map((item, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left">{item?.name}</TableCell>
                <TableCell align="left">{item?.code}</TableCell>
                <TableCell align="left" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {item?.icon ? <Icon name={item.icon} /> : String.empty}
                </TableCell>
                <TableCell align="left">
                  <IonButton
                    id="id-edit-button"
                    title="EDIT CATEGORY"
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
                    title="Delete"
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
    </div>
  );
}
