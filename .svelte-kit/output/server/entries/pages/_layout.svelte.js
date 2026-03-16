import "clsx";
function JgrTheme($$renderer, $$props) {
  let { children } = $$props;
  if (children) {
    $$renderer.push("<!--[0-->");
    children($$renderer);
    $$renderer.push(`<!---->`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  JgrTheme($$renderer, {
    children: ($$renderer2) => {
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    }
  });
}
export {
  _layout as default
};
