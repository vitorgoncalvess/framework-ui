export type Component = {
  id: string;
  name: string;
  description: string;
  image: string | null;
};

const components: Component[] = [
  {
    id: "req",
    name: "Requisição",
    description: "Realizar requisições atraves de endpoints",
    image: null,
  },
  {
    id: "json-vizualizer",
    name: "Formatador de JSON",
    description: "Vizualizar JSONs em uma forma mais organizada e limpa.",
    image: null,
  },
];

export default components;
