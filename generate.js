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
function kebab2camel(/**@type {string}*/kebab) {
	return kebab.replace(/([-_][a-zA-Z])/g, ($1) => $1[1].toUpperCase());
}

const valueSetDtsStr = `
/** */
interface Val {
	${AttrVal.map((desc) => {
		return `${desc.name}: ` + desc.values.map((val) => `"${val.name}"`).join(" | ") + ";";
	}).join("\n\t")}
}`;


const ariaAttrVal = new Map(AriaAttrVal.map((data) => [data.name, data.valueSet]));
ariaAttrVal.set("role", "roles")
const ariaDtsStr = `
/** */
interface AriaAttr {
	${AriaAttr.filter((desc) => !desc.description.includes("Deprecated")).map((desc) => {
		const type = ariaAttrVal.get(desc.name);
		return `"${desc.name}": ${type ? `Val["${type}"]` : "string"};`;
	}).join("\n\t")}
}

/** */
interface DepdAriaAttr {
	${AriaAttr.filter((desc) => desc.description.includes("Deprecated")).map((desc) => {
		const type = ariaAttrVal.get(desc.name);
		return `"${desc.name}": ${type ? `Val["${type}"]` : "string"};`;
	}).join("\n\t")}
}

/** */
interface Element {
	hasAttribute<K extends keyof AriaAttr>(qualifiedName: K): boolean;
	setAttribute<K extends keyof AriaAttr>(qualifiedName: K, value: AriaAttr[K]): void;
    toggleAttribute<K extends keyof AriaAttr>(qualifiedName: K, force?: boolean): boolean;
	removeAttribute<K extends keyof AriaAttr>(qualifiedName: K): void;
${AriaAttr.filter((desc) => !desc.description.includes("Deprecated") && desc.name !== "role").map((desc) => {
	const type = ariaAttrVal.get(desc.name);
	return `
	/** ${desc.description} */
	${kebab2camel(desc.name)}: ${type ? `Val["${type}"]` : "string"};`;
}).join("")}

	/** @deprecated */ hasAttribute<K extends keyof DepdAriaAttr>(qualifiedName: K): boolean;
	/** @deprecated */ setAttribute<K extends keyof DepdAriaAttr>(qualifiedName: K, value: DepdAriaAttr[K]): void;
    /** @deprecated */ toggleAttribute<K extends keyof DepdAriaAttr>(qualifiedName: K, force?: boolean): boolean;
	/** @deprecated */ removeAttribute<K extends keyof DepdAriaAttr>(qualifiedName: K): void;
${AriaAttr.filter((desc) => desc.description.includes("Deprecated")).map((desc) => {
	const type = ariaAttrVal.get(desc.name);
	return `
	/** ${desc.description} @deprecated */
	${kebab2camel(desc.name)}: ${type ? `Val["${type}"]` : "string"};`;
}).join("")}
}`;


const dtsStr = `
/// <reference lib="DOM"/>
/// <reference no-default-lib="true"/>
${valueSetDtsStr}
${ariaDtsStr}
`;

fs.writeFileSync(
	path.resolve(__dirname, "dist/lib.dom-aria.d.ts"),
	dtsStr,
);