import { useState } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { constants, helper, dateHelper } from "@/utils";
import { CrudType } from "@/utils/enums";
import { IExpense, IProject } from "@/models";
import { lookupService, expenseService } from "@/services";
import { InputField, DateField, SelectField, Icon, ToggleField } from "@/components";

type Props = {
  projects?: IProject[];
  expense?: IExpense;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function ExpensePage({ projects, expense, handleClose, handleNew, handleEdit }: Props) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      entryDate: expense?.entryDate || dateHelper.dateNow,
      projectId: expense?.projectId || String.empty,
      categoryId: expense?.categoryId || "FOOD",
      price: Math.abs(expense?.price || 0),
      expenditure: !(expense?.price && expense?.price > 0),
      notes: expense?.notes || String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      entryDate: Yup.date().required("required"),
      categoryId: Yup.string().required("required"),
      price: Yup.number()
        //.typeError("amount must be a number")
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
          price: helper.parsePrice(values?.expenditure, values?.price),
          notes: values?.notes,
          type: CrudType.Create
        };
        const res = await expenseService.upsertExpenseAsync(newExpense);
        if (res && !res?.success) {
          helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          helper.toastify("Created Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
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
          price: helper.parsePrice(values?.expenditure, values?.price),
          notes: values?.notes,
          type: CrudType.Update
        };
        const res = await expenseService.upsertExpenseAsync(updateExpense);
        if (res && !res?.success) {
          helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          helper.toastify("Updated Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
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
        <form onSubmit={formik.handleSubmit}>
          <div className="my-6">
            <ToggleField
              trueLabel="expense"
              falseLabel="income"
              value={formik.values.expenditure}
              exclusive={true}
              handleChange={(_, value: boolean) => formik.setFieldValue("expenditure", value)}
              color="secondary"
              size="medium"
            />
          </div>
          <div className="my-6">
            <DateField
              name="entryDate"
              label="Date"
              value={dateHelper.convertoISO(formik.values.entryDate)}
              touched={formik.touched.entryDate}
              errorMessage={formik.errors.entryDate}
              handleChange={e =>
                formik.setFieldValue("entryDate", e.target.value || dateHelper.dateNow)
              }
            />
          </div>
          <div className="my-6">
            <InputField
              name="price"
              label="Amount"
              type="number"
              fullWidth={false}
              startAdor={true}
              startAdorText="$"
              value={formik.values.price > 0 ? formik.values.price.toString() : String.empty}
              touched={formik.touched.price}
              errorMessage={formik.errors.price}
              handleChange={e => formik.setFieldValue("price", e.target.value)}
            />
          </div>
          <div className="my-6">
            <SelectField
              name="categoryId"
              label="Category"
              value={formik.values.categoryId}
              touched={formik.touched.categoryId}
              errorMessage={formik.errors.categoryId}
              handleChange={formik.handleChange}
              payload={lookupService.getCategories() || []}
            />
          </div>
          <div className="my-6">
            <InputField
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
            <SelectField
              name="projectId"
              label="Project"
              value={formik.values.projectId}
              optional={true}
              touched={formik.touched.projectId}
              errorMessage={formik.errors.projectId}
              handleChange={formik.handleChange}
              payload={projects || []}
            />
          </div>
          <div className="my-6">
            <IonButton
              id="id-submit-button"
              size="small"
              color="secondary"
              type="submit"
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
