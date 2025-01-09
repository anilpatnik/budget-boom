import { IonApp, IonButton, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from "react-router-dom";

type Customer = {
  name: string;
  phone: number;
};

export const StartHere = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<Home customer={{ name: "John Deer", phone: 2145878945 }} />}
            />
            <Route path="test1" element={<Test1 />} />
            <Route path="test2" element={<Test2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
};

export const Layout = () => {
  const navigate = useNavigate();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center justify-center">
            <IonButton className="mx-3" onClick={() => navigate("/")}>
              Home
            </IonButton>
            <IonButton className="mx-3" onClick={() => navigate("test1")}>
              Test 1
            </IonButton>
            <IonButton className="mx-3" onClick={() => navigate("test2")}>
              Test 2
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <Outlet />
    </IonPage>
  );
};

export const Home = ({ customer }: { customer: Customer }) => {
  return (
    <IonContent>
      <div className="my-10 text-center text-2xl">Home Page</div>
      <div className="text-center">
        <div className="my-3 font-bold">{customer.name}</div>
        <div className="my-3">{customer.phone}</div>
      </div>
    </IonContent>
  );
};

export const Test1 = () => {
  return (
    <IonContent>
      <div className="my-10 text-center text-2xl">Test 1 Page</div>
    </IonContent>
  );
};

export const Test2 = () => {
  return (
    <IonContent>
      <div className="my-10 text-center text-2xl">Test 2 Page</div>
    </IonContent>
  );
};
