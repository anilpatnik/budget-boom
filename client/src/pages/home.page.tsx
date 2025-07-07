import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonSpinner,
  IonCardTitle,
  IonButton
} from "@ionic/react";
import {
  Shield,
  CheckCircle,
  FolderOpen,
  PlusCircle,
  Check,
  Tag,
  Utensils,
  Car,
  Gamepad2,
  Target,
  DollarSign,
  ChartLine,
  Globe,
  Mail,
  Lock
} from "lucide-react";
import { constants, NavType, RoleType } from "@/util";
import { useStore } from "@/contexts";
import { Icon } from "@/components";

export function RootPage() {
  const hasMounted = useRef(false);
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    setLoading(true);
    // fetchData();
    if (user.auth && user.role === RoleType.Admin) {
      setTimeout(() => (window.location.href = NavType.Profile), constants.DELAY);
    } else if (user.auth) {
      setTimeout(() => (window.location.href = NavType.Expenses), constants.DELAY);
    } else setTimeout(() => setLoading(false), constants.DELAY);
  }, []);

  if (loading) return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  return (
    <div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <img
              alt={String.empty}
              src={constants.LOGO_IMG}
              height="64px"
              width="64px"
              loading="lazy"
            />
          </div>
          <div className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            The smart and easy way to manage your budget, track expenses, and achieve your financial
            goals with our intuitive Budgetezy tool. Perfect for personal use and project management
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-24">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Person using expense management software"
            className="w-full rounded-2xl shadow-2xl"
          />
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
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
              <div className="text-gray-600">
                Quickly log your expenses with date, amount, and category
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize Projects</h3>
              <div className="text-gray-600">
                Group expenses by projects and set budgets to stay on track
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartLine className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
              <div className="text-gray-600">
                Get insights with reports to understand spending patterns
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
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
                  <PlusCircle className="w-8 h-8 text-blue-600" />
                </div>
                <IonCardTitle className="text-xl">Expense Tracking</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="space-y-4 my-3">
                <div className="text-base	text-gray-600">
                  Add expense, amount, date, and categorise transactions effortlessly
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Quick transaction entry
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Categorisation
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Project assignment
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <IonCardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-purple-600" />
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
                    <Utensils className="w-6 h-6 text-orange-600 mb-1" />
                    <span className="text-xs text-gray-600">Food</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <Car className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs text-gray-600">Travel</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-green-600 mb-1" />
                    <span className="text-xs text-gray-600">Fun</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <IonCardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <IonCardTitle className="text-xl">Project Budgets</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="space-y-4 my-3">
                <div className="text-base	text-gray-600 mb-6">
                  Create custom projects, set budgets, and track spending to stay on target with
                  your goals
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
                  <Globe className="w-8 h-8 text-indigo-600" />
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
                    <span className="text-2xl">JP</span>
                    <span className="font-medium">¥</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <IonCardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <IonCardTitle className="text-xl">Secure Authentication</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="space-y-4 my-3">
                <div className="text-base	text-gray-600 mb-6">
                  Multiple authentication options to keep your financial data safe
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500 mr-2" />
                    Email and password login
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="logo-google" css="w-4 h-4 text-red-500 mr-2" />
                    Gmail integration
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-yellow-500 mr-2" />
                    Password recovery
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <IonCardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartLine className="w-8 h-8 text-yellow-600" />
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

        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <div className="max-w-md mx-auto">
            <div className="text-lg mb-6">
              Join thousands of users who trust Budgetezy to manage their finances effortlessly
            </div>
            <div className="mb-6">
              <IonButton color="warning" fill="solid" shape="round" href={NavType.SignUp}>
                Sign Up Now
              </IonButton>
            </div>
            <div className="text-lg mb-6">Already have an account?</div>
            <div>
              <IonButton color="light" fill="solid" shape="round" href={NavType.SignIn}>
                Sign In
              </IonButton>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} APP DIGITAL PTY LTD
        </div>
      </div>
    </div>
  );
}
