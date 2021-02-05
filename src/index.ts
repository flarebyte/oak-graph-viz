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

interface ExactStylistParamValue {
  param: StylistParam;
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
  ExplanationEntity,
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

class GraphBuilder {
  stylistParamIdCounter: number = 0;
  stylistIdCounter: number = 0;
  graphElement: GraphElement = {
    stylistParams: [],
    stylists: [],
    styles: [],
    entities: [],
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
    this.graphElement.stylistParams.push(param);
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
    this.graphElement.stylists.push(sylist);
    return sylist;
  }

  createStyle(stylist: Stylist, values: StylistParamValue[]): Style {
    const style: Style = {
      stylistId: stylist.id,
      values,
    };
    this.graphElement.styles.push(style);
    return style;
  }

  createStylistParamValues(prm: ExactStylistParamValue): StylistParamValue {
    const length = prm.values.length;
    if (prm.values.length < prm.param.minItems) {
      throw new Error(
        `${prm.param.name} ${prm.param.id} should have at least ${prm.param.minItems} values but got ${length}`
      );
    }
    if (prm.values.length > prm.param.maxItems) {
      throw new Error(
        `${prm.param.name} ${prm.param.id} should have no more than ${prm.param.maxItems} values but got ${length}`
      );
    }
    const stylistParamValue: StylistParamValue = {
      paramId: prm.param.id,
      values: prm.values,
    };
    return stylistParamValue;
  }

  createStylistParamValueList(
    params: { param: StylistParam; values: number[] }[]
  ): StylistParamValue[] {
    return params.map(this.createStylistParamValues);
  }
}

export { parseAsGraph, GraphBuilder };
