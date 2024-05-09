import {
  PipeComponent,
  PipeComponentReq,
  genId,
} from "@/utils/factories/componentFactory";
import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

enableMapSet();

type ObjectStore = {
  objects: Record<string, PipeComponent>;
  z: number;
  addNewObject: (obj: PipeComponent) => void;
  createLink: (id: string, id_2: string) => void;
  updateData: (id: string, data: Record<string, unknown>) => void;
  deleteObject: (id: string) => void;
  updatePos: (id: string, x: number, y: number) => void;
  copyObject: (id: string) => void;
  updateObjects: (objects: PipeComponentReq[]) => void;
};

const useObjectStore = create<ObjectStore>()(
  immer((set) => ({
    objects: {},
    z: 0,
    addNewObject: (obj) =>
      set((state) => {
        state.objects[obj.id] = obj;
      }),
    createLink: (id, id_2) =>
      set((state) => {
        state.objects[id].childNodes.add(state.objects[id_2].id);
        state.objects[id_2].hasParents = true;
      }),
    updateData: (id, data) =>
      set((state) => {
        state.objects[id].data = { ...state.objects[id].data, ...data };
      }),
    deleteObject: (id: string) =>
      set((state) => {
        delete state.objects[id];
      }),
    updatePos: (id, x, y) =>
      set((state) => {
        state.objects[id].x = x;
        state.objects[id].y = y;
        state.objects[id].z = state.z++;
      }),
    copyObject: (id) =>
      set((state) => {
        const newObject = { ...state.objects[id] };
        newObject.x += 20;
        newObject.y += 20;
        newObject.z = state.z++;
        newObject.id = genId();
        state.objects[newObject.id] = newObject;
      }),
    updateObjects: (objects: PipeComponentReq[]) =>
      set((state) => {
        objects.forEach((obj) => {
          state.objects[obj.id].data = obj.data;
        });
      }),
  }))
);

const getObject = (id: string) => (state: ObjectStore) => state.objects[id];

const getObjectsByKey = () => (state: ObjectStore) =>
  Object.keys(state.objects).map((key) => state.objects[key]);

// eslint-disable-next-line react-hooks/rules-of-hooks
const getObjects = () => useObjectStore(getObjectsByKey());

export default useObjectStore;

export { getObject, getObjects };
