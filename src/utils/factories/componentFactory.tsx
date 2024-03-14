import JsonVizualizerComp from "@/components/JsonVizualizerComp";
import RequisicaoComp from "@/components/RequisicaoComp";
import { Component } from "../models/components";

const componentFactory = () => {
  const createNewComponent = (comp: Component) => {
    switch (comp.id.toLowerCase()) {
      case "req": {
        return {
          x: "45px",
          y: "45px",
          component: <RequisicaoComp />,
        };
      }
      case "json-vizualizer": {
        return {
          x: "45px",
          y: "45px",
          component: <JsonVizualizerComp />,
        };
      }
    }
  };

  return {
    createNewComponent,
  };
};

export default componentFactory;
