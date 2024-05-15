import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Component } from "./componentsStore";
import dynamic from "next/dynamic";
import { PipeComponent, PipeComponentReq } from "@/utils/types/pipe_components";

enableMapSet();

export const genId = () => {
  return Math.random().toString().replace(".", "");
};

type ObjectStore = {
  cache: Record<string, any>;
  objects: Record<string, PipeComponent>;
  z: number;
  addNewObject: (obj: Component) => void;
  createLink: (id: string, id_2: string) => void;
  updateData: (id: string, data: Record<string, unknown>) => void;
  deleteObject: (id: string) => void;
  updatePos: (id: string, x: number, y: number) => void;
  copyObject: (id: string) => void;
  updateObjects: (objects: PipeComponentReq[]) => void;
};

const createObject = (obj: Component, z: number): PipeComponent => {
  return {
    id: genId(),
    x: 300,
    y: 300,
    z,
    path: obj.name,
    name: obj.config.name,
    component: null,
    data: obj.config.data,
    childNodes: new Set(),
    hasParents: false,
    input: obj.config.input || [],
    output: obj.config.output || null,
  };
};

const useObjectStore = create<ObjectStore>()(
  immer((set) => ({
    cache: {},
    objects: {},
    z: 0,
    addNewObject: (obj) =>
      set((state) => {
        const object = createObject(obj, state.z++);
        if (!state.cache[object.name]) {
          const Component = dynamic(
            () => import("@/components/pipe_components/" + object.path),
            {
              loading: () => (
                <div className="bg-zinc-700 w-[100px] h-1 rounded-full overflow-hidden">
                  <div className="comp-loading bg-white h-1 w-[20px] rounded-full"></div>
                </div>
              ),
            }
          );
          state.cache[object.name] = Component;
        }
        object.component = state.cache[object.name];
        state.objects[object.id] = object;
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

// eslint-disable-next-line react-hooks/rules-of-hooks

export default useObjectStore;

export { getObject, getObjects };
