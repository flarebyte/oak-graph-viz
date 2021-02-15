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

type ColorValue = HSLAColor | RGBAColor;

interface Color {
  id: number;
  name: string;
  value: ColorValue;
}

interface Point {
  x: number;
  y: number;
}

interface TextLike {
  id: number;
  text: string;
}

interface Prefix {
  name: string;
  value: string;
  purpose: string;
}

interface ResourceLink {
  id: number;
  value: string;
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
  fromAnchor: Point;
  toAnchor: Point;
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
  prefixes: Prefix[];
  resourceLinks: ResourceLink[];
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
  textIdCounter: number = 0;
  layerIdCounter: number = 0;
  aspectIdCounter: number = 0;
  blendingIdCounter: number = 0;
  colorIdCounter: number = 0;
  resourceLinkIdCounter: number = 0;
  elementIdCounter: number = 0;
  relationshipIdCounter: number = 0;
  viewIdCounter: number = 0;
  visualGraph: VisualGraph = {
    texts: [],
    layers: [],
    aspects: [],
    featureDefs: [],
    stylists: [],
    styles: [],
    blendings: [],
    colors: [],
    prefixes: [],
    resourceLinks: [],
    elements: [],
    relationships: [],
    views: [],
  };

  createFeatureDef(
    name: string,
    minItems: number,
    maxItems: number,
    minimum: number,
    maximum: number
  ): FeatureDef {
    const param: FeatureDef = {
      id: this.featureDefIdCounter++,
      name,
      minItems,
      maxItems,
      minimum,
      maximum,
    };
    this.visualGraph.featureDefs.push(param);
    return param;
  }

  createStylist(name: string, version: string, params: FeatureDef[]): Stylist {
    const sylist: Stylist = {
      id: this.stylistIdCounter++,
      name,
      version,
      featureDefIds: params.map(p => p.id),
    };
    this.visualGraph.stylists.push(sylist);
    return sylist;
  }

  createStyle(stylist: Stylist, features: Feature[]): Style {
    const style: Style = {
      id: this.styleIdCounter++,
      stylistId: stylist.id,
      features,
    };
    this.visualGraph.styles.push(style);
    return style;
  }

  createText(text: string): TextLike {
    const textLike: TextLike = {
      id: this.textIdCounter++,
      text,
    };
    this.visualGraph.texts.push(textLike);
    return textLike;
  }

  createLayer(name: string): Layer {
    const layer: Layer = {
      id: this.layerIdCounter++,
      name,
    };
    this.visualGraph.layers.push(layer);
    return layer;
  }
  createAspect(name: string): Aspect {
    const aspect: Aspect = {
      id: this.aspectIdCounter++,
      name,
    };
    this.visualGraph.aspects.push(aspect);
    return aspect;
  }
  createBlending(name: string): Blending {
    const blending: Blending = {
      id: this.blendingIdCounter++,
      name,
    };
    this.visualGraph.blendings.push(blending);
    return blending;
  }
  createColor(name: string, value: ColorValue): Color {
    const color: Color = {
      id: this.colorIdCounter++,
      name,
      value,
    };
    this.visualGraph.colors.push(color);
    return color;
  }

  addPrefix(name: string, value: string, purpose: string): Prefix {
    const prefix: Prefix = {
      name,
      value,
      purpose,
    };
    this.visualGraph.prefixes.push(prefix);
    return prefix;
  }

  addResourceLink(value: string): ResourceLink {
    const resLink: ResourceLink = {
      id: this.resourceLinkIdCounter++,
      value,
    };
    this.visualGraph.resourceLinks.push(resLink);
    return resLink;
  }

  addRelationship(
    from: Element,
    to: Element,
    fromAnchor: Point,
    toAnchor: Point
  ): Relationship {
    const relationship: Relationship = {
      id: this.relationshipIdCounter++,
      fromElementId: from.id,
      toElementId: to.id,
      fromAnchor,
      toAnchor,
    };
    this.visualGraph.relationships.push(relationship);
    return relationship;
  }
  addElement(element: Element) {
    this.visualGraph.elements.push(element);
    return element;
  }
  addView(topRight: Point, bottomLeft: Point, pageRatio: number) {
    const view: GraphView = {
      id: this.viewIdCounter++,
      topRight,
      bottomLeft,
      pageRatio,
    };
    this.visualGraph.views.push(view);
    return view;
  }
}

class ElementBuilder {
  graphBuilder: GraphBuilder;
  element: Element;
  constructor(graphBuilder: GraphBuilder) {
    this.graphBuilder = graphBuilder;
    this.element = {
      id: this.graphBuilder.elementIdCounter++,
      center: { x: 0, y: 0 },
      outline: [],
      anchors: [],
      styleId: 0,
      layerId: 0,
      aspectIds: [],
      blendingId: 0,
      entityId: 0,
      features: [],
    };
  }
  setCenter(point: Point) {
    this.element.center = point;
    return this;
  }
  addOutlinePoint(point: Point) {
    this.element.outline.push(point);
    return this;
  }
  addAnchor(point: Point) {
    this.element.anchors.push(point);
    return this;
  }
  setStyle(style: Style) {
    this.element.styleId = style.id;
    return this;
  }
  setLayer(layer: Layer) {
    this.element.layerId = layer.id;
    return this;
  }
  setBlending(blending: Blending) {
    this.element.blendingId = blending.id;
    return this;
  }
  setEntityId(entityId: number) {
    this.element.entityId = entityId;
    return this;
  }
  addAspect(aspect: Aspect) {
    this.element.aspectIds.push(aspect.id);
    return this;
  }
  addFeature(featureDef: FeatureDef, values: number[]) {
    this.element.features.push({ defId: featureDef.id, values });
    return this;
  }
  asElement(): Element {
    return this.element;
  }
}

export { parseAsGraph, FeatureBuilder, GraphBuilder, ElementBuilder };
