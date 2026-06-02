import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABEL } from "@/utils/constants";

const STAGES: OrderStatus[] = ["pending", "cooking", "served", "paid"];

interface Props {
  current: OrderStatus;
}

export const OrderTimeline = ({ current }: Props) => {
  const currentIdx = STAGES.indexOf(current);

  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="flex justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-amber-600 -z-0 transition-all"
          style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
        />
        {STAGES.map((stage, idx) => {
          const reached = idx <= currentIdx;
          return (
            <div
              key={stage}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  reached
                    ? "bg-amber-600 text-white"
                    : "bg-stone-200 text-stone-400"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-xs mt-2 ${
                  reached ? "text-stone-900 font-medium" : "text-stone-400"
                }`}
              >
                {ORDER_STATUS_LABEL[stage]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
