import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  IonSpinner,
  useIonToast
} from "@ionic/react";
import { caretBackOutline, caretForwardOutline, refreshOutline } from "ionicons/icons";
import { Switch } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CrudType, PageType, constants, convertoISO, dateNow, parsePrice } from "@/util";
import { IExpense } from "@/models";
import { getPubCategoriesAsync, getPubProjectsAsync, upsertExpenseAsync } from "@/services";
import { InputComponent, DateComponent, SelectComponent, AutoSelectComponent } from "@/components";

type ComponentProps = {
  expense?: IExpense;
  handleClick: (pageType: PageType, expense?: IExpense) => void;
};
export function ExpensePage({ expense, handleClick }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  // fetch categories
  const { isFetching: loadCategories, data: categories } = useQuery({
    queryKey: ["pub-categories"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => await getPubCategoriesAsync()
  });
  // fetch projects
  const { isFetching: loadProjects, data: projects } = useQuery({
    queryKey: ["user-projects"],
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => await getPubProjectsAsync()
  });
  const formik = useFormik({
    initialValues: {
      entryDate: expense?.entryDate ?? dateNow,
      projectId: expense?.projectId ?? String.empty,
      categoryId:
        expense?.categoryId ??
        categories?.find(category => category.name?.toUpperCase() === "NONE")?.id ??
        String.empty,
      price: Math.abs(expense?.price ?? 0),
      expenditure: !(expense?.price && expense?.price > 0),
      taxable: expense?.taxable ?? false,
      notes: expense?.notes ?? String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      entryDate: Yup.date().required("required"),
      categoryId: Yup.string().required("required"),
      price: Yup.number()
        .positive("price should be greater than zero")
        .test("is-decimal", "price should be two decimals", (val: any) => {
          if (val) return constants.TWO_DECIMAL_PATTERN.test(val);
          return true;
        })
        .required("required")
    }),
    onSubmit: async values => {
      setLoading(true);
      if (expense?.id?.length === 0) {
        const newExpense: IExpense = {
          id: crypto.randomUUID(),
          entryDate: values?.entryDate,
          projectId: expense?.projectId,
          categoryId: values?.categoryId,
          price: parsePrice(values?.expenditure, values?.price),
          taxable: values?.taxable,
          notes: values?.notes,
          type: CrudType.Create
        };
        const res = await upsertExpenseAsync(newExpense);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: "danger",
            duration: 5000
          });
        } else {
          present({
            message: "Created Successfully",
            color: "success",
            duration: 3000
          });
        }
      } else {
        const updateExpense: IExpense = {
          id: expense?.id,
          entryDate: values?.entryDate,
          projectId: expense?.projectId,
          categoryId: values?.categoryId,
          price: parsePrice(values?.expenditure, values?.price),
          taxable: values?.taxable,
          notes: values?.notes,
          type: CrudType.Update
        };
        const res = await upsertExpenseAsync(updateExpense);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: "danger",
            duration: 5000
          });
        } else {
          present({
            message: "Updated Successfully",
            color: "success",
            duration: 3000
          });
        }
      }
      setTimeout(() => {
        setLoading(false);
        handleClick(PageType.Default);
      }, 200);
    }
  });

  if (loadCategories || loadProjects)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <IonGrid>
      <IonRow>
        <IonCol></IonCol>
        <IonCol size="12" size-md="6">
          <IonCard className="ion-padding-bottom">
            <IonCardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="my-6">
                  <DateComponent
                    name="entryDate"
                    label="Date"
                    value={convertoISO(formik.values.entryDate)}
                    touched={formik.touched.entryDate}
                    errorMessage={formik.errors.entryDate}
                    handleChange={e => formik.setFieldValue("entryDate", e.target.value || dateNow)}
                  />
                </div>
                <div className="my-6">
                  <IonGrid className="p-0 m-0">
                    <IonRow>
                      <IonCol className="p-0 m-0" size="12" size-md="6">
                        <InputComponent
                          name="price"
                          label="Amount"
                          type="number"
                          startAdor={true}
                          startAdorText="$"
                          value={formik.values.price.toString()}
                          touched={formik.touched.price}
                          errorMessage={formik.errors.price}
                          handleChange={formik.handleChange}
                        />
                      </IonCol>
                      <IonCol className="text-right" size="12" size-md="6">
                        <IonLabel>
                          Money {formik.values.expenditure ? "Spent" : "Received"}
                        </IonLabel>
                        <Switch
                          id="expenditure"
                          name="expenditure"
                          checked={formik.values.expenditure}
                          onChange={formik.handleChange}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
                <div className="my-6">
                  <IonGrid className="p-0 m-0">
                    <IonRow>
                      <IonCol className="p-0 m-0" size="12" size-md="6">
                        <SelectComponent
                          name="categoryId"
                          label="Category"
                          value={formik.values.categoryId}
                          touched={formik.touched.categoryId}
                          errorMessage={formik.errors.categoryId}
                          handleChange={formik.handleChange}
                          payload={categories || []}
                        />
                      </IonCol>
                      <IonCol className="text-right" size="12" size-md="6">
                        <IonLabel>
                          {formik.values.taxable ? "Included" : "Include"} in Tax Calculation
                        </IonLabel>
                        <Switch
                          id="taxable"
                          name="taxable"
                          checked={formik.values.taxable}
                          onChange={formik.handleChange}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
                <div className="my-6">
                  <AutoSelectComponent
                    name="projectId"
                    label="Project"
                    value={formik.values.projectId}
                    optional={true}
                    touched={formik.touched.projectId}
                    errorMessage={formik.errors.projectId}
                    handleChange={value => formik.setFieldValue("projectId", value)}
                    payload={projects || []}
                  />
                </div>
                <div className="my-6">
                  <InputComponent
                    name="notes"
                    label="Notes"
                    type="text"
                    optional={true}
                    value={formik.values.notes}
                    touched={formik.touched.notes}
                    errorMessage={formik.errors.notes}
                    handleChange={formik.handleChange}
                  />
                </div>
                <IonGrid>
                  <IonRow>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        id="id-submit-button"
                        size="small"
                        type="submit"
                        aria-hidden="false"
                        disabled={loading}>
                        <button type="submit" hidden />
                        {loading ? (
                          <IonSpinner name="lines-sharp-small"></IonSpinner>
                        ) : (
                          <IonIcon slot="start" icon={caretForwardOutline} />
                        )}
                        SUBMIT
                      </IonButton>
                    </IonCol>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        size="small"
                        color="light"
                        aria-hidden="false"
                        onClick={formik.handleReset}>
                        <IonIcon icon={refreshOutline} slot="start" />
                        RESET
                      </IonButton>
                    </IonCol>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        id="id-back-button"
                        size="small"
                        color="medium"
                        aria-hidden="false"
                        onClick={(e: any) => handleClick(PageType.Default)}>
                        <IonIcon icon={caretBackOutline} slot="start" />
                        BACK
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </form>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol></IonCol>
      </IonRow>
    </IonGrid>
  );
}
