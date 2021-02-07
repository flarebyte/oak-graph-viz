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
  id: number;
  stylistId: number;
  values: StylistParamValue[];
}

interface Layer {
  id: number;
  name: string;
}

interface Point {
  x: number;
  y: number;
}

interface withPoints {
  points: Point[];
}

interface Polygon extends withPoints {}

interface Ellipse extends withPoints {
  center: Point;
  rx: number;
  ry: number;
}

type Shape = Polygon | Ellipse;

interface TextLike {
  id: number;
  text: string;
}

interface Element {
  id: number;
  outline: Shape;
  anchors: Point[];
  styleId: number;
  layerId: number;
  entityId: number;
  values: StylistParamValue[];
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
  outline: Shape;
  anchors: Point[];
  styleId: number;
}

interface VisualGraph {
  texts: TextLike[];
  layers: Layer[];
  stylistParams: StylistParam[];
  stylists: Stylist[];
  styles: Style[];
  elements: Element[];
  relationships: Relationship[];
  views: GraphView[];
}

const parseAsGraph = (content: string): VisualGraph => JSON.parse(content);

class ParamValueBuilder {
  paramValues: StylistParamValue[] = [];
  add(param: StylistParam, values: number[]) {
    const length = values.length;
    if (values.length < param.minItems) {
      throw new Error(
        `${param.name} ${param.id} should have at least ${param.minItems} values but got ${length}`
      );
    }
    if (values.length > param.maxItems) {
      throw new Error(
        `${param.name} ${param.id} should have no more than ${param.maxItems} values but got ${length}`
      );
    }
    const stylistParamValue: StylistParamValue = {
      paramId: param.id,
      values: values,
    };
    this.paramValues.push(stylistParamValue);
    return this;
  }
  add1(param: StylistParam, value: number) {
    return this.add(param, [value]);
  }
  add2(param: StylistParam, value1: number, value2: number) {
    return this.add(param, [value1, value2]);
  }
  asStylistParamValueList(): StylistParamValue[] {
    return this.paramValues;
  }
}

class ShapeBuilder {
  createPoint(x: number, y: number): Point {
    return { x, y };
  }
  createRectangle(point: Point, width: number, height: number): Rectangle {
    return { point, width, height };
  }
  createEllipse(center: Point, rx: number, ry: number): Ellipse {
    return { center, rx, ry };
  }
}

const shapeBuilder = new ShapeBuilder();
const noShape: Rectangle = shapeBuilder.createRectangle(
  shapeBuilder.createPoint(0, 0),
  0,
  0
);

class GraphBuilder {
  stylistParamIdCounter: number = 0;
  stylistIdCounter: number = 0;
  styleIdCounter: number = 0;
  textElementIdCounter: number = 0;
  blockIdCounter: number = 0;
  entityIdCounter: number = 0;
  VisualGraph: VisualGraph = {
    texts: [],
    stylistParams: [],
    stylists: [],
    styles: [],
    elements: [],
    relationships: [],
    views: [],
  };

  createStylistParam(
    name: string,
    defaults: number[],
    minItems: number,
    maxItems: number
  ): StylistParam {
    const param: StylistParam = {
      id: this.stylistParamIdCounter++,
      name,
      defaults,
      minItems,
      maxItems,
    };
    this.VisualGraph.stylistParams.push(param);
    return param;
  }

  createStylist(
    name: string,
    version: string,
    params: StylistParam[]
  ): Stylist {
    const sylist: Stylist = {
      id: this.stylistIdCounter++,
      name,
      version,
      paramIds: params.map(p => p.id),
    };
    this.VisualGraph.stylists.push(sylist);
    return sylist;
  }

  createStyle(stylist: Stylist, values: StylistParamValue[]): Style {
    const style: Style = {
      id: this.styleIdCounter++,
      stylistId: stylist.id,
      values,
    };
    this.VisualGraph.styles.push(style);
    return style;
  }
}

class ElementBuilder {
  graphBuilder: GraphBuilder;
  constructor(graphBuilder: GraphBuilder) {
    this.graphBuilder = graphBuilder;
  }
}

export { parseAsGraph, ParamValueBuilder, GraphBuilder };
