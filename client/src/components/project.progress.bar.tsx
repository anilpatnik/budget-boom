import { formatPrice } from "@/util";

type ProgressBar = {
  startdate?: string;
  endate?: string;
  actual?: number;
  budget?: number;
  countryId?: string;
  currency?: string;
  inactive?: boolean;
};

type Props = {
  payload: ProgressBar;
};

export function ProjectProgressBar({ payload }: Props) {
  // project due date calc
  const now = new Date();
  const startDate = payload.startdate ? new Date(payload.startdate) : now;
  const endDate = payload.endate ? new Date(payload.endate) : now;
  const msInDay = 1000 * 60 * 60 * 24;
  const baseDate = startDate > now ? startDate : now;
  const remainingDays = Math.round((endDate.getTime() - baseDate.getTime()) / msInDay);
  const remainingDaysLabel =
    remainingDays === 0
      ? "Ends today"
      : remainingDays < 0
      ? `${Math.abs(remainingDays)} day(s) overdue`
      : `${remainingDays} day(s) remaining`;

  // project spending calc
  const actual = payload.actual ?? 0;
  const budget = payload.budget ?? 0;
  const moneySpent = actual - budget;
  const percentageUsed = budget === 0 ? 0 : (actual / budget) * 100;
  const progressBarWidth = Math.min(percentageUsed, 100); // clamp to 100%
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {!payload.inactive && <span>{remainingDaysLabel} |</span>}
          <span className={moneySpent < 0 ? "text-green-700 ml-2" : "text-red-700 ml-2"}>
            {formatPrice(moneySpent || 0, payload.countryId, payload.currency)}
          </span>
        </span>
        <span className="text-sm">{percentageUsed.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${percentageUsed > 100 ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${progressBarWidth}%` }}></div>
      </div>
      <div className="flex justify-between">
        <span className="text-indigo-700">
          <span className="text-neutral-700 mr-2">Spent</span>
          {formatPrice(actual || 0, payload.countryId, payload.currency)}
        </span>
        <span className="text-cyan-700">
          <span className="text-neutral-700 mr-2">Budget</span>
          {formatPrice(budget || 0, payload.countryId, payload.currency)}
        </span>
      </div>
    </div>
  );
}
