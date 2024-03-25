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
  {
    id: "value",
    name: "Valor",
    description: "Objeto que irá armazerar um valor.",
    image: null,
  },
  {
    id: "plus",
    name: "Somar",
    description: "Somar uma entrada com um valor, ou duas entradas.",
    image: null,
  },
];

export default components;
