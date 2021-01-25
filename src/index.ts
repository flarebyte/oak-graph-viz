interface TextStyle {

}

interface Rectangle {
  x: number;
  y:number;
  width: number;
  height: number;
}

interface Ellipse {
  cx: number;
  cy:number;
  rx: number;
  ry: number;
}

type Shape = Rectangle | Ellipse

interface TextElement {
  id: number;
  text: string;
  style: TextStyle;
}

interface AttributeElement {
  id: number;
  textElements: TextElement[];
}

interface Node {
  id: number;
  attributes: AttributeElement[];
  shape: Shape;
}

interface Edge  {
  id: number;
  fromNode: number;
  toNode: number;
  attributes: AttributeElement[];
  shape: Shape;
}

interface GraphElement {
  nodeList: Node[];
  edgeList: Edge[];
}

const parseAsGraph = (content: string): GraphElement => JSON.parse(content);

export { parseAsGraph };
