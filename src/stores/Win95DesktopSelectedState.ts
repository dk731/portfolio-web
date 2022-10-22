import { defineStore } from "pinia";

export const useDesktopSelectedIcons = defineStore("desktop-selected-icons", {
  state: () => ({
    selectedIcons: [] as string[],
  }),
  actions: {
    toggle(iconId: string) {
      if (this.selectedIcons.includes(iconId))
        this.selectedIcons = this.selectedIcons.filter((el) => el != iconId);
      else this.selectedIcons.push(iconId);
    },
    includes(iconId: string) {
      return this.selectedIcons.includes(iconId);
    },
    insert(iconId: string) {
      if (!this.includes(iconId)) this.selectedIcons.push(iconId);
    },
    remove(iconId: string) {
      this.selectedIcons = this.selectedIcons.filter((el) => el != iconId);
    },
  },
});
