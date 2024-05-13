export type PipeComponent = {
  id: string;
  x: number;
  y: number;
  z: number;
  path: string;
  name: string;
  component: (({ id }: { id: string }) => React.JSX.Element) | null;
  data: {
    type: string;
  } & any;
  childNodes: Set<string>;
  hasParents: boolean;
  input: string[];
  output: string | null;
};

export type PipeComponentReq = {
  id: string;
  data: any;
  is_root: boolean;
  childNodes: string[];
};
