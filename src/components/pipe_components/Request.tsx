import useObjectStore, { getObject } from "@/store/objectsStore";

type Props = {
  id: string;
};

const Request = ({ id }: Props) => {
  const obj = useObjectStore(getObject(id));
  const updateObject = useObjectStore((state) => state.updateData);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex gap-2">
        <select
          className="bg-transparent border p-2 border-zinc-900 font-medium rounded"
          name=""
          id=""
          onChange={({ target }) => updateObject(id, { method: target.value })}
          value={obj?.data?.method}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          onChange={({ target }) => updateObject(id, { url: target.value })}
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
