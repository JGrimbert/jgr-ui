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
function JgrLayout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
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
    if (topbar) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="layout-topbar svelte-1so3s8t">`);
      topbar($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="layout-body svelte-1so3s8t"><div class="panel-strip panel-strip--left svelte-1so3s8t"><button${attr_class("svelte-1so3s8t", void 0, { "active": true })}><span class="strip-label svelte-1so3s8t">${escape_html(leftLabel)}</span></button></div> `);
    if (left) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="layout-panel layout-left svelte-1so3s8t"${attr_style(`width: ${stringify(widths.left)}px`)}>`);
      left($$renderer2);
      $$renderer2.push(`<!----></div> <div${attr_class("handle svelte-1so3s8t", void 0, { "active": dragging === "left" })} role="separator" aria-label="Redimensionner le panneau gauche"></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <main class="layout-center svelte-1so3s8t">`);
    if (center) {
      $$renderer2.push("<!--[0-->");
      center($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main> `);
    if (right) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class("handle svelte-1so3s8t", void 0, { "active": dragging === "right" })} role="separator" aria-label="Redimensionner le panneau droit"></div> <div class="layout-panel layout-right svelte-1so3s8t"${attr_style(`width: ${stringify(widths.right)}px`)}>`);
      right($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="panel-strip panel-strip--right svelte-1so3s8t"><button${attr_class("svelte-1so3s8t", void 0, { "active": true })}><span class="strip-label svelte-1so3s8t">${escape_html(rightLabel)}</span></button></div></div> `);
    if (footer) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="layout-footer svelte-1so3s8t">`);
      footer($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function JgrTabList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      tabs,
      activeTab,
      ontabchange,
      onselect,
      detail,
      customcontent
      /** Snippet rendu inline sous l'item sélectionné : (tabId, itemId) */
      /** Snippet rendu pour un onglet sans items : (tabId) */
    } = $$props;
    let _tab = tabs[0]?.id ?? "";
    const currentId = derived(() => activeTab ?? _tab);
    const current = derived(() => tabs.find((t) => t.id === currentId()));
    let queries = {};
    const q = derived(() => queries[currentId()] ?? "");
    const rows = derived(() => !q().trim() ? current()?.items ?? [] : (current()?.items ?? []).filter((item) => item.label.toLowerCase().includes(q().toLowerCase()) || String(item.prefix ?? "").toLowerCase().includes(q().toLowerCase())));
    $$renderer2.push(`<div class="tl svelte-2m7cge"><div class="tl-bar svelte-2m7cge"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tl-tab svelte-2m7cge", void 0, { "active": currentId() === t.id })}>${escape_html(t.label)} `);
      if ((t.items?.length ?? 0) > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="tl-count svelte-2m7cge">${escape_html(t.items.length)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (current()?.cta) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="tl-cta svelte-2m7cge">${escape_html(current().cta.label)}</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (current()?.items !== void 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="tl-search svelte-2m7cge"><input class="tl-input svelte-2m7cge" placeholder="Filtrer…"${attr("value", q())}/> `);
      if (q()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="tl-clear svelte-2m7cge">✕</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div${attr_class("tl-list svelte-2m7cge", void 0, { "stale": current().pending })}>`);
      if (current().loading) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="tl-hint svelte-2m7cge">Chargement…</p>`);
      } else if (rows().length === 0) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<p class="tl-hint svelte-2m7cge">${escape_html(current().empty ?? (q() ? "Aucun résultat" : "Vide"))}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(rows());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          $$renderer2.push(`<div${attr_class("tl-row svelte-2m7cge", void 0, { "dimmed": item.dimmed })}>`);
          JgrItem($$renderer2, {
            prefix: item.prefix,
            title: item.label,
            labels: item.labels,
            state: current().selectedId === item.id ? "selected" : "default",
            actionLabel: item.actionLabel,
            actionLoading: item.actionLoading,
            actionDone: item.actionDone,
            onaction: item.onaction,
            onselect: () => onselect?.(currentId(), item)
          });
          $$renderer2.push(`<!----> `);
          if (item.ondelete) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button class="tl-del svelte-2m7cge" title="Supprimer">✕</button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> `);
          if (current().selectedId === item.id && detail) {
            $$renderer2.push("<!--[0-->");
            detail($$renderer2, currentId(), item.id);
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (customcontent) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="tl-custom svelte-2m7cge">`);
      customcontent($$renderer2, currentId());
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    const todoItems = [
      {
        id: "src/auth.ts:42",
        label: "Vérifier l'expiration du token JWT",
        prefix: "auth.ts:42",
        actionLabel: "→ Task"
      },
      {
        id: "src/api/users.ts:8",
        label: "Paginer les résultats de listUsers",
        prefix: "users.ts:8",
        actionLabel: "→ Task"
      },
      {
        id: "src/db/index.ts:17",
        label: "Ajouter retry sur connexion échouée",
        prefix: "db/index.ts:17",
        actionLabel: "→ Task"
      },
      {
        id: "src/cache.ts:55",
        label: "Invalider le cache après mutation",
        prefix: "cache.ts:55",
        actionLabel: "→ Task",
        dimmed: true
      }
    ];
    const issueItems = [
      {
        id: "12",
        prefix: "#12",
        label: "Authentification OAuth Google",
        labels: [{ name: "feature", color: "7c6af7" }],
        actionLabel: "Fermer"
      },
      {
        id: "14",
        prefix: "#14",
        label: "Bug : 500 sur /api/users en prod",
        labels: [
          { name: "bug", color: "f44336" },
          { name: "urgent", color: "ff9800" }
        ],
        actionLabel: "Fermer"
      },
      {
        id: "15",
        prefix: "#15",
        label: "Mettre à jour les dépendances critiques",
        labels: [{ name: "maintenance", color: "607d8b" }],
        actionLabel: "Fermer"
      },
      {
        id: "17",
        prefix: "#17",
        label: "Documentation API manquante sur /export",
        labels: [{ name: "docs", color: "009688" }],
        actionLabel: "Fermer"
      }
    ];
    const taskItems = [
      {
        id: "t1",
        prefix: "P1 #12",
        label: "Authentification OAuth Google",
        labels: [{ name: "implémentation", color: "9181f9" }]
      },
      {
        id: "t2",
        prefix: "#14",
        label: "Bug 500 /api/users",
        labels: [{ name: "Spécification", color: "555555" }]
      },
      {
        id: "t3",
        prefix: "P1 #15",
        label: "Mise à jour dépendances",
        labels: [{ name: "Mergée", color: "4caf50" }],
        dimmed: true
      }
    ];
    let demo1Tab = "todos";
    const demo1Tabs = [
      {
        id: "todos",
        label: "TODO",
        items: todoItems,
        empty: "Aucun TODO"
      },
      {
        id: "issues",
        label: "Issues",
        items: issueItems,
        empty: "Aucune issue ouverte"
      },
      {
        id: "tasks",
        label: "Tasks",
        items: taskItems,
        empty: "Aucune task"
      }
    ];
    let demo2Tab = "todos";
    let demo2TodoPending = false;
    let demo2IssuePending = false;
    let demo2TodoDone = {};
    let demo2ClosedNums = /* @__PURE__ */ new Set();
    function demo2CreateTask(id) {
      if (demo2TodoPending) return;
      demo2TodoPending = true;
      setTimeout(
        () => {
          demo2TodoDone = { ...demo2TodoDone, [id]: true };
          demo2TodoPending = false;
        },
        1800
      );
    }
    function demo2CloseIssue(id) {
      demo2IssuePending = true;
      setTimeout(
        () => {
          demo2ClosedNums = /* @__PURE__ */ new Set([...demo2ClosedNums, id]);
          demo2IssuePending = false;
        },
        1200
      );
    }
    todoItems.map((i) => ({
      ...i,
      actionDone: demo2TodoDone[i.id] ?? false,
      onaction: () => demo2CreateTask(i.id)
    }));
    issueItems.map((i) => ({
      ...i,
      actionDone: demo2ClosedNums.has(i.id),
      onaction: () => demo2CloseIssue(i.id)
    }));
    const demo2Tabs = derived(() => [
      {
        id: "todos",
        label: "TODO",
        items: todoItems.map((i) => ({
          ...i,
          actionDone: demo2TodoDone[i.id] ?? false,
          onaction: () => demo2CreateTask(i.id)
        })),
        pending: demo2TodoPending,
        empty: "Aucun TODO"
      },
      {
        id: "issues",
        label: "Issues",
        items: issueItems.map((i) => ({
          ...i,
          actionDone: demo2ClosedNums.has(i.id),
          onaction: () => demo2CloseIssue(i.id)
        })),
        pending: demo2IssuePending,
        cta: { label: "+ Issue", onclick: () => alert("Nouvelle issue") },
        empty: "Aucune issue ouverte"
      }
    ]);
    let demo3Tab = "todos";
    let demo3SelId = void 0;
    const demo3Details = {
      "src/auth.ts:42": {
        file: "src/auth.ts",
        line: 42,
        excerpt: 'if (!token) throw new Error("missing token");\n// TODO vérifier expiration\nreturn payload;'
      },
      "src/api/users.ts:8": {
        file: "src/api/users.ts",
        line: 8,
        excerpt: "export async function listUsers() {\n  // TODO paginer\n  return db.users.findAll();\n}"
      },
      "src/db/index.ts:17": {
        file: "src/db/index.ts",
        line: 17,
        excerpt: "const client = await pool.connect();\n// TODO retry\nawait client.query(sql);"
      }
    };
    const demo3TodoItems = todoItems.slice(0, 3).map((i) => ({ ...i, actionLabel: void 0 }));
    const demo3Tabs = derived(() => [
      {
        id: "todos",
        label: "TODO",
        items: demo3TodoItems,
        selectedId: demo3Tab === "todos" ? demo3SelId : void 0,
        empty: "Aucun TODO"
      },
      {
        id: "issues",
        label: "Issues",
        items: issueItems,
        selectedId: demo3Tab === "issues" ? demo3SelId : void 0,
        empty: "Aucune issue"
      }
    ]);
    let demo4Tab = "todos";
    const demo4Tabs = [
      {
        id: "todos",
        label: "TODO",
        items: todoItems.slice(0, 3),
        empty: "Vide"
      },
      {
        id: "issues",
        label: "Issues",
        items: issueItems,
        empty: "Vide"
      },
      { id: "custom", label: "Status" }
    ];
    const statusLines = [
      {
        label: "Branch",
        value: "feat/oauth-google",
        color: "#7c6af7"
      },
      {
        label: "Commit",
        value: "a3f82c1 — init scaffold",
        color: "#888"
      },
      { label: "CI", value: "✓ passing", color: "#4caf50" },
      { label: "Tokens", value: "18.4k / 200k", color: "#888" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div style="padding: 2rem; max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 3rem;"><h1 style="font-size: 1.2rem; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">jgr-ui / demo</h1> <section><h2 class="section-title svelte-1du1zi4">JgrCta</h2> <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">`);
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
      $$renderer3.push(`<!----></div></section> <section><h2 class="section-title svelte-1du1zi4">JgrItem</h2> <div style="border: 1px solid var(--border); border-radius: 3px; overflow: hidden; max-width: 420px;">`);
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
      $$renderer3.push(`<!----></div></section> <section style="padding: 0; overflow: hidden;"><h2 class="section-title svelte-1du1zi4" style="padding: 0;">JgrLayout</h2> <div style="height: 280px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden; margin-top: 0.8rem;">`);
      {
        let topbar = function($$renderer4) {
          $$renderer4.push(`<div style="height: 30px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em;">topbar</span></div>`);
        }, left = function($$renderer4) {
          $$renderer4.push(`<div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">colonne gauche</span></div>`);
        }, center = function($$renderer4) {
          $$renderer4.push(`<div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">colonne centre</span></div>`);
        }, right = function($$renderer4) {
          $$renderer4.push(`<div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">colonne droite</span></div>`);
        }, footer = function($$renderer4) {
          $$renderer4.push(`<div style="height: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem;"><span style="font-size: 0.5rem; color: #3a3a4a; font-family: 'JetBrains Mono', monospace;">footer</span></div>`);
        };
        JgrLayout($$renderer3, {
          height: "280px",
          leftWidth: 180,
          rightWidth: 180,
          topbar,
          left,
          center,
          right,
          footer
        });
      }
      $$renderer3.push(`<!----></div></section> <section><h2 class="section-title svelte-1du1zi4">JgrTabs + JgrConsole + JgrPrompt</h2> <div style="height: 360px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">`);
      {
        let children = function($$renderer4, tab) {
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
            $$renderer4.push(`<!----> <div style="font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">Valeur : ${escape_html(promptValue)}</div></div>`);
          } else if (tab === "items") {
            $$renderer4.push("<!--[2-->");
            $$renderer4.push(`<div>`);
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
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        JgrTabs($$renderer3, {
          tabs,
          activeTab,
          children
        });
      }
      $$renderer3.push(`<!----></div></section> <div class="divider svelte-1du1zi4"></div> <h2 class="section-title svelte-1du1zi4" style="font-size: 0.8rem; color: var(--text-secondary);">JgrTabList</h2> <section><h3 class="demo-title svelte-1du1zi4">1 — Liste simple, 3 onglets</h3> <p class="demo-desc svelte-1du1zi4">Onglets TODO / Issues / Tasks avec items basiques. Recherche filtrante intégrée.</p> <div class="demo-box svelte-1du1zi4">`);
      JgrTabList($$renderer3, {
        tabs: demo1Tabs,
        activeTab: demo1Tab,
        ontabchange: (id) => demo1Tab = id
      });
      $$renderer3.push(`<!----></div></section> <section><h3 class="demo-title svelte-1du1zi4">2 — CTA header + état pending (stale)</h3> <p class="demo-desc svelte-1du1zi4">Chaque onglet peut avoir un CTA dans la barre de tabs.<br/> L'action sur un item met toute la liste en stale jusqu'à la réponse.
      Cliquer <strong class="svelte-1du1zi4">→ Task</strong> ou <strong class="svelte-1du1zi4">Fermer</strong> pour tester.</p> <div class="demo-box svelte-1du1zi4">`);
      JgrTabList($$renderer3, {
        tabs: demo2Tabs(),
        activeTab: demo2Tab,
        ontabchange: (id) => demo2Tab = id
      });
      $$renderer3.push(`<!----></div></section> <section><h3 class="demo-title svelte-1du1zi4">3 — Snippet <code class="svelte-1du1zi4">detail</code> — panel inline sous l'item sélectionné</h3> <p class="demo-desc svelte-1du1zi4">Cliquer sur un TODO affiche le contexte de code en-dessous.<br/> Le snippet <code>detail(tabId, itemId)</code> est rendu inline après l'item actif.</p> <div class="demo-box svelte-1du1zi4">`);
      {
        let detail = function($$renderer4, tabId, itemId) {
          if (tabId === "todos" && demo3Details[itemId]) {
            $$renderer4.push("<!--[0-->");
            const d = demo3Details[itemId];
            $$renderer4.push(`<div class="detail-panel svelte-1du1zi4"><div class="detail-header svelte-1du1zi4"><span class="detail-file svelte-1du1zi4">${escape_html(d.file)}</span> <span class="detail-line svelte-1du1zi4">:${escape_html(d.line)}</span></div> <pre class="detail-code svelte-1du1zi4">${escape_html(d.excerpt)}</pre></div>`);
          } else if (tabId === "issues") {
            $$renderer4.push("<!--[1-->");
            $$renderer4.push(`<div class="detail-panel svelte-1du1zi4"><div class="detail-header svelte-1du1zi4"><span class="detail-file svelte-1du1zi4">Issue #${escape_html(itemId)}</span></div> <p class="detail-text svelte-1du1zi4">Détail complet de l'issue, labels, assignees, body…</p></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        JgrTabList($$renderer3, {
          tabs: demo3Tabs(),
          activeTab: demo3Tab,
          ontabchange: (id) => {
            demo3Tab = id;
            demo3SelId = void 0;
          },
          onselect: (_tabId, item) => {
            demo3SelId = demo3SelId === item.id ? void 0 : item.id;
          },
          detail
        });
      }
      $$renderer3.push(`<!----></div></section> <section><h3 class="demo-title svelte-1du1zi4">4 — Snippet <code class="svelte-1du1zi4">customcontent</code> — onglet à contenu libre</h3> <p class="demo-desc svelte-1du1zi4">Un onglet sans <code>items</code> reçoit le snippet <code>customcontent(tabId)</code>.<br/> Ici l'onglet <strong class="svelte-1du1zi4">Status</strong> affiche un panneau métier arbitraire.</p> <div class="demo-box svelte-1du1zi4">`);
      {
        let customcontent = function($$renderer4, tabId) {
          if (tabId === "custom") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="status-panel svelte-1du1zi4"><div class="status-title svelte-1du1zi4">Projet courant</div> <!--[-->`);
            const each_array = ensure_array_like(statusLines);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let row = each_array[$$index];
              $$renderer4.push(`<div class="status-row svelte-1du1zi4"><span class="status-key svelte-1du1zi4">${escape_html(row.label)}</span> <span class="status-val svelte-1du1zi4"${attr_style(`color: ${stringify(row.color)}`)}>${escape_html(row.value)}</span></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        JgrTabList($$renderer3, {
          tabs: demo4Tabs,
          activeTab: demo4Tab,
          ontabchange: (id) => demo4Tab = id,
          onselect: (_tabId, item) => item.id,
          customcontent
        });
      }
      $$renderer3.push(`<!----></div></section> <section><h3 class="demo-title svelte-1du1zi4">5 — États loading / vide / dimmed</h3> <p class="demo-desc svelte-1du1zi4">Items <code>dimmed</code>, onglet en chargement, liste vide avec message personnalisé.</p> <div class="demo-row svelte-1du1zi4"><div class="demo-box-sm svelte-1du1zi4"><p class="demo-sublabel svelte-1du1zi4">loading</p> <div class="demo-inner svelte-1du1zi4">`);
      JgrTabList($$renderer3, {
        tabs: [{ id: "a", label: "Issues", items: [], loading: true }]
      });
      $$renderer3.push(`<!----></div></div> <div class="demo-box-sm svelte-1du1zi4"><p class="demo-sublabel svelte-1du1zi4">empty (message custom)</p> <div class="demo-inner svelte-1du1zi4">`);
      JgrTabList($$renderer3, {
        tabs: [
          {
            id: "a",
            label: "Tasks",
            items: [],
            empty: "Toutes les tasks sont mergées ✓"
          }
        ]
      });
      $$renderer3.push(`<!----></div></div> <div class="demo-box-sm svelte-1du1zi4"><p class="demo-sublabel svelte-1du1zi4">items dimmed</p> <div class="demo-inner svelte-1du1zi4">`);
      JgrTabList($$renderer3, {
        tabs: [
          {
            id: "a",
            label: "Tasks",
            items: [
              {
                id: "1",
                label: "OAuth Google",
                prefix: "#12",
                labels: [{ name: "Mergée", color: "4caf50" }],
                dimmed: true
              },
              {
                id: "2",
                label: "Bug 500 prod",
                prefix: "#14",
                labels: [{ name: "impl.", color: "9181f9" }],
                dimmed: false
              },
              {
                id: "3",
                label: "Mise à jour deps",
                prefix: "#15",
                labels: [{ name: "Mergée", color: "4caf50" }],
                dimmed: true
              }
            ]
          }
        ]
      });
      $$renderer3.push(`<!----></div></div></div></section></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
