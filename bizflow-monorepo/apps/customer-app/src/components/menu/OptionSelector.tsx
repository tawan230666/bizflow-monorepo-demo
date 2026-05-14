import type { MenuOption } from "@/types/menu";
import { formatPriceShort } from "@/utils/formatPrice";

interface Props {
  options: MenuOption[];
  selected: MenuOption[];
  onChange: (selected: MenuOption[]) => void;
}

export const OptionSelector = ({ options, selected, onChange }: Props) => {
  // จัดกลุ่มตาม groupName
  const groups = options.reduce<Record<string, MenuOption[]>>((acc, opt) => {
    const key = opt.groupName || "ตัวเลือกเพิ่มเติม";
    (acc[key] ||= []).push(opt);
    return acc;
  }, {});

  const isSelected = (id: number) => selected.some((s) => s.id === id);

  const toggle = (opt: MenuOption, groupOpts: MenuOption[]) => {
    if (opt.optionType === "radio") {
      // ลบ option อื่นในกลุ่มเดียวกัน
      const filtered = selected.filter(
        (s) => !groupOpts.some((g) => g.id === s.id),
      );
      onChange([...filtered, opt]);
    } else {
      onChange(
        isSelected(opt.id)
          ? selected.filter((s) => s.id !== opt.id)
          : [...selected, opt],
      );
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([groupName, groupOpts]) => (
        <div key={groupName}>
          <h4 className="font-medium text-stone-900 mb-2">{groupName}</h4>
          <div className="space-y-2">
            {groupOpts.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:border-amber-400"
              >
                <div className="flex items-center gap-3">
                  <input
                    type={opt.optionType}
                    checked={isSelected(opt.id)}
                    onChange={() => toggle(opt, groupOpts)}
                    className="accent-amber-600"
                  />
                  <span className="text-sm">{opt.optionName}</span>
                </div>
                {opt.extraPrice > 0 && (
                  <span className="text-sm text-stone-500">
                    +{formatPriceShort(opt.extraPrice)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
