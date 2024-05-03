import { PipeComponent } from "@/utils/factories/componentFactory";
import { useEffect, useState } from "react";

type Props = {
  object: PipeComponent;
};

type InputData = {
  url?: string;
  method?: string;
  headers?: any;
};

const Request = ({ object }: Props) => {
  const [obj, setObj] = useState<PipeComponent>();

  useEffect(() => {
    setObj(object);
  }, [object]);

  const handleChange = (value: InputData) => {
    object.data = { ...object.data, ...value };
    setObj((obj) => ({ ...obj, ...object }));
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex gap-2">
        <select
          className="bg-transparent border p-2 border-zinc-900 font-medium rounded"
          name=""
          id=""
          onChange={({ target }) => handleChange({ method: target.value })}
          value={obj?.data?.method}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          onChange={({ target }) => handleChange({ url: target.value })}
          placeholder="http://localhost:3000"
          className="rounded-sm bg-black border border-zinc-900 p-2"
          type="text"
          value={obj?.data?.url || ""}
        />
      </header>
    </div>
  );
};

export default Request;
