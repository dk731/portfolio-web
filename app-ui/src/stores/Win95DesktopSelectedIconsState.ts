import { defineStore } from "pinia";

export const useDesktopSelectedIconsState = defineStore(
  "win95-desktop-selected-icons",
  {
    state: () => ({
      icons: [] as string[], // Array of selected desktop icons
    }),
    actions: {
      toggle(iconId: string) {
        if (this.icons.includes(iconId))
          this.icons = this.icons.filter((el) => el != iconId);
        else this.icons.push(iconId);
      },
      includes(iconId: string) {
        return this.icons.includes(iconId);
      },
      insert(iconId: string) {
        if (!this.includes(iconId)) this.icons.push(iconId);
      },
      remove(iconId: string) {
        this.icons = this.icons.filter((el) => el != iconId);
      },
    },
  }
);
