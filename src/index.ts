interface StylistParam {
  id: number;
  name: string;
  defaults: number[];
  minItems: number;
  maxItems: number;
}

interface StylistParamValue {
  paramId: number;
  values: number[];
}

interface Stylist {
  id: number;
  name: string;
  version: string;
  paramIds: number[];
}

interface Style {
  stylistId: number;
  values: StylistParamValue[];
}

interface Point {
  x: number;
  y: number;
}

interface Anchor {
  point: Point;
}

interface Rectangle {
  point: Point;
  width: number;
  height: number;
}

interface Ellipse {
  center: Point;
  rx: number;
  ry: number;
}

type Shape = Rectangle | Ellipse;

interface TextElement {
  id: number;
  text: string;
  outline: Rectangle;
  styleId: number;
}

interface Block {
  id: number;
  textElements: TextElement[];
  outline: Rectangle;
  styleId: number;
}

interface Section {
  id: number;
  blocks: Block[];
  outline: Shape;
  anchors: Anchor[];
  styleId: number;
}

interface Node {
  id: number;
  section: Section;
}

interface Edge {
  id: number;
  fromNode: number;
  toNode: number;
  fromNodeAnchor: number;
  toNodeAnchor: number;
  blocks: Block[];
  outline: Shape;
  anchors: Anchor[];
  styleId: number;
}

interface Explanation {
  id: number;
  blocks: Block[];
  outline: Shape;
  anchors: Anchor[];
  styleId: number;
}

interface GraphFrame {
  page: number;
  outline: Shape;
  anchors: Anchor[];
  styleId: number;
}

interface GraphElement {
  stylistParams: StylistParam[];
  stylists: Stylist[];
  styles: Style[];
  explanations: Explanation[];
  nodes: Node[];
  edges: Edge[];
  frames: GraphFrame[];
}

const parseAsGraph = (content: string): GraphElement => JSON.parse(content);

export { parseAsGraph };
