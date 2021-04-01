import "../dist/lib.dom-aria";
const t = document.createElement("html");
t.setAttribute("", "");

const a = document.createElement("body");
a.setAttribute("aria-dropeffect", "");
// ^ oh I thought this would get crossed out. The doc comment doesn't override... I wonder why
a.removeAttribute("")
