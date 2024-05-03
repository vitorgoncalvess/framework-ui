import { PipeComponent } from "@/utils/factories/componentFactory";
import React, { useState } from "react";

type Props = {
  object: PipeComponent;
};

const ObjectVizualizer = ({ object }: Props) => {
  const [obj, setObj] = useState<any>(object.data);

  object.callback = function () {
    setObj(object.data);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Objeto</h1>
      <div className="rounded border border-zinc-800 max-h-[400px] overflow-auto">
        {obj.value ? (
          Object.keys(obj.value).map((key) => (
            <ObjectKey key={key} _key={key} obj={obj.value} />
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
