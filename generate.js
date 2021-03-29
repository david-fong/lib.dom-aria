"use strict";
import fs from "fs";
import url from "url";
import path from "path";
import {
	AttrVal,
	GlobalAttr,
	AriaAttr,
	AriaAttrVal,
} from "./imports.js";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const NEEDS_GLOBAL_ATTR = ["contextmenu", "dropzone", "exportparts", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "part"];

Object.freeze(AttrVal);
Object.freeze(AriaAttr);
Object.freeze(AriaAttrVal);


/** Makes sure the payload can't break out of the wrapping comment block */
const _RegExp_Deprecated = /[dD]eprecated/;
function docStringify(/**@type {string}*/content, /**@type {{deprecated?: boolean}}*/options = {}) {
	if (!content) { return "" }
	let depStr = !content.includes("@deprecated") && (options.deprecated || _RegExp_Deprecated.test(content))
		? "@deprecated"
		: "";
	return `/** ${content.replace(/\*\//g, "\*/")} ${depStr} */`;
}

// TODO: specifically override setAttribute with the deprecation annotation for those that are deprecated.

const valueSetDtsStr = `
/** @internal */
interface HtmlAttributeValues {
	${AttrVal.map((desc) => {
		return `${desc.name}: ` + desc.values.map((val) => `"${val.name}"`).join(" | ") + ";";
	}).join("\n\t")}
}`;


const ariaAttrDoc = new Map(AriaAttr.map((spec) => [spec.name, spec.description]));
const ariaAttrVal = new Map(AriaAttrVal.map((data) => [data.name, data.valueSet]));
const ariaDtsStr = `
/** Aria Attributes */
interface HtmlAriaAttributeMap {
	${[...ariaAttrDoc.keys()].map((name) => {
		const type = ariaAttrVal.get(name);
		return `"${name}": ${type ? `HtmlAttributeValues["${type}"]` : "string"};`;
	}).join("\n\t")}
}

/** */
interface Element {
	/** */
	setAttribute<K extends keyof HtmlAriaAttributeMap>(qualifiedName: K, value: HtmlAriaAttributeMap[K]): void;
}`;


const dtsStr = `
/// <reference lib="DOM"/>
/// <reference no-default-lib="true"/>
${valueSetDtsStr}
${ariaDtsStr}
`;

fs.writeFileSync(
	path.resolve(__dirname, "./lib.dom-attributes.d.ts"),
	dtsStr,
);