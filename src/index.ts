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

interface Group {
  id: number;
  outline: Shape;
  anchors: Anchor[];
  styleId: number;
}

enum EntityKind {
  NodeEntity,
  EdgeEntity,
  ExplanationEntity
}
interface Entity {
  id: number;
  group: Group;
  blocks: Block[];
  kind: EntityKind;
}


interface Relationship {
  id: number;
  fromEntityId: number;
  toEntityId: number;
  fromAnchorId: number;
  toAnchorId: number;
}

interface GraphView {
  id: number;
  group: Group;
}

interface GraphElement {
  stylistParams: StylistParam[];
  stylists: Stylist[];
  styles: Style[];
  entities: Entity[];
  relationships: Relationship[];
  views: GraphView[];
}

const parseAsGraph = (content: string): GraphElement => JSON.parse(content);

export { parseAsGraph };
