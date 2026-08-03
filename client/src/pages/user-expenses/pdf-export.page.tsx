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
import { dateHelper, pdfHelper, helper } from "@/utils";
import { IExpenseSearch } from "@/models";
import { DateField, Icon } from "@/components";
import { expenseService } from "@/services";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { formatISO } from "date-fns";
import { useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";

type Props = {
  countryId: string;
  currency: string;
  handleClose: () => void;
};

export function ExpensePDFExportPage({ countryId, currency, handleClose }: Props) {
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
      endDate: defaultEndDate,
      isTaxable: undefined as boolean | undefined
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

  const handleExportPDF = async (values: { startDate: string; endDate: string; isTaxable?: boolean }) => {
    setIsGenerating(true);
    try {
      // Fetch individual expense records from API for the selected date range
      const searchPayload: IExpenseSearch = {
        startDate: values.startDate,
        endDate: values.endDate,
        isTaxable: values.isTaxable,
        skip: false,
        size: 1000
      };

      const response = await expenseService.getExpensesAsync(searchPayload);
      const fetchedExpenses = response?.data ?? [];

      // Sort by date for better organization
      const sortedExpenses = [...fetchedExpenses].sort((a, b) => {
        const dateA = new Date(a.entryDate || "").getTime();
        const dateB = new Date(b.entryDate || "").getTime();
        return dateA - dateB;
      });

      pdfHelper.generateExpensePDF({
        expenses: sortedExpenses,
        startDate: values.startDate,
        endDate: values.endDate,
        countryId,
        currency,
        isTaxable: values.isTaxable
      });

      handleClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
      helper.toastify("Error generating PDF. Please try again.", "error", 3000);
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
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isTaxable === true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue("isTaxable", true);
                    } else {
                      formik.setFieldValue("isTaxable", undefined);
                    }
                  }}
                  color="primary"
                />
              }
              label="Tax Related (if checked, include only tax expenses in PDF)"
            />
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
                    endDate: defaultEndDate,
                    isTaxable: undefined
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
