import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar,
  IonSpinner
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dateHelper, pdfHelper } from "@/utils";
import { IExpense } from "@/models";
import { DateField, Icon } from "@/components";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { formatISO } from "date-fns";
import { useState } from "react";

type Props = {
  expenses: IExpense[];
  countryId: string;
  currency: string;
  handleClose: () => void;
};

export function ExpensePDFExportPage({ expenses, countryId, currency, handleClose }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate previous month's start and end dates
  const previousMonth = subMonths(new Date(), 1);
  const defaultStartDate = formatISO(startOfMonth(previousMonth), {
    representation: "date"
  });
  const defaultEndDate = formatISO(endOfMonth(previousMonth), {
    representation: "date"
  });

  const formik = useFormik({
    initialValues: {
      startDate: defaultStartDate,
      endDate: defaultEndDate
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      startDate: Yup.date().required("Start Date is required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End Date should not be less than Start Date")
        .required("End Date is required")
    }),
    onSubmit: async values => {
      handleExportPDF(values);
    }
  });

  const handleExportPDF = async (values: { startDate: string; endDate: string }) => {
    setIsGenerating(true);
    try {
      // Filter expenses by date range
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.entryDate || "");
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);
        endDate.setHours(23, 59, 59, 999); // Include entire end date
        return expenseDate >= startDate && expenseDate <= endDate;
      });

      pdfHelper.generateExpensePDF({
        expenses: filteredExpenses,
        startDate: values.startDate,
        endDate: values.endDate,
        countryId,
        currency
      });

      handleClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <div className="my-6 flex items-center">
            <div>
              <DateField
                name="startDate"
                label="Start Date"
                value={dateHelper.convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e =>
                  formik.setFieldValue("startDate", e.target.value || defaultStartDate)
                }
              />
            </div>
            <div className="ml-10">
              <DateField
                name="endDate"
                label="End Date"
                value={dateHelper.convertoISO(formik.values.endDate)}
                touched={formik.touched.endDate}
                errorMessage={formik.errors.endDate}
                handleChange={e =>
                  formik.setFieldValue("endDate", e.target.value || defaultEndDate)
                }
              />
            </div>
          </div>

          <div className="my-6">
            <IonButton
              id="id-export-button"
              size="small"
              color="secondary"
              type="submit"
              disabled={isGenerating || !formik.isValid}>
              {isGenerating ? (
                <>
                  <IonSpinner name="lines-sharp-small" slot="start" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <Icon name="download-sharp" slot="start" css="mr-1" />
                  DOWNLOAD PDF
                </>
              )}
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={() =>
                formik.resetForm({
                  values: {
                    startDate: defaultStartDate,
                    endDate: defaultEndDate
                  }
                })
              }
              disabled={isGenerating}
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
