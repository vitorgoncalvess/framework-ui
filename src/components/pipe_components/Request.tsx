"use client";

import useDebounceState from "@/hooks/useDebouceState";
import useObjectStore, { getObject } from "@/store/objectsStore";

type Props = {
  id: string;
};

export const config = {
  name: "Requisição",
  description: "Realizar requisições atraves de endpoints",
  type: "req",
  data: {
    url: "",
    method: "GET",
    headers: {},
  },
  output: "RESPONSE",
};

const Request = ({ id }: Props) => {
  const obj = useObjectStore(getObject(id));
  const updateFn = useObjectStore((state) => state.updateData);
  const [state, updateState] = useDebounceState(obj, (state) => {
    updateFn(id, state.data);
  });

  return (
    <div className="flex flex-col gap-4">
      <header className="flex gap-2">
        <select
          className="bg-transparent border p-2 border-zinc-900 font-medium rounded"
          name=""
          id=""
          onChange={({ target }) =>
            updateState({
              ...state,
              data: { ...state.data, method: target.value },
            })
          }
          value={state?.data?.method}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          onChange={({ target }) =>
            updateState({
              ...state,
              data: { ...state.data, url: target.value },
            })
          }
          placeholder="http://localhost:3000"
          className="rounded-sm bg-black border border-zinc-900 p-2"
          type="text"
          value={state?.data?.url || ""}
        />
      </header>
    </div>
  );
};

export default Request;
