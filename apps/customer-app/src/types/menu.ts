export type OptionType = "radio" | "checkbox";

export interface MenuOption {
  id: number;
  optionName: string;
  optionType: OptionType;
  extraPrice: number;
  groupName?: string; // เช่น "ระดับความหวาน", "เพิ่มท็อปปิ้ง"
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  available: boolean;
  options: MenuOption[];
}

export interface Category {
  id: number;
  name: string;
}