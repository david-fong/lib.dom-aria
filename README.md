# lib.dom-attributes

Adds attribute-related types on top of lib.dom.d.ts. Uses [microsoft/vscode-custom-data](https://github.com/microsoft/vscode-custom-data) (the same source of information used for VS Code's HTML and CSS autocomplete suggestions and hover documentation).

## Scope

This project aims to add typings for attributes that are _not_ reflected as DOM properties in major browsers. For attributes that are in scope and deprecated, it will seek to make that clear to code authors via documentation instead of omitting them from the generated output.

## How to Use

## Motivation

Most HTML attributes are reflected as object properties in the JS DOM, but reflection for some important properties is not yet implemented in some major browsers- particularly aria attributes, which at the time of this writing, have not been implemented in Firefox yet. Some front end frameworks provide this functionality, but not all projects use frameworks.

In 2018, aria attributes were specced to be reflected in DOM properties: ([issue](https://github.com/w3c/aria/issues/691)) ([spec PR](https://github.com/w3c/aria/pull/708)) ([spec: _editors draft_](https://w3c.github.io/aria/#idl-interface)) ([mdn compat data](https://github.com/mdn/browser-compat-data/blob/main/api/_mixins/ARIAMixin__Element.json)).

Once that happens, I hope that either one of [VS Code's Custom Data](https://github.com/microsoft/vscode-custom-data) or [MDN's Browser Compat Data](https://github.com/mdn/browser-compat-data) can be integrated into [TypeScript's lib.dom generator](https://github.com/microsoft/TypeScript-DOM-lib-generator). This has better potential for doc comments on the types, since documenting function overrides is clunky and slightly less discoverable to code authors.

But even after that happens, there will probably be lots of code lying around that uses setAttribute. Hopefully this project will help for that.

## How to Build

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