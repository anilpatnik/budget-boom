import { useState } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CrudType, constants, convertoISO, dateAdd, parsePrice, toastify } from "@/util";
import { IProject } from "@/models";
import { upsertProjectAsync } from "@/services";
import { InputComponent, DateComponent, Icon } from "@/components";

type ComponentProps = {
  project?: IProject;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function ProjectPage({ project, handleClose, handleNew, handleEdit }: ComponentProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: project?.name || String.empty,
      budget: Math.abs(project?.budget || 0),
      startDate: project?.startDate || dateAdd(1),
      endDate: project?.endDate || dateAdd(30)
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
          budget: parsePrice(false, values?.budget),
          actual: project?.actual,
          startDate: values?.startDate,
          endDate: values?.endDate,
          type: CrudType.Create
        };
        const res = await upsertProjectAsync(newProject);
        if (res && !res?.success) {
          toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          toastify("Created Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
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
          budget: parsePrice(false, values?.budget),
          actual: project?.actual,
          startDate: values?.startDate,
          endDate: values?.endDate,
          type: CrudType.Update
        };
        const res = await upsertProjectAsync(updateProject);
        if (res && !res?.success) {
          toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          toastify("Updated Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
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
            <InputComponent
              name="name"
              label="Name"
              type="text"
              value={formik.values.name}
              touched={formik.touched.name}
              errorMessage={formik.errors.name}
              handleChange={formik.handleChange}
            />
          </div>
          <div className="my-6">
            <InputComponent
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
            />
          </div>
          <div className="my-6 flex items-center">
            <div>
              <DateComponent
                name="startDate"
                label="Start Date"
                value={convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e => formik.setFieldValue("startDate", e.target.value || dateAdd(1))}
              />
            </div>
            <div className="ml-10">
              <DateComponent
                name="endDate"
                label="End Date"
                value={convertoISO(formik.values.endDate)}
                touched={formik.touched.endDate}
                errorMessage={formik.errors.endDate}
                handleChange={e => formik.setFieldValue("endDate", e.target.value || dateAdd(30))}
              />
            </div>
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
