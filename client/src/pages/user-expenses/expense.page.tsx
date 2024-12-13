import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonPage,
  IonRow,
  IonToolbar,
  useIonToast
} from "@ionic/react";
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CrudType, constants, convertoISO, dateNow, parsePrice } from "@/util";
import { IExpense, IProject } from "@/models";
import { categories, getCategory, upsertExpenseAsync } from "@/services";
import {
  InputComponent,
  DateComponent,
  SelectComponent,
  AutoSelectComponent,
  Icon
} from "@/components";

type ComponentProps = {
  projects?: IProject[];
  expense?: IExpense;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function ExpensePage({
  projects,
  expense,
  handleClose,
  handleNew,
  handleEdit
}: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      entryDate: expense?.entryDate || dateNow,
      projectId: expense?.projectId || String.empty,
      categoryId: expense?.categoryId || getCategory(String.empty).id,
      price: Math.abs(expense?.price || 0),
      expenditure: !(expense?.price && expense?.price > 0),
      taxable: expense?.taxable || false,
      notes: expense?.notes || String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      entryDate: Yup.date().required("required"),
      categoryId: Yup.string().required("required"),
      price: Yup.number()
        .typeError("amount must be a number")
        .positive("amount should be greater than zero")
        .test("is-decimal", "amount should be two decimals", (val: any) => {
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
          projectId: values?.projectId,
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
            color: constants.DANGER,
            duration: constants.FAILURE_DELAY
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Created Successfully",
            color: constants.SUCCESS,
            duration: constants.SUCCESS_DELAY
          });
          setTimeout(() => {
            const xExpense = { ...newExpense, id: res?.resource?.id };
            handleNew(xExpense);
            setLoading(false);
          }, constants.DELAY);
        }
      } else {
        const updateExpense: IExpense = {
          id: expense?.id,
          entryDate: values?.entryDate,
          projectId: values?.projectId,
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
            color: constants.DANGER,
            duration: constants.FAILURE_DELAY
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Updated Successfully",
            color: constants.SUCCESS,
            duration: constants.SUCCESS_DELAY
          });
          setTimeout(() => {
            handleEdit(updateExpense);
            setLoading(false);
          }, constants.DELAY);
        }
      }
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              id="id-back-button"
              onClick={() => handleClose()}
              onDoubleClick={() => handleClose()}>
              <Icon name="caret-back-outline" />
              BACK
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form>
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
                    startAdor={true}
                    startAdorText="$"
                    value={formik.values.price.toString()}
                    touched={formik.touched.price}
                    errorMessage={formik.errors.price}
                    handleChange={formik.handleChange}
                  />
                </IonCol>
                <IonCol className="text-right" size="12" size-md="6">
                  <IonLabel>Money {formik.values.expenditure ? "Spent" : "Received"}</IonLabel>
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
          <div className="my-6">
            <IonButton
              id="id-submit-button"
              size="small"
              color="secondary"
              onClick={() => formik.handleSubmit()}
              onDoubleClick={() => handleClose()}
              disabled={loading}>
              {loading ? (
                <Icon name="sync-sharp" css="icon-spinner" slot="start" />
              ) : (
                <Icon name="caret-forward-sharp" slot="start" />
              )}
              SUBMIT
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={formik.handleReset}
              onDoubleClick={() => handleClose()}>
              <Icon name="refresh-sharp" slot="start" />
              RESET
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
}
