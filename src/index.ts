interface NumberLike {
  name: string;
  minimum: number;
  maximum: number;
}

interface Structure {
  id: number;
  items: NumberLike[];
}

interface FeatureDef {
  id: number;
  name: string;
  structureId: number;
  minItems: number;
  maxItems: number;
}

interface Feature {
  featureDefId: number;
  values: number[];
}

interface Stylist {
  id: number;
  name: string;
  version: string;
  featureDefIds: number[];
}

interface Style {
  id: number;
  stylistId: number;
  features: Feature[];
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
  features: Feature[];
}

interface Relationship {
  id: number;
  fromElementId: number;
  toElementId: number;
  fromAnchorId: number;
  toAnchorId: number;
}

interface GraphView {
  id: number;
  outline: Shape;
}

interface VisualGraph {
  texts: TextLike[];
  layers: Layer[];
  structures: Structure[];
  featureDefs: FeatureDef[];
  stylists: Stylist[];
  styles: Style[];
  elements: Element[];
  relationships: Relationship[];
  views: GraphView[];
}

const parseAsGraph = (content: string): VisualGraph => JSON.parse(content);

class FeatureBuilder {
  features: Feature[] = [];
  add(param: FeatureDef, values: number[]) {
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
    const feature: Feature = {
      featureDefId: param.id,
      values: values,
    };
    this.features.push(feature);
    return this;
  }
  add1(param: FeatureDef, value: number) {
    return this.add(param, [value]);
  }
  add2(param: FeatureDef, value1: number, value2: number) {
    return this.add(param, [value1, value2]);
  }
  asFeatureList(): Feature[] {
    return this.features;
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
  featureDefIdCounter: number = 0;
  stylistIdCounter: number = 0;
  styleIdCounter: number = 0;
  textElementIdCounter: number = 0;
  blockIdCounter: number = 0;
  entityIdCounter: number = 0;
  VisualGraph: VisualGraph = {
    texts: [],
    params: [],
    stylists: [],
    styles: [],
    elements: [],
    relationships: [],
    views: [],
  };

  createFeatureDef(
    name: string,
    defaults: number[],
    minItems: number,
    maxItems: number
  ): FeatureDef {
    const param: FeatureDef = {
      id: this.featureDefIdCounter++,
      name,
      defaults,
      minItems,
      maxItems,
    };
    this.VisualGraph.params.push(param);
    return param;
  }

  createStylist(
    name: string,
    version: string,
    params: FeatureDef[]
  ): Stylist {
    const sylist: Stylist = {
      id: this.stylistIdCounter++,
      name,
      version,
      featureDefIds: params.map(p => p.id),
    };
    this.VisualGraph.stylists.push(sylist);
    return sylist;
  }

  createStyle(stylist: Stylist, values: Feature[]): Style {
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

export { parseAsGraph, FeatureBuilder, GraphBuilder };
