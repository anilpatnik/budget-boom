import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { LazyLoading } from "@/components";
import { NavType, PageType, CrudType } from "@/util";
import { ICategory, Category } from "@/models";
import { CategoryPage } from "./category.page";
import { CategoriesPage } from "./categories.page";

type categoryState = {
  pageType: PageType;
  category?: ICategory;
};
const categoryStateInit: categoryState = {
  pageType: PageType.Default,
  category: Category
};
export function CategoriesHomePage() {
  const [categoryState, setCategoryState] = useState(categoryStateInit);
  const navigate = useNavigate();
  const handleClick = (pageType: PageType, category?: ICategory) => {
    if (pageType === PageType.Default) {
      setCategoryState(prev => ({ ...prev, pageType, category: Category }));
    } else {
      setCategoryState(prev => ({ ...prev, pageType, category }));
    }
  };
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.Root)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb
          onClick={() => navigate(`${NavType.Categories}${NavType.NotFound}`)}
          className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Categories
        </IonBreadcrumb>
        {categoryState.category?.type !== CrudType.Read && (
          <IonBreadcrumb>
            <IonIcon slot="separator" /> {categoryState.category?.name || "New Category"}
          </IonBreadcrumb>
        )}
      </IonBreadcrumbs>
      {categoryState.pageType === PageType.Step1 && (
        <LazyLoading>
          <CategoryPage category={categoryState.category} handleClick={handleClick} />
        </LazyLoading>
      )}
      {categoryState.pageType === PageType.Default && <CategoriesPage handleClick={handleClick} />}
    </>
  );
}
