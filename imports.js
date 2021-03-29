import _AttrVal     from "./data/web-data/html/valueSets.json";
import _GlobalAttr  from "./data/web-data/html/htmlGlobalAttributes.json";
import _HtmlTags    from "./data/web-data/html/htmlTags.json";
import _AriaAttr    from "./data/web-data/html/ariaSpec.json";
import _AriaAttrVal from "./data/web-data/html/ariaData.json";

/** @type {readonly { name: string, values: { name: string, description?: { kind: string, value: string } }[] }[]} */
export const AttrVal = Object.freeze(_AttrVal);

/** @type {readonly { name: string, description?: string, valueSet?: string }[]} */
export const GlobalAttr = Object.freeze(_GlobalAttr);

/** */
export const HtmlTags = Object.freeze(_HtmlTags);

/** */
export const AriaAttr = Object.freeze(_AriaAttr);

/** @type {readonly { name: string, valueSet?: string }[]} */
export const AriaAttrVal = Object.freeze(_AriaAttrVal);