function invalid_snippet_arguments() {
  {
    const error = new Error(`invalid_snippet_arguments
A snippet function was passed invalid arguments. Snippets should only be instantiated via \`{@render ...}\`
https://svelte.dev/e/invalid_snippet_arguments`);
    error.name = "Svelte error";
    throw error;
  }
}
function invariant_violation(message) {
  {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  }
}
function lifecycle_outside_component(name) {
  {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  }
}
function snippet_without_render_tag() {
  {
    const error = new Error(`snippet_without_render_tag
Attempted to render a snippet without a \`{@render}\` block. This would cause the snippet code to be stringified instead of its content being rendered to the DOM. To fix this, change \`{snippet}\` to \`{@render snippet()}\`.
https://svelte.dev/e/snippet_without_render_tag`);
    error.name = "Svelte error";
    throw error;
  }
}
const HYDRATION_START = "[";
const HYDRATION_START_ELSE = "[!";
const HYDRATION_START_FAILED = "[?";
const HYDRATION_END = "]";
const HYDRATION_ERROR = {};
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ELEMENT_IS_INPUT = 1 << 2;
const UNINITIALIZED = /* @__PURE__ */ Symbol();
const FILENAME = /* @__PURE__ */ Symbol("filename");
function prevent_snippet_stringification(fn) {
  fn.toString = () => {
    snippet_without_render_tag();
    return "";
  };
  return fn;
}
export {
  ELEMENT_PRESERVE_ATTRIBUTE_CASE as E,
  FILENAME as F,
  HYDRATION_ERROR as H,
  UNINITIALIZED as U,
  HYDRATION_END as a,
  HYDRATION_START as b,
  HYDRATION_START_ELSE as c,
  HYDRATION_START_FAILED as d,
  invalid_snippet_arguments as e,
  ELEMENT_IS_INPUT as f,
  ELEMENT_IS_NAMESPACED as g,
  invariant_violation as i,
  lifecycle_outside_component as l,
  prevent_snippet_stringification as p
};
