# lib.dom-aria

[![npm version][npm-version-label]][npm-url]

This project adds typings for the web's aria attributes. It also adds a polyfill for the reflection of those attributes as DOM Element properties.

It uses [microsoft/vscode-custom-data](https://github.com/microsoft/vscode-custom-data) (the same source of information used for VS Code's HTML and CSS autocomplete suggestions and hover documentation).

## How to Use

## Motivation

Most HTML attributes are reflected as object properties in the JS DOM, but reflection for some important properties is not yet implemented in some major browsers- particularly aria attributes, which at the time of this writing, have not been implemented in Firefox yet. Some front end frameworks provide this functionality, but not all projects use frameworks.

In 2018, aria attributes were specced to be reflected in DOM properties: ([issue](https://github.com/w3c/aria/issues/691)) ([spec PR](https://github.com/w3c/aria/pull/708)) ([spec: _editors draft_](https://w3c.github.io/aria/#idl-interface)) ([mdn compat data](https://github.com/mdn/browser-compat-data/blob/main/api/_mixins/ARIAMixin__Element.json)).

Once that happens, I hope that either one of [VS Code's Custom Data](https://github.com/microsoft/vscode-custom-data) or [MDN's Browser Compat Data](https://github.com/mdn/browser-compat-data) can be integrated into [TypeScript's lib.dom generator](https://github.com/microsoft/TypeScript-DOM-lib-generator), but kind of doubt that that will happen. Seeing that the IDL definitions (which are what the TS lib generator uses) in the aria spec just specify `DOMString`, this package will probably still be useful after aria reflection lands in Firefox since it has documentation about what each attribute is for, and what values it can take on.

## How to Build / Update

https://github.com/microsoft/vscode-custom-data#updating-web-data

```sh
cd data/
git pull
cd web-data/
yarn update-sources
yarn generate-data
cd ../..
node generate.js
```

[npm-version-label]: https://img.shields.io/npm/v/lib.dom-aria
[npm-url]: https://www.npmjs.com/package/lib.dom-aria.log
