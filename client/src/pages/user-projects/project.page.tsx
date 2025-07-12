import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { constants, helper, dateHelper } from "@/utils";
import { CrudType } from "@/utils/enums";
import { IProject } from "@/models";
import { projectService } from "@/services";
import { InputField, DateField, Icon } from "@/components";
import { Switch } from "@mui/material";

type Props = {
  project?: IProject;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function ProjectPage({ project, handleClose, handleNew, handleEdit }: Props) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: project?.name || String.empty,
      budget: Math.abs(project?.budget || 0),
      startDate: project?.startDate || dateHelper.monthStart,
      endDate: project?.endDate || dateHelper.monthEnd,
      inactive: project?.inactive || false
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      budget: Yup.number()
        //.typeError("budget must be a number")
        .min(0, "budget should be zero or greater")
        .test("is-decimal", "budget should be two decimals", (val: any) => {
          if (val) return constants.TWO_DECIMAL_PATTERN.test(val);
          return true;
        })
        .notRequired(),
      startDate: Yup.date().notRequired(),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date should not be less than Start date")
        .notRequired()
    }),
    onSubmit: async values => {
      setLoading(true);
      if (project?.id?.length === 0) {
        const newProject: IProject = {
          id: crypto.randomUUID(),
          name: values?.name,
          prevName: project?.prevName,
          budget: helper.parsePrice(false, values?.budget),
          actual: project?.actual,
          startDate: values?.startDate,
          endDate: values?.endDate,
          inactive: values?.inactive,
          type: CrudType.Create
        };
        const res = await projectService.upsertProjectAsync(newProject);
        if (res && !res?.success) {
          toast.error(res?.resource, {
            duration: constants.FAILURE_DELAY,
            position: "bottom-center"
          });
          setLoading(false);
          return;
        } else {
          helper.toastify("Created Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
          setTimeout(() => {
            const xProject = { ...newProject, id: res?.resource?.id };
            handleNew(xProject);
            setLoading(false);
          }, constants.DELAY);
        }
      } else {
        const updateProject: IProject = {
          id: project?.id,
          name: values?.name,
          prevName: project?.name,
          budget: helper.parsePrice(false, values?.budget),
          actual: project?.actual,
          startDate: values?.startDate,
          endDate: values?.endDate,
          inactive: values?.inactive,
          type: CrudType.Update
        };
        const res = await projectService.upsertProjectAsync(updateProject);
        if (res && !res?.success) {
          toast.error(res?.resource, {
            duration: constants.FAILURE_DELAY,
            position: "bottom-center"
          });
          setLoading(false);
          return;
        } else {
          helper.toastify("Updated Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
          setTimeout(() => {
            handleEdit(updateProject);
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
            <InputField
              name="name"
              label="Project Name"
              type="text"
              value={formik.values.name}
              touched={formik.touched.name}
              errorMessage={formik.errors.name}
              handleChange={formik.handleChange}
            />
            <p className="text-sm text-zinc-500">
              House Renovation, My Birthday Party, Bangkok Holiday
            </p>
          </div>
          <div className="my-6">
            <InputField
              name="budget"
              label="Budget"
              type="number"
              startAdor={true}
              startAdorText="$"
              value={formik.values.budget > 0 ? formik.values.budget.toString() : String.empty}
              touched={formik.touched.budget}
              errorMessage={formik.errors.budget}
              handleChange={e => formik.setFieldValue("budget", e.target.value)}
              optional={true}
              fullWidth={false}
            />
          </div>
          <div className="my-6 flex items-center">
            <div>
              <DateField
                name="startDate"
                label="Start Date"
                value={dateHelper.convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e =>
                  formik.setFieldValue("startDate", e.target.value || dateHelper.monthStart)
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
                  formik.setFieldValue("endDate", e.target.value || dateHelper.monthEnd)
                }
              />
            </div>
          </div>
          <div className="my-6">
            <IonLabel class="text-sm text-gray-700">Completed</IonLabel>
            <Switch
              id="inactive"
              name="inactive"
              checked={formik.values.inactive}
              onChange={formik.handleChange}
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
      <Toaster />
    </IonPage>
  );
}
