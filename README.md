# lib.dom-enums

Adds more typing information and documentation on top of lib.dom.d.ts. Uses [microsoft/vscode-custom-data](https://github.com/microsoft/vscode-custom-data) (the same source of information used for VS Code's HTML and CSS autocomplete suggestions and hover documentation).

## How to Build:

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