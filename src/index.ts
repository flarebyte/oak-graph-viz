interface FeatureDef {
  id: number;
  name: string;
  minimum: number;
  maximum: number;
  minItems: number;
  maxItems: number;
}

interface Feature {
  defId: number;
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

interface Aspect {
  id: number;
  name: string;
}

interface Blending {
  id: number;
  name: string;
}

interface HSLAColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

type ColorValue = HSLAColor | RGBAColor

interface Color {
  id: number;
  name: string;
  value: ColorValue
}

interface Point {
  x: number;
  y: number;
}

interface TextLike {
  id: number;
  text: string;
}

interface Element {
  id: number;
  center: Point;
  outline: Point[];
  anchors: Point[];
  styleId: number;
  layerId: number;
  aspectIds: number[];
  blendingId: number;
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
  topRight: Point;
  bottomLeft: Point;
  pageRatio: number;
}

interface VisualGraph {
  texts: TextLike[];
  layers: Layer[];
  aspects: Aspect[];
  blendings: Blending[];
  colors: Color[];
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
      defId: param.id,
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

class GraphBuilder {
  featureDefIdCounter: number = 0;
  stylistIdCounter: number = 0;
  styleIdCounter: number = 0;
  textElementIdCounter: number = 0;
  blockIdCounter: number = 0;
  entityIdCounter: number = 0;
  VisualGraph: VisualGraph = {
    texts: [],
    layers: [],
    aspects: [],
    featureDefs: [],
    stylists: [],
    styles: [],
    blendings: [],
    colors: [],
    elements: [],
    relationships: [],
    views: [],
  };

  createFeatureDef(
    name: string,
    minItems: number,
    maxItems: number,
    minimum: number,
    maximum: number,
  ): FeatureDef {
    const param: FeatureDef = {
      id: this.featureDefIdCounter++,
      name,
      minItems,
      maxItems,
      minimum,
      maximum
    };
    this.VisualGraph.featureDefs.push(param);
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

  createStyle(stylist: Stylist, features: Feature[]): Style {
    const style: Style = {
      id: this.styleIdCounter++,
      stylistId: stylist.id,
      features,
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
