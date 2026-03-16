import { F as FILENAME, p as prevent_snippet_stringification } from "../../../chunks/validate.js";
import { X as ssr_context, Y as attr_class, Z as attr, e as escape_html, _ as ensure_array_like, $ as attr_style, a0 as stringify, V as derived, a1 as bind_props } from "../../../chunks/index.js";
import "clsx";
import { p as push_element, a as pop_element, v as validate_snippet_args } from "../../../chunks/dev.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
JgrCta[FILENAME] = "src/lib/components/JgrCta.svelte";
function JgrCta($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        label,
        pending = false,
        disabled = false,
        variant = "primary",
        onclick
      } = $$props;
      const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let spinFrame = 0;
      $$renderer2.push(`<button${attr_class("cta-btn svelte-ip4lx1", void 0, { "ghost": variant === "ghost", "danger": variant === "danger" })}${attr("disabled", disabled || pending, true)}>`);
      push_element($$renderer2, "button", 32, 0);
      if (pending) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="cta-spin svelte-ip4lx1">`);
        push_element($$renderer2, "span", 39, 15);
        $$renderer2.push(`${escape_html(FRAMES[spinFrame])}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="cta-label svelte-ip4lx1">`);
      push_element($$renderer2, "span", 40, 2);
      $$renderer2.push(`${escape_html(label)}</span>`);
      pop_element();
      $$renderer2.push(`<span class="cta-arrow svelte-ip4lx1">`);
      push_element($$renderer2, "span", 40, 40);
      $$renderer2.push(`→</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
    },
    JgrCta
  );
}
JgrCta.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JgrItem[FILENAME] = "src/lib/components/JgrItem.svelte";
function JgrItem($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        title = "",
        prefix = "",
        labels = [],
        state: itemState = "default",
        actionLabel,
        actionDone = false,
        actionLoading = false,
        onaction,
        onselect
      } = $$props;
      $$renderer2.push(`<div${attr_class("item-row svelte-ymfui8", void 0, {
        "active": itemState === "selected",
        "pending": itemState === "pending"
      })} role="button" tabindex="0">`);
      push_element($$renderer2, "div", 25, 0);
      $$renderer2.push(`<div class="item-top svelte-ymfui8">`);
      push_element($$renderer2, "div", 34, 2);
      if (prefix) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="item-prefix svelte-ymfui8">`);
        push_element($$renderer2, "span", 35, 16);
        $$renderer2.push(`${escape_html(prefix)}</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="item-title svelte-ymfui8">`);
      push_element($$renderer2, "span", 36, 4);
      $$renderer2.push(`${escape_html(title)}</span>`);
      pop_element();
      $$renderer2.push(` `);
      if (actionLabel) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button${attr_class("item-action svelte-ymfui8", void 0, { "done": actionDone })}${attr("disabled", actionLoading || actionDone, true)}${attr("title", actionLabel)}>`);
        push_element($$renderer2, "button", 38, 6);
        $$renderer2.push(`${escape_html(actionDone ? "✓" : actionLoading ? "…" : actionLabel)}</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (labels.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="item-labels svelte-ymfui8">`);
        push_element($$renderer2, "div", 49, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(labels);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let label = each_array[$$index];
          $$renderer2.push(`<span class="label svelte-ymfui8"${attr_style(`background: #${stringify(label.color)}20; color: #${stringify(label.color)}; border-color: #${stringify(label.color)}40`)}>`);
          push_element($$renderer2, "span", 51, 8);
          $$renderer2.push(`${escape_html(label.name)}</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    JgrItem
  );
}
JgrItem.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JgrTabs[FILENAME] = "src/lib/components/JgrTabs.svelte";
function JgrTabs($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { tabs, activeTab, onchange, children } = $$props;
      $$renderer2.push(`<div class="tabs-root svelte-nucq2b">`);
      push_element($$renderer2, "div", 17, 0);
      $$renderer2.push(`<div class="tab-bar svelte-nucq2b">`);
      push_element($$renderer2, "div", 18, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(tabs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer2.push(`<button${attr_class("tab svelte-nucq2b", void 0, { "active": activeTab === tab.id })}>`);
        push_element($$renderer2, "button", 20, 6);
        $$renderer2.push(`${escape_html(tab.label)}</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="tab-content svelte-nucq2b">`);
      push_element($$renderer2, "div", 27, 2);
      if (children) {
        $$renderer2.push("<!--[0-->");
        children($$renderer2, activeTab);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    JgrTabs
  );
}
JgrTabs.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JgrConsole[FILENAME] = "src/lib/components/JgrConsole.svelte";
function JgrConsole($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        logs = [],
        running = false,
        title = "",
        completionLabel = "",
        sessionAlive = false,
        showInput = false,
        oninterrupt,
        onterminate,
        ondismiss,
        oninput
      } = $$props;
      const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frame = 0;
      onDestroy(() => {
      });
      let visibleLogs = derived(() => logs.filter((l) => l.type !== "usage" && l.type !== "context" && l.type !== "session_status" && !/^\[pid:\d+\]$/.test(l.line)));
      let inputValue = "";
      $$renderer2.push(`<div class="console svelte-1iode1c">`);
      push_element($$renderer2, "div", 80, 0);
      $$renderer2.push(`<div class="console-header svelte-1iode1c">`);
      push_element($$renderer2, "div", 81, 2);
      $$renderer2.push(`<span${attr_class("dot svelte-1iode1c", void 0, { "running": running })}>`);
      push_element($$renderer2, "span", 82, 4);
      $$renderer2.push(`</span>`);
      pop_element();
      $$renderer2.push(` <span class="console-label svelte-1iode1c">`);
      push_element($$renderer2, "span", 83, 4);
      $$renderer2.push(`Console</span>`);
      pop_element();
      $$renderer2.push(` <span class="task-title svelte-1iode1c">`);
      push_element($$renderer2, "span", 84, 4);
      $$renderer2.push(`${escape_html(title)}</span>`);
      pop_element();
      $$renderer2.push(` <span class="status-text svelte-1iode1c">`);
      push_element($$renderer2, "span", 85, 4);
      if (running) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`${escape_html(visibleLogs().length === 0 ? "Initialisation…" : "En cours…")}`);
      } else if (sessionAlive) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`session active`);
      } else if (completionLabel) {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`${escape_html(completionLabel)}`);
      } else if (visibleLogs().length > 0) {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`Terminé`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(` `);
      if (sessionAlive && !running) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge-session svelte-1iode1c">`);
        push_element($$renderer2, "span", 97, 6);
        $$renderer2.push(`⬡ session</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (running) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn-stop svelte-1iode1c">`);
        push_element($$renderer2, "button", 100, 6);
        $$renderer2.push(`■ Interrompre</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (sessionAlive && !running) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn-terminate svelte-1iode1c">`);
        push_element($$renderer2, "button", 103, 6);
        $$renderer2.push(`⏹ Terminer</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!running && !sessionAlive) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="btn-dismiss svelte-1iode1c">`);
        push_element($$renderer2, "button", 106, 6);
        $$renderer2.push(`✕ Fermer</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="log-area svelte-1iode1c">`);
      push_element($$renderer2, "div", 110, 2);
      if (visibleLogs().length === 0) {
        $$renderer2.push("<!--[0-->");
        if (running) {
          $$renderer2.push("<!--[0-->");
          {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="hint blink svelte-1iode1c">`);
            push_element($$renderer2, "span", 116, 10);
            $$renderer2.push(`${escape_html(FRAMES[frame])} En attente de la première sortie…</span>`);
            pop_element();
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="hint svelte-1iode1c">`);
          push_element($$renderer2, "span", 119, 8);
          $$renderer2.push(`Aucune sortie</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(visibleLogs());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let entry = each_array[$$index];
          $$renderer2.push(`<div${attr_class("log-line svelte-1iode1c", void 0, { "sys": entry.type === "system" })}>`);
          push_element($$renderer2, "div", 123, 8);
          $$renderer2.push(`${escape_html(entry.line)}</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!running && !sessionAlive && completionLabel) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="completion-hint svelte-1iode1c">`);
        push_element($$renderer2, "div", 129, 4);
        $$renderer2.push(`${escape_html(completionLabel)}</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (showInput) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="input-row svelte-1iode1c">`);
        push_element($$renderer2, "div", 133, 4);
        $$renderer2.push(`<span class="prompt-sym svelte-1iode1c">`);
        push_element($$renderer2, "span", 134, 6);
        $$renderer2.push(`›</span>`);
        pop_element();
        $$renderer2.push(` <input class="console-input svelte-1iode1c" type="text" placeholder="Répondre… (Entrée)"${attr("value", inputValue)}/>`);
        push_element($$renderer2, "input", 135, 6);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    JgrConsole
  );
}
JgrConsole.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JgrPrompt[FILENAME] = "src/lib/components/JgrPrompt.svelte";
function JgrPrompt($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        value = "",
        placeholder = "Tâche…",
        sections = [],
        pending = false,
        onsubmit,
        onchange
      } = $$props;
      let collapsed = /* @__PURE__ */ new Set();
      $$renderer2.push(`<div class="jgr-prompt svelte-1ax1m11">`);
      push_element($$renderer2, "div", 43, 0);
      $$renderer2.push(`<textarea class="prompt-ta svelte-1ax1m11"${attr("placeholder", placeholder)}${attr("disabled", pending, true)} rows="4">`);
      push_element($$renderer2, "textarea", 44, 2);
      const $$body = escape_html(value);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(` `);
      if (sections.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="sections svelte-1ax1m11">`);
        push_element($$renderer2, "div", 55, 4);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(sections);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let sec = each_array[$$index];
          if (sec.enabled !== false) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="sec svelte-1ax1m11">`);
            push_element($$renderer2, "div", 58, 10);
            $$renderer2.push(`<button class="sec-toggle svelte-1ax1m11">`);
            push_element($$renderer2, "button", 59, 12);
            $$renderer2.push(`${escape_html(sec.label)} ${escape_html(collapsed.has(sec.id) ? "▸" : "▾")}</button>`);
            pop_element();
            $$renderer2.push(` `);
            if (!collapsed.has(sec.id)) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<pre class="sec-content svelte-1ax1m11">`);
              push_element($$renderer2, "pre", 63, 14);
              $$renderer2.push(`${escape_html(sec.content)}</pre>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { value });
    },
    JgrPrompt
  );
}
JgrPrompt.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
JgrLayout[FILENAME] = "src/lib/components/JgrLayout.svelte";
function JgrLayout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        storageKey = "jgr-ui:panel-widths",
        leftWidth = 300,
        rightWidth = 340,
        height = "100vh",
        leftLabel = "GAUCHE",
        rightLabel = "DROITE",
        topbar,
        left,
        center,
        right,
        footer
      } = $$props;
      let widths = { left: leftWidth, right: rightWidth };
      let dragging = null;
      $$renderer2.push(`<div${attr_class("layout svelte-1so3s8t", void 0, { "dragging": false })}${attr_style(`height: ${stringify(height)}`)}>`);
      push_element($$renderer2, "div", 98, 0);
      if (topbar) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="layout-topbar svelte-1so3s8t">`);
        push_element($$renderer2, "div", 100, 4);
        topbar($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="layout-body svelte-1so3s8t">`);
      push_element($$renderer2, "div", 103, 2);
      $$renderer2.push(`<div class="panel-strip panel-strip--left svelte-1so3s8t">`);
      push_element($$renderer2, "div", 105, 4);
      $$renderer2.push(`<button${attr_class("svelte-1so3s8t", void 0, { "active": true })}>`);
      push_element($$renderer2, "button", 106, 6);
      $$renderer2.push(`<span class="strip-label svelte-1so3s8t">`);
      push_element($$renderer2, "span", 107, 8);
      $$renderer2.push(`${escape_html(leftLabel)}</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (left) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="layout-panel layout-left svelte-1so3s8t"${attr_style(`width: ${stringify(widths.left)}px`)}>`);
        push_element($$renderer2, "div", 112, 6);
        left($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <div${attr_class("handle svelte-1so3s8t", void 0, { "active": dragging === "left" })} role="separator" aria-label="Redimensionner le panneau gauche">`);
        push_element($$renderer2, "div", 115, 6);
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <main class="layout-center svelte-1so3s8t">`);
      push_element($$renderer2, "main", 124, 4);
      if (center) {
        $$renderer2.push("<!--[0-->");
        center($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></main>`);
      pop_element();
      $$renderer2.push(` `);
      if (right) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class("handle svelte-1so3s8t", void 0, { "active": dragging === "right" })} role="separator" aria-label="Redimensionner le panneau droit">`);
        push_element($$renderer2, "div", 129, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="layout-panel layout-right svelte-1so3s8t"${attr_style(`width: ${stringify(widths.right)}px`)}>`);
        push_element($$renderer2, "div", 136, 6);
        right($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="panel-strip panel-strip--right svelte-1so3s8t">`);
      push_element($$renderer2, "div", 142, 4);
      $$renderer2.push(`<button${attr_class("svelte-1so3s8t", void 0, { "active": true })}>`);
      push_element($$renderer2, "button", 143, 6);
      $$renderer2.push(`<span class="strip-label svelte-1so3s8t">`);
      push_element($$renderer2, "span", 144, 8);
      $$renderer2.push(`${escape_html(rightLabel)}</span>`);
      pop_element();
      $$renderer2.push(`</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (footer) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="layout-footer svelte-1so3s8t">`);
        push_element($$renderer2, "div", 150, 4);
        footer($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    JgrLayout
  );
}
JgrLayout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/demo/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let pending1 = false;
      let pending2 = false;
      let pendingStatic = true;
      function togglePending1() {
        pending1 = true;
        setTimeout(
          () => {
            pending1 = false;
          },
          2e3
        );
      }
      function togglePending2() {
        pending2 = true;
        setTimeout(
          () => {
            pending2 = false;
          },
          2e3
        );
      }
      let activeTab = "console";
      const tabs = [
        { id: "console", label: "console" },
        { id: "prompt", label: "prompt" },
        { id: "items", label: "items" }
      ];
      const demoLogs = [
        { line: "[system] Démarrage agent...", type: "system" },
        { line: "Analyse du contexte", type: "agent" },
        { line: "Génération du plan", type: "agent" },
        {
          line: "Plan enregistré dans .agent/tasks/demo.plan.md",
          type: "agent"
        }
      ];
      let promptValue = "";
      const demoSections = [
        {
          id: "objectif",
          label: "Objectif",
          content: "Créer un composant JgrPrompt générique sans stores.",
          enabled: true
        },
        {
          id: "contraintes",
          label: "Contraintes",
          content: "Pas de stores Svelte. Tout via props/events.",
          enabled: true
        }
      ];
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<div style="padding: 2rem; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">`);
        push_element($$renderer3, "div", 44, 0);
        $$renderer3.push(`<h1 style="font-size: 1.2rem; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">`);
        push_element($$renderer3, "h1", 45, 2);
        $$renderer3.push(`jgr-ui / demo</h1>`);
        pop_element();
        $$renderer3.push(` <section>`);
        push_element($$renderer3, "section", 48, 2);
        $$renderer3.push(`<h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">`);
        push_element($$renderer3, "h2", 49, 4);
        $$renderer3.push(`JgrCta</h2>`);
        pop_element();
        $$renderer3.push(` <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">`);
        push_element($$renderer3, "div", 50, 4);
        JgrCta($$renderer3, { label: "Primary", onclick: togglePending1, pending: pending1 });
        $$renderer3.push(`<!----> `);
        JgrCta($$renderer3, {
          label: "Ghost",
          variant: "ghost",
          onclick: togglePending2,
          pending: pending2
        });
        $$renderer3.push(`<!----> `);
        JgrCta($$renderer3, { label: "Danger", variant: "danger" });
        $$renderer3.push(`<!----> `);
        JgrCta($$renderer3, { label: "Disabled", disabled: true });
        $$renderer3.push(`<!----> `);
        JgrCta($$renderer3, { label: "Pending", pending: pendingStatic });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</section>`);
        pop_element();
        $$renderer3.push(` <section>`);
        push_element($$renderer3, "section", 60, 2);
        $$renderer3.push(`<h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">`);
        push_element($$renderer3, "h2", 61, 4);
        $$renderer3.push(`JgrItem</h2>`);
        pop_element();
        $$renderer3.push(` <div style="border: 1px solid var(--border); border-radius: 3px; overflow: hidden; max-width: 400px;">`);
        push_element($$renderer3, "div", 62, 4);
        JgrItem($$renderer3, {
          prefix: "#1",
          title: "Créer le repo jgr-ui",
          labels: [{ name: "feature", color: "7c6af7" }]
        });
        $$renderer3.push(`<!----> `);
        JgrItem($$renderer3, {
          prefix: "#2",
          title: "Migrer CtaButton → JgrCta",
          state: "selected",
          actionLabel: "Done",
          actionDone: true
        });
        $$renderer3.push(`<!----> `);
        JgrItem($$renderer3, {
          prefix: "#3",
          title: "Tâche en cours",
          state: "pending",
          actionLabel: "Run",
          actionLoading: true
        });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</section>`);
        pop_element();
        $$renderer3.push(` <section style="padding: 0; overflow: hidden;">`);
        push_element($$renderer3, "section", 70, 2);
        $$renderer3.push(`<h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; padding: 0 2rem; font-family: 'JetBrains Mono', monospace;">`);
        push_element($$renderer3, "h2", 71, 4);
        $$renderer3.push(`JgrLayout</h2>`);
        pop_element();
        $$renderer3.push(` <div style="height: 280px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">`);
        push_element($$renderer3, "div", 72, 4);
        {
          let topbar = function($$renderer4) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div style="height: 30px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem; gap: 0.5rem; flex-shrink: 0;">`);
            push_element($$renderer4, "div", 75, 10);
            $$renderer4.push(`<span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em;">`);
            push_element($$renderer4, "span", 76, 12);
            $$renderer4.push(`topbar</span>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }, left = function($$renderer4) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div style="padding: 0.8rem; height: 100%; box-sizing: border-box;">`);
            push_element($$renderer4, "div", 80, 10);
            $$renderer4.push(`<div style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; margin-bottom: 0.5rem;">`);
            push_element($$renderer4, "div", 81, 12);
            $$renderer4.push(`colonne gauche</div>`);
            pop_element();
            $$renderer4.push(` <div style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">`);
            push_element($$renderer4, "div", 82, 12);
            $$renderer4.push(`← drag →</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }, center = function($$renderer4) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div style="padding: 0.8rem; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 0.5rem;">`);
            push_element($$renderer4, "div", 86, 10);
            $$renderer4.push(`<div style="font-size: 0.55rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;">`);
            push_element($$renderer4, "div", 87, 12);
            $$renderer4.push(`colonne centre</div>`);
            pop_element();
            $$renderer4.push(` <div style="font-size: 0.5rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; line-height: 1.7;">`);
            push_element($$renderer4, "div", 88, 12);
            $$renderer4.push(`Redimensionner les colonnes<br/>`);
            push_element($$renderer4, "br", 89, 41);
            pop_element();
            $$renderer4.push(`en faisant glisser les bordures doubles.</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }, right = function($$renderer4) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div style="padding: 0.8rem; height: 100%; box-sizing: border-box;">`);
            push_element($$renderer4, "div", 94, 10);
            $$renderer4.push(`<div style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; margin-bottom: 0.5rem;">`);
            push_element($$renderer4, "div", 95, 12);
            $$renderer4.push(`colonne droite</div>`);
            pop_element();
            $$renderer4.push(` <div style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">`);
            push_element($$renderer4, "div", 96, 12);
            $$renderer4.push(`← drag →</div>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          }, footer = function($$renderer4) {
            validate_snippet_args($$renderer4);
            $$renderer4.push(`<div style="height: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem; flex-shrink: 0;">`);
            push_element($$renderer4, "div", 100, 10);
            $$renderer4.push(`<span style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">`);
            push_element($$renderer4, "span", 101, 12);
            $$renderer4.push(`footer</span>`);
            pop_element();
            $$renderer4.push(`</div>`);
            pop_element();
          };
          prevent_snippet_stringification(topbar);
          prevent_snippet_stringification(left);
          prevent_snippet_stringification(center);
          prevent_snippet_stringification(right);
          prevent_snippet_stringification(footer);
          JgrLayout($$renderer3, {
            height: "280px",
            storageKey: "demo:layout",
            leftWidth: 180,
            rightWidth: 180,
            topbar,
            left,
            center,
            right,
            footer
          });
        }
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</section>`);
        pop_element();
        $$renderer3.push(` <section>`);
        push_element($$renderer3, "section", 109, 2);
        $$renderer3.push(`<h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">`);
        push_element($$renderer3, "h2", 110, 4);
        $$renderer3.push(`JgrTabs + JgrConsole + JgrPrompt</h2>`);
        pop_element();
        $$renderer3.push(` <div style="height: 360px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">`);
        push_element($$renderer3, "div", 111, 4);
        {
          let children = function($$renderer4, tab) {
            validate_snippet_args($$renderer4);
            if (tab === "console") {
              $$renderer4.push("<!--[0-->");
              JgrConsole($$renderer4, {
                logs: demoLogs,
                title: "demo-task",
                completionLabel: "Plan enregistré"
              });
            } else if (tab === "prompt") {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<div style="padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem;">`);
              push_element($$renderer4, "div", 117, 12);
              JgrPrompt($$renderer4, {
                sections: demoSections,
                onsubmit: (v) => alert("Submit: " + v),
                get value() {
                  return promptValue;
                },
                set value($$value) {
                  promptValue = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> <div style="font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">`);
              push_element($$renderer4, "div", 119, 14);
              $$renderer4.push(`Valeur : ${escape_html(promptValue)}</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            } else if (tab === "items") {
              $$renderer4.push("<!--[2-->");
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 122, 12);
              JgrItem($$renderer4, {
                prefix: "#10",
                title: "Issue exemple avec label long",
                labels: [
                  { name: "bug", color: "f44336" },
                  { name: "ui", color: "4caf50" }
                ]
              });
              $$renderer4.push(`<!----> `);
              JgrItem($$renderer4, { prefix: "#11", title: "Autre issue", actionLabel: "Ouvrir" });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          };
          prevent_snippet_stringification(children);
          JgrTabs($$renderer3, {
            tabs,
            activeTab,
            onchange: (id) => activeTab = id,
            children
          });
        }
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</section>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
