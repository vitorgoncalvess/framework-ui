"use client";

import useObjectStore, { getObject } from "@/store/objectsStore";
import React, { useState } from "react";

type Props = {
  id: string;
};

export const config = {
  name: "Visualizador de Objeto",
  description: "Visualizar objetos em uma forma mais organizada e limpa.",
  type: "json-vizualizer",
  data: {
    value: {},
  },
  input: ["RESPONSE", "OBJECT"],
};

const ObjectVizualizer = ({ id }: Props) => {
  const obj = useObjectStore(getObject(id));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Objeto</h1>
      <div className="rounded border border-zinc-800 max-h-[400px] overflow-auto">
        {obj.data.value ? (
          Object.keys(obj.data.value).map((key) => (
            <ObjectKey key={key} _key={key} obj={obj.data.value} />
          ))
        ) : (
          <div className="opacity-60 text-sm p-2">Nenhum objeto recebido</div>
        )}
      </div>
    </div>
  );
};

type ObjectProps = {
  _key: string;
  obj: any;
};

const ObjectKey = ({ _key, obj }: ObjectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  if (typeof obj[_key] === "object" && obj[_key]) {
    return (
      <>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex gap-2 p-2 border-t border-zinc-700 first-of-type:border-t-0  text-xs cursor-pointer ${
            isOpen && "border-b"
          }`}
          key={_key}
        >
          <span className="font-medium flex gap-2">
            <span className="font-medium">{_key}</span>
            <span className="opacity-50">
              {isOpen ? "..." : Array.isArray(obj[_key]) ? "[...]" : "{...}"}
            </span>
          </span>
        </div>
        {isOpen && (
          <div className="border-l border-zinc-600 ml-2">
            {Object.keys(obj[_key]).map((key) => (
              <ObjectKey key={key} _key={key} obj={obj[_key]} />
            ))}
          </div>
        )}
      </>
    );
  } else
    return (
      <div
        className="flex gap-2 p-2 border-t border-zinc-700 first-of-type:border-0 text-xs"
        key={_key}
      >
        <span className="font-medium">{_key}</span>
        <span>{obj[_key] || <div className="opacity-60">null</div>}</span>
      </div>
    );
};

export default ObjectVizualizer;
