import { getItem, setItem } from "@gbeata/utils";
import { create } from "zustand";

import { StorageEnum } from "./types/enum";

type MenusType = Record<string, any>[];
type SettingStore = {
  menuList: MenusType;
  isCollapse: boolean;
  actions: {
    setMenuList: (settings: MenusType) => void;
    updateCollapse: (settings: boolean) => void;
  };
};

const useMenuStore = create<SettingStore>((set) => ({
  menuList: getItem<MenusType>(StorageEnum.Menu) || [],
  isCollapse: true,
  actions: {
    setMenuList: (menuList: MenusType) => {
      set({ menuList });
      setItem(StorageEnum.Menu, menuList);
    },
    updateCollapse: (isCollapse: boolean) => {
      set({ isCollapse });
    },
  },
}));

export const useMenus = () => useMenuStore((state) => state.menuList);
export const useMenuActions = () => useMenuStore((state) => state.actions);
export default useMenuStore;
