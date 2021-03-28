"use strict";
import fs from "fs";
import url from "url";
import path from "path";
import {
	AttrVal,
	GlobalAttr,
	HtmlTags,
	AriaAttr,
	AriaAttrVal,
} from "./imports.js";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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

// TODO: filter out things where the description includes "Do not use", and ""
// TODO: look at generateData.js and see how it uses the data to make doc strings.

const valueSet = new Map(AttrVal.map((vs) => {
	// TODO: find out if there is a way to document individual options.
	// TODO: Capitalize the first letter of the type name.
	const typeName = vs.name;
	const dtsStr = `type ${typeName} = ` + vs.values.map((val) => `"${val.name}"`).join(" | ") + ";";
	return [vs.name, Object.freeze({
		values: vs.values,
		typeName,
		dtsStr,
	})];
}));
const valueSetDtsStr = `
/** */
declare namespace HtmlAttributes {
	/** */
	namespace Values {
		${[...valueSet.values()].map((desc) => desc.dtsStr).join("\n\t\t")}
	}
}`;


// TODO
const tagsDtsStr = `
/** */
${HtmlTags.forEach((desc) => {
	return "";
})}
`;


const ariaAttrDoc = new Map(AriaAttr.map((spec) => [spec.name, spec.description]));
const ariaAttrVal = new Map(AriaAttrVal.map((data) => [data.name, data.valueSet]));
const ariaDtsStr = `
/** Aria Attributes */
interface Element {
	${[...ariaAttrDoc.keys()].map((name) => {
		const doc = docStringify(ariaAttrDoc.get(name));
		const val = ["string"];
		const valSet = valueSet.get(ariaAttrVal.get(name))?.typeName;
		if (valSet) {
			val.push("HtmlAttributes.Values." + valSet);
		}
		const sig = `\n\tsetAttribute(qualifiedName: "${name}", value: ${val.join(" | ")}): void;`;
		return doc + sig;
	}).join("\n\t")}
}`;


const dtsStr = `
/// <reference no-default-lib="true"/>
${valueSetDtsStr}
${ariaDtsStr}
`;

fs.writeFileSync(
	path.resolve(__dirname, "../lib.dom-enums.d.ts"),
	dtsStr,
);