import { useNavigate } from "react-router-dom";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";
import { Icon } from "@/components";

const colorMap: Record<string, string> = {
  users: "text-red-500",
  expenses: "text-green-500",
  projects: "text-blue-500",
  report: "text-yellow-500",
  "my profile": "text-purple-500",
  logout: "text-pink-500"
};

const tabsConfig = (role: RoleType = RoleType.User) => {
  const commonTabs = [
    {
      label: "My Profile",
      path: NavType.Profile,
      icon: "person-outline"
    },
    {
      label: "Logout",
      path: NavType.SignOut,
      icon: "lock-closed-outline"
    }
  ];
  if (role === RoleType.Admin) {
    return [
      {
        label: "Users",
        path: NavType.Users,
        icon: "people-outline"
      },
      ...commonTabs
    ];
  }
  if (role === RoleType.User) {
    return [
      {
        label: "Expenses",
        path: NavType.Expenses,
        icon: "cash-outline"
      },
      {
        label: "Projects",
        path: NavType.Projects,
        icon: "library-outline"
      },
      {
        label: "Report",
        path: NavType.Report,
        icon: "bar-chart-outline"
      },
      ...commonTabs
    ];
  }
  return commonTabs;
};

export function TabMenu() {
  const { user } = useStore();
  const navigate = useNavigate();

  if (!user?.auth) return null;
  // tabs to display for auth
  const activePath = location.pathname;
  const tabs = tabsConfig(user.role);
  const handleMenuClick = (url: string) => navigate(url, { replace: true });
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-md ion-hide-md-up h-16">
      <div className="flex justify-around items-center h-full">
        {tabs.map(tab => {
          const key = tab.label.toLowerCase();
          const colorClass = "text-gray-500";
          const isActive = activePath === tab.path;
          return (
            <button
              type="button"
              key={tab.path}
              onClick={() => handleMenuClick(tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-4 text-sm ${
                isActive ? "font-semibold text-indigo-700" : String.empty
              } ${colorClass}`}>
              <span className="text-xl">
                <Icon name={tab.icon} />
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
