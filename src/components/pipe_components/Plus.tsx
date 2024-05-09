import React from "react";
import useObjectStore, { getObject } from "@/store/objectsStore";

type Props = {
  id: string;
};

const Plus = ({ id }: Props) => {
  const obj = useObjectStore(getObject(id));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-medium">Plus</h1>
      <h2>Result</h2>
      <div className="border border-bd-base h-8 w-36 rounded flex items-center p-2">
        {JSON.stringify(obj.data.value)}
      </div>
    </div>
  );
};

export default Plus;
