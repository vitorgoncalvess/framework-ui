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
          input: [],
          output: "REQ_RESPONSE",
        };
      }
      case "json-vizualizer": {
        return {
          x: "45px",
          y: "45px",
          component: <JsonVizualizerComp />,
          input: ["REQ_RESPONSE", "JSON"],
          output: null,
        };
      }
    }
  };

  return {
    createNewComponent,
  };
};

export default componentFactory;
