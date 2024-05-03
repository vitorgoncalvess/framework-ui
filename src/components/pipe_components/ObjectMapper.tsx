import { PipeComponent } from "@/utils/factories/componentFactory";
import React, { useEffect, useState } from "react";

type Props = {
  object: PipeComponent;
};

const ObjectMapper = ({ object }: Props) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  object.callback = function () {
    setKeys(object.data.keys);
    setSelectedKeys(object.data.selectedKeys);
  };

  useEffect(() => {
    setKeys(object.data.keys);
    setSelectedKeys(object.data.keys);
  }, [object]);

  const handleKey = (key: string) => {
    let new_keys = [];
    if (selectedKeys.includes(key)) {
      new_keys = selectedKeys.filter((ac_key) => ac_key !== key);
    } else {
      new_keys = [...keys, key];
    }
    setSelectedKeys(new_keys);
    object.data.selectedKeys = new_keys;
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Objeto Mapeado</h1>
      <ul className="grid grid-cols-2 gap-2 overflow-auto max-h-[200px]">
        {keys.map((key) => {
          const bool = selectedKeys.includes(key);
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
