import { create } from "zustand";

export type Component = {
  name: string;
  config: any;
};

type Store = {
  components: Component[];
  setComponents: (comps: Component[]) => void;
};

const useComponentsStore = create<Store>((set) => ({
  components: [],
  setComponents: (comps) => set({ components: comps }),
}));

export default useComponentsStore;
