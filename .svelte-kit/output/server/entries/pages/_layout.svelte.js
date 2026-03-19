import { F as FILENAME, p as prevent_snippet_stringification } from "../../chunks/validate.js";
import "clsx";
JgrTheme[FILENAME] = "src/lib/components/JgrTheme.svelte";
function JgrTheme($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { theme = "dark", children } = $$props;
      if (children) {
        $$renderer2.push("<!--[0-->");
        children($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    JgrTheme
  );
}
JgrTheme.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      JgrTheme($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          children($$renderer3);
          $$renderer3.push(`<!---->`);
        })
      });
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _layout as default
};
