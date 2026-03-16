import { a0 as ssr_context, a1 as attr_class, a2 as attr, e as escape_html, a3 as ensure_array_like, a4 as attr_style, a5 as stringify, $ as derived, a6 as bind_props } from "../../../chunks/index2.js";
import "clsx";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function JgrCta($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    if (pending) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="cta-spin svelte-ip4lx1">${escape_html(FRAMES[spinFrame])}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="cta-label svelte-ip4lx1">${escape_html(label)}</span><span class="cta-arrow svelte-ip4lx1">→</span></button>`);
  });
}
function JgrItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    })} role="button" tabindex="0"><div class="item-top svelte-ymfui8">`);
    if (prefix) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="item-prefix svelte-ymfui8">${escape_html(prefix)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="item-title svelte-ymfui8">${escape_html(title)}</span> `);
    if (actionLabel) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button${attr_class("item-action svelte-ymfui8", void 0, { "done": actionDone })}${attr("disabled", actionLoading || actionDone, true)}${attr("title", actionLabel)}>${escape_html(actionDone ? "✓" : actionLoading ? "…" : actionLabel)}</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (labels.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="item-labels svelte-ymfui8"><!--[-->`);
      const each_array = ensure_array_like(labels);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let label = each_array[$$index];
        $$renderer2.push(`<span class="label svelte-ymfui8"${attr_style(`background: #${stringify(label.color)}20; color: #${stringify(label.color)}; border-color: #${stringify(label.color)}40`)}>${escape_html(label.name)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function JgrTabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { tabs, activeTab, children } = $$props;
    $$renderer2.push(`<div class="tabs-root svelte-nucq2b"><div class="tab-bar svelte-nucq2b"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-nucq2b", void 0, { "active": activeTab === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="tab-content svelte-nucq2b">`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2, activeTab);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function JgrConsole($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      logs = [],
      running = false,
      title = "",
      completionLabel = "",
      sessionAlive = false,
      showInput = false
    } = $$props;
    const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let frame = 0;
    onDestroy(() => {
    });
    let visibleLogs = derived(() => logs.filter((l) => l.type !== "usage" && l.type !== "context" && l.type !== "session_status" && !/^\[pid:\d+\]$/.test(l.line)));
    let inputValue = "";
    $$renderer2.push(`<div class="console svelte-1iode1c"><div class="console-header svelte-1iode1c"><span${attr_class("dot svelte-1iode1c", void 0, { "running": running })}></span> <span class="console-label svelte-1iode1c">Console</span> <span class="task-title svelte-1iode1c">${escape_html(title)}</span> <span class="status-text svelte-1iode1c">`);
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
    $$renderer2.push(`<!--]--></span> `);
    if (sessionAlive && !running) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="badge-session svelte-1iode1c">⬡ session</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (running) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-stop svelte-1iode1c">■ Interrompre</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (sessionAlive && !running) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-terminate svelte-1iode1c">⏹ Terminer</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!running && !sessionAlive) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-dismiss svelte-1iode1c">✕ Fermer</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="log-area svelte-1iode1c">`);
    if (visibleLogs().length === 0) {
      $$renderer2.push("<!--[0-->");
      if (running) {
        $$renderer2.push("<!--[0-->");
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="hint blink svelte-1iode1c">${escape_html(FRAMES[frame])} En attente de la première sortie…</span>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="hint svelte-1iode1c">Aucune sortie</span>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(visibleLogs());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let entry = each_array[$$index];
        $$renderer2.push(`<div${attr_class("log-line svelte-1iode1c", void 0, { "sys": entry.type === "system" })}>${escape_html(entry.line)}</div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (!running && !sessionAlive && completionLabel) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="completion-hint svelte-1iode1c">${escape_html(completionLabel)}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showInput) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="input-row svelte-1iode1c"><span class="prompt-sym svelte-1iode1c">›</span> <input class="console-input svelte-1iode1c" type="text" placeholder="Répondre… (Entrée)"${attr("value", inputValue)}/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function JgrPrompt($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      placeholder = "Tâche…",
      sections = [],
      pending = false,
      onsubmit,
      onchange
    } = $$props;
    let collapsed = /* @__PURE__ */ new Set();
    $$renderer2.push(`<div class="jgr-prompt svelte-1ax1m11"><textarea class="prompt-ta svelte-1ax1m11"${attr("placeholder", placeholder)}${attr("disabled", pending, true)} rows="4">`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    if (sections.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="sections svelte-1ax1m11"><!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let sec = each_array[$$index];
        if (sec.enabled !== false) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="sec svelte-1ax1m11"><button class="sec-toggle svelte-1ax1m11">${escape_html(sec.label)} ${escape_html(collapsed.has(sec.id) ? "▸" : "▾")}</button> `);
          if (!collapsed.has(sec.id)) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<pre class="sec-content svelte-1ax1m11">${escape_html(sec.content)}</pre>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function _page($$renderer) {
  let pending1 = false;
  let pending2 = false;
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
  function $$render_inner($$renderer2) {
    $$renderer2.push(`<div style="padding: 2rem; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;"><h1 style="font-size: 1.2rem; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">jgr-ui / demo</h1> <section><h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrCta</h2> <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">`);
    JgrCta($$renderer2, { label: "Primary", onclick: togglePending1, pending: pending1 });
    $$renderer2.push(`<!----> `);
    JgrCta($$renderer2, {
      label: "Ghost",
      variant: "ghost",
      onclick: togglePending2,
      pending: pending2
    });
    $$renderer2.push(`<!----> `);
    JgrCta($$renderer2, { label: "Danger", variant: "danger" });
    $$renderer2.push(`<!----> `);
    JgrCta($$renderer2, { label: "Disabled", disabled: true });
    $$renderer2.push(`<!----></div></section> <section><h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrItem</h2> <div style="border: 1px solid var(--border); border-radius: 3px; overflow: hidden; max-width: 400px;">`);
    JgrItem($$renderer2, {
      prefix: "#1",
      title: "Créer le repo jgr-ui",
      labels: [{ name: "feature", color: "7c6af7" }]
    });
    $$renderer2.push(`<!----> `);
    JgrItem($$renderer2, {
      prefix: "#2",
      title: "Migrer CtaButton → JgrCta",
      state: "selected",
      actionLabel: "Done",
      actionDone: true
    });
    $$renderer2.push(`<!----> `);
    JgrItem($$renderer2, {
      prefix: "#3",
      title: "Tâche en cours",
      state: "pending",
      actionLabel: "Run",
      actionLoading: true
    });
    $$renderer2.push(`<!----></div></section> <section><h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrTabs + JgrConsole + JgrPrompt</h2> <div style="height: 360px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">`);
    {
      let children = function($$renderer3, tab) {
        if (tab === "console") {
          $$renderer3.push("<!--[0-->");
          JgrConsole($$renderer3, {
            logs: demoLogs,
            title: "demo-task",
            completionLabel: "Plan enregistré"
          });
        } else if (tab === "prompt") {
          $$renderer3.push("<!--[1-->");
          $$renderer3.push(`<div style="padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem;">`);
          JgrPrompt($$renderer3, {
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
          $$renderer3.push(`<!----> <div style="font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">Valeur : ${escape_html(promptValue)}</div></div>`);
        } else if (tab === "items") {
          $$renderer3.push("<!--[2-->");
          $$renderer3.push(`<div>`);
          JgrItem($$renderer3, {
            prefix: "#10",
            title: "Issue exemple avec label long",
            labels: [
              { name: "bug", color: "f44336" },
              { name: "ui", color: "4caf50" }
            ]
          });
          $$renderer3.push(`<!----> `);
          JgrItem($$renderer3, { prefix: "#11", title: "Autre issue", actionLabel: "Ouvrir" });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      };
      JgrTabs($$renderer2, {
        tabs,
        activeTab,
        children
      });
    }
    $$renderer2.push(`<!----></div></section></div>`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
}
export {
  _page as default
};
