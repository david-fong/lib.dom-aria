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

const valueSetDtsStr = `
/** */
interface Val {
	${AttrVal.map((desc) => {
		return `${desc.name}: ` + desc.values.map((val) => `"${val.name}"`).join(" | ") + ";";
	}).join("\n\t")}
}`;


const ariaAttrVal = new Map(AriaAttrVal.map((data) => [data.name, data.valueSet]));
const ariaDtsStr = `
/** */
interface Attributes {
	${AriaAttr.filter((desc) => !desc.description.includes("Deprecated")).map((desc) => {
		const type = ariaAttrVal.get(desc.name);
		return `"${desc.name}": ${type ? `Val["${type}"]` : "string"};`;
	}).join("\n\t")}
}

/** */
interface DeprecatedAttributes {
	${AriaAttr.filter((desc) => desc.description.includes("Deprecated")).map((desc) => {
		const type = ariaAttrVal.get(desc.name);
		return `"${desc.name}": ${type ? `Val["${type}"]` : "string"};`;
	}).join("\n\t")}
}

/** */
interface Element {
	hasAttribute<K extends keyof Attributes>(qualifiedName: K): boolean;
	setAttribute<K extends keyof Attributes>(qualifiedName: K, value: Attributes[K]): void;
    toggleAttribute<K extends keyof Attributes>(qualifiedName: K, force?: boolean): boolean;
	removeAttribute<K extends keyof Attributes>(qualifiedName: K): void;

	/** @deprecated */ hasAttribute<K extends keyof DeprecatedAttributes>(qualifiedName: K): boolean;
	/** @deprecated */ setAttribute<K extends keyof DeprecatedAttributes>(qualifiedName: K, value: DeprecatedAttributes[K]): void;
    /** @deprecated */ toggleAttribute<K extends keyof DeprecatedAttributes>(qualifiedName: K, force?: boolean): boolean;
	/** @deprecated */ removeAttribute<K extends keyof DeprecatedAttributes>(qualifiedName: K): void;
}`;


const dtsStr = `
/// <reference lib="DOM"/>
/// <reference no-default-lib="true"/>
${valueSetDtsStr}
${ariaDtsStr}
`;

fs.writeFileSync(
	path.resolve(__dirname, "dist/lib.dom-attributes.d.ts"),
	dtsStr,
);