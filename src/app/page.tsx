import getComponents from "@/actions/get_components";
import Pipeline from "@/components/Pipeline";

export default async function Home() {
  const comps = await getComponents();

  return (
    <main className="p-8 min-h-screen flex">
      <Pipeline components={comps} />
    </main>
  );
}
