"use client";

import useObjectStore, { getObject } from "@/store/objectsStore";
import React from "react";

type Props = {
  id: string;
};

export const config = {
  name: "Mapeador de objetos",
  description: "Depois eu penso",
  data: {
    keys: [],
    selectedKeys: [],
  },
  input: ["OBJECT", "RESPONSE"],
  output: "OBJECT",
};

const ObjectMapper = ({ id }: Props) => {
  const obj = useObjectStore(getObject(id));
  const updateData = useObjectStore((store) => store.updateData);

  console.log("render")

  const handleKey = (key: string) => {
    let selectedKeys = [];
    if (obj.data.selectedKeys.includes(key)) {
      selectedKeys = obj.data.selectedKeys.filter(
        (ac_key: string) => ac_key !== key
      );
    } else {
      selectedKeys = [...obj.data.selectedKeys, key];
    }
    updateData(obj.id, { selectedKeys });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Objeto Mapeado</h1>
      <ul className="grid grid-cols-2 gap-2 overflow-auto max-h-[200px]">
        {obj.data.keys.map((key: string) => {
          const bool = obj.data.selectedKeys.includes(key);
          return (
            <li key={key}>
              <div
                onClick={() => handleKey(key)}
                className={`flex cursor-pointer items-center justify-between border border-zinc-700 p-2 text-xs rounded gap-2 ${
                  !bool && "opacity-50"
                }`}
              >
                <h1 className="font-medium">{key}</h1>
                <button className="border border-zinc-700 h-6 w-6 flex items-center justify-center rounded">
                  {bool && "X"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ObjectMapper;
