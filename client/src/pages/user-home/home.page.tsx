import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonLoading
} from "@ionic/react";
import { constants, helper } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { authService, fbService, lookupService } from "@/services";
import { useStore } from "@/contexts";
import { Icon, LucideIcon } from "@/components";
import { Footer } from "@/layouts";

export function HomePage() {
  const { setAuth } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    let success = false;
    try {
      setLoading(true);
      const res = await authService.signInWithGoogle();
      success = res?.success;
      if (res?.success) {
        const fbUser = fbService.firebaseAuth.currentUser;
        setAuth(prev => ({
          ...prev,
          external: true,
          auth: fbUser?.emailVerified || false,
          name: fbUser?.displayName || String.empty,
          photo: fbUser?.photoURL || String.empty,
          role: res?.resource?.role || RoleType.User,
          countryId: res?.resource?.countryId,
          currency: lookupService.getCountry(res?.resource?.countryId ?? navigator.language)?.code
        }));
      } else {
        if (res?.resource) helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
      }
    } finally {
      setTimeout(() => {
        if (success) navigate(NavType.Root, { replace: true });
        setLoading(false);
      }, constants.DELAY);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <div className="flex justify-center items-center mb-8">
          <img
            alt={String.empty}
            src={constants.LOGO_IMG}
            height="128px"
            width="128px"
            loading="lazy"
          />
        </div>
        <div className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          The smart and easy way to manage your budget, track expenses, and achieve your financial
          goals with our intuitive My Budget Easy tool. Perfect for personal use and project
          management
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto mb-24">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Person using expense management software"
          className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/50 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <div className="max-w-md">
            <div className="text-lg mb-6">
              Join thousands of users who trust
              <span className="font-semibold mx-1">My Budget Easy</span>to manage their finances
              effortlessly
            </div>
            <div>
              <IonButton
                type="button"
                color="warning"
                className="google-button"
                onClick={handleLogin}>
                <Icon name="logo-google" slot="start" css="mr-3" /> Continue with Google
              </IonButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, intuitive workflow to manage your expenses in just a few steps
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="DollarSign" css="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
            <div className="text-gray-600">
              Quickly log your expenses with date, amount, and category
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="FolderOpen" css="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize Projects</h3>
            <div className="text-gray-600">
              Group expenses by projects and set budgets to stay on track
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="ChartLine" css="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
            <div className="text-gray-600">
              Get insights with reports to understand spending patterns
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="CheckCircle" css="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
            <div className="text-gray-600">
              Make informed financial decisions with real-time tracking
            </div>
          </div>
        </div>
      </div>

      <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <div className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your expenses efficiently
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="PlusCircle" css="w-8 h-8 text-blue-600" />
              </div>
              <IonCardTitle className="text-xl">Expense Tracking</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600">
                Add expense, amount, date, and categorise transactions effortlessly
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <LucideIcon name="Check" css="w-4 h-4 text-green-500 mr-2" />
                  Quick transaction entry
                </div>
                <div className="flex items-center text-gray-600">
                  <LucideIcon name="Check" css="w-4 h-4 text-green-500 mr-2" />
                  Categorisation
                </div>
                <div className="flex items-center text-gray-600">
                  <LucideIcon name="Check" css="w-4 h-4 text-green-500 mr-2" />
                  Project assignment
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="Tag" css="w-8 h-8 text-purple-600" />
              </div>
              <IonCardTitle className="text-xl">Smart Categories</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600 mb-6">
                Predefined categories with matching icons make organising expenses intuitive and
                visual
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
                  <LucideIcon name="Utensils" css="w-6 h-6 text-orange-600 mb-1" />
                  <span className="text-xs text-gray-600">Dining</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                  <LucideIcon name="Car" css="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs text-gray-600">Vehicle</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                  <LucideIcon name="ShoppingCart" css="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-xs text-gray-600">Groceries</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="Target" css="w-8 h-8 text-green-600" />
              </div>
              <IonCardTitle className="text-xl">Project Budgets</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600 mb-6">
                Create custom projects, set budgets, and track spending to stay on target with your
                goals
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Holiday Budget</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$680 spent</span>
                  <span>$1000 budget</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="Globe" css="w-8 h-8 text-indigo-600" />
              </div>
              <IonCardTitle className="text-xl">Currency Support</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600 mb-6">
                Set your country in your profile and the currency symbol updates across the app
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-medium">$</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇪🇺</span>
                  <span className="font-medium">€</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🇯🇵</span>
                  <span className="font-medium">¥</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="Shield" css="w-8 h-8 text-red-600" />
              </div>
              <IonCardTitle className="text-xl">Secure Authentication</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600 mb-6">
                Secure and seamless authentication powered by your Google account
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <LucideIcon name="Mail" css="w-4 h-4 text-blue-500 mr-2" />
                  One-click sign-in with Google
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Icon name="logo-google" css="w-4 h-4 text-red-500 mr-2" />
                  OAuth-based secure authentication
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <LucideIcon name="Lock" css="w-4 h-4 text-yellow-500 mr-2" />
                  No password storage or management
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <IonCardHeader>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="ChartLine" css="w-8 h-8 text-yellow-600" />
              </div>
              <IonCardTitle className="text-xl">Visual Analytics</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="space-y-4 my-3">
              <div className="text-base	text-gray-600 mb-6">
                Reports help you understand your spending patterns and stay on track
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Month</span>
                  <span className="text-gray-900 font-medium">$1,245</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget Used</span>
                  <span className="text-green-600 font-medium">62%</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </div>
      <Footer />
      <IonLoading
        isOpen={loading || false}
        spinner="circles"
        message="Loading..."
        showBackdrop={loading || false}
        translucent={loading || false}
      />
    </div>
  );
}
