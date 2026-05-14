const state = {
  type: null,
  presetIndex: 0,
  presets: [],
  config: null,
  values: {}
};

const els = {
  title: document.querySelector("[data-title]"),
  summary: document.querySelector("[data-summary]"),
  total: document.querySelector("[data-total]"),
  note: document.querySelector("[data-note]"),
  stack: document.querySelector("[data-condition-stack]"),
  lines: document.querySelector("[data-summary-lines]"),
  modal: document.querySelector("[data-type-modal]"),
  presetSelect: document.querySelector("[data-preset-select]")
};

const money = (value) => `RM${Math.round(value).toLocaleString("en-MY")}`;

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadPresetSequence = async (type) => {
  const presets = [];
  for (let index = 0; ; index += 1) {
    const suffix = String(index).padStart(2, "0");
    const response = await fetch(`data/defaultData_${type}_${suffix}.json`, { cache: "no-cache" }).catch(() => null);
    if (!response || !response.ok) break;
    presets.push(await response.json());
  }
  return presets;
};

const setDefaults = () => {
  state.values = {};
  state.config.conditions.forEach((condition) => {
    state.values[condition.id] = clone(condition.default ?? 0);
  });
};

const setUrlType = (type) => {
  const url = new URL(window.location.href);
  url.searchParams.set("type", type);
  window.history.replaceState({}, "", url);
};

const getValue = (condition) => state.values[condition.id] ?? condition.default ?? 0;

const getOption = (condition) => {
  const value = Number(getValue(condition));
  return condition.options?.[value] || condition.options?.[0];
};

const getGroupedSelection = (condition) => {
  const groups = condition.groups || [];
  const saved = state.values[condition.id] || {};
  const groupId = saved.group || condition.default?.group || groups[0]?.id;
  const group = groups.find((item) => item.id === groupId) || groups[0];
  const optionId = saved.option || condition.default?.option || group?.options?.[0]?.id;
  const option = group?.options?.find((item) => item.id === optionId) || group?.options?.[0];
  return { group, option };
};

const calculate = () => {
  if (!state.config) return { total: 0, note: "Waiting for selection.", lines: [] };

  let base = 0;
  let multiplier = 1;
  let extras = 0;
  let manual = false;
  const lines = [];

  state.config.conditions.forEach((condition) => {
    if (condition.kind === "groupedOption") {
      const { group, option } = getGroupedSelection(condition);
      if (!option) return;
      if (option.manual) manual = true;
      if (condition.role === "base") base = option.price || 0;
      lines.push({ name: condition.name, value: `${group.label} / ${option.label}`, detail: option.manual ? "Negotiation" : money(option.price || 0) });
    }

    if (condition.kind === "option") {
      const option = getOption(condition);
      if (!option) return;
      if (option.manual) manual = true;
      if (condition.role === "base") base = option.price || 0;
      if (condition.role === "multiplier") multiplier *= option.coefficient || 1;
      lines.push({
        name: condition.name,
        value: option.label,
        detail: condition.role === "base" ? (option.manual ? "Negotiation" : money(option.price || 0)) : `x${option.coefficient || 1}`
      });
    }

    if (condition.kind === "number") {
      const count = Number(getValue(condition));
      const fee = count * (condition.fee || 0);
      extras += fee;
      lines.push({ name: condition.name, value: String(count), detail: `+${money(fee)}` });
    }

    if (condition.kind === "toggle") {
      const enabled = Boolean(getValue(condition));
      const fee = enabled ? condition.fee || 0 : 0;
      extras += fee;
      lines.push({ name: condition.name, value: enabled ? "Yes" : "No", detail: `+${money(fee)}` });
    }
  });

  const total = manual ? null : base * multiplier + extras;
  return {
    total,
    note: manual ? "Manual negotiation required for this selection." : `Base ${money(base)} x ${multiplier.toFixed(2)} + extras ${money(extras)}`,
    lines
  };
};

const interpretation = (condition) => {
  if (condition.kind === "groupedOption") {
    const { group, option } = getGroupedSelection(condition);
    return `${condition.description} Current setting: ${group.label} / ${option.label}. ${option.description || ""}`;
  }
  if (condition.kind === "option") {
    const option = getOption(condition);
    return `${condition.description} Current setting: ${option.label}. ${option.description || ""}`;
  }
  if (condition.kind === "toggle") {
    return `${condition.description} Current setting: ${getValue(condition) ? "enabled" : "disabled"}.`;
  }
  return `${condition.description} Current value: ${getValue(condition)}.`;
};

const makeTicks = (labels) => {
  const ticks = document.createElement("div");
  ticks.className = "slider-ticks";
  labels.forEach((label) => {
    const item = document.createElement("span");
    item.textContent = label;
    ticks.append(item);
  });
  return ticks;
};

const makeRange = (condition, labels) => {
  const wrap = document.createElement("div");
  wrap.className = "slider-area";
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(condition.min ?? 0);
  input.max = String(condition.max ?? labels.length - 1);
  input.step = String(condition.step ?? 1);
  input.value = getValue(condition);
  input.addEventListener("input", () => {
    state.values[condition.id] = Number(input.value);
    render();
  });
  wrap.append(input, makeTicks(labels));
  return wrap;
};

const renderGroupedOption = (condition) => {
  const { group, option } = getGroupedSelection(condition);
  const wrap = document.createElement("div");
  wrap.className = "select-grid";

  const groupSelect = document.createElement("select");
  condition.groups.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.label;
    opt.selected = item.id === group.id;
    groupSelect.append(opt);
  });

  const optionSelect = document.createElement("select");
  group.options.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.label;
    opt.selected = item.id === option.id;
    optionSelect.append(opt);
  });

  groupSelect.addEventListener("change", () => {
    const nextGroup = condition.groups.find((item) => item.id === groupSelect.value);
    state.values[condition.id] = { group: nextGroup.id, option: nextGroup.options[0].id };
    render();
  });
  optionSelect.addEventListener("change", () => {
    state.values[condition.id] = { group: group.id, option: optionSelect.value };
    render();
  });

  wrap.append(groupSelect, optionSelect);
  return wrap;
};

const renderCondition = (condition) => {
  const card = document.createElement("section");
  card.className = "condition-card";
  card.dataset.condition = condition.id;

  const heading = document.createElement("div");
  heading.className = "condition-title-row";
  const title = document.createElement("h3");
  title.textContent = condition.name;
  const type = document.createElement("span");
  type.className = "condition-type";
  type.textContent = condition.role || condition.kind;
  heading.append(title, type);

  const control = document.createElement("div");
  control.className = "condition-control";

  if (condition.kind === "groupedOption") {
    control.append(renderGroupedOption(condition));
  }
  if (condition.kind === "option") {
    control.append(makeRange(condition, condition.options.map((option) => option.label)));
  }
  if (condition.kind === "number") {
    const min = condition.min ?? 0;
    const max = condition.max ?? 10;
    const mid = Math.round((min + max) / 2);
    control.append(makeRange(condition, [String(min), String(mid), String(max)]));
  }
  if (condition.kind === "toggle") {
    const label = document.createElement("label");
    label.className = "toggle-row";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(getValue(condition));
    input.addEventListener("change", () => {
      state.values[condition.id] = input.checked;
      render();
    });
    label.append(input, document.createTextNode(condition.label || "Enabled"));
    control.append(label);
  }

  const current = document.createElement("span");
  current.className = "value-pill";
  const coeff = document.createElement("span");
  coeff.className = "coefficient-pill";

  if (condition.kind === "groupedOption") {
    const { group, option } = getGroupedSelection(condition);
    current.textContent = `${group.label} / ${option.label}`;
    coeff.textContent = option.manual ? "Manual" : money(option.price || 0);
  } else if (condition.kind === "option") {
    const option = getOption(condition);
    current.textContent = option.label;
    coeff.textContent = condition.role === "base" ? (option.manual ? "Manual" : money(option.price || 0)) : `x${option.coefficient || 1}`;
  } else if (condition.kind === "toggle") {
    current.textContent = getValue(condition) ? "Yes" : "No";
    coeff.textContent = `+${money(getValue(condition) ? condition.fee || 0 : 0)}`;
  } else {
    current.textContent = getValue(condition);
    coeff.textContent = `+${money((condition.fee || 0) * getValue(condition))}`;
  }
  control.append(current, coeff);

  const description = document.createElement("p");
  description.className = "condition-description";
  description.textContent = interpretation(condition);

  card.append(heading, control, description);
  return card;
};

const renderSummary = (result) => {
  els.total.textContent = result.total === null ? "Negotiation" : money(result.total);
  els.note.textContent = result.note;
  els.lines.innerHTML = result.lines
    .map((line) => `<div class="summary-line"><strong>${line.name}</strong>${line.value} - ${line.detail}</div>`)
    .join("");
};

const renderPresetSelect = () => {
  els.presetSelect.innerHTML = "";
  state.presets.forEach((preset, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = preset.presetName || `${preset.title} ${String(index).padStart(2, "0")}`;
    option.selected = index === state.presetIndex;
    els.presetSelect.append(option);
  });
};

const render = () => {
  els.stack.innerHTML = "";
  state.config.conditions.forEach((condition) => els.stack.append(renderCondition(condition)));
  els.title.textContent = state.config.title;
  els.summary.textContent = state.config.summary;
  renderPresetSelect();
  renderSummary(calculate());
};

const loadPreset = (index) => {
  state.presetIndex = index;
  state.config = clone(state.presets[index]);
  setDefaults();
  render();
};

const initType = async (type, syncUrl = false) => {
  state.type = type;
  if (syncUrl) setUrlType(type);
  state.presets = await loadPresetSequence(type);
  state.presetIndex = 0;
  state.config = clone(state.presets[0]);
  setDefaults();
  els.modal.hidden = true;
  render();
};

const download = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const exportImage = () => {
  if (!state.config) return;
  const result = calculate();
  const canvas = document.createElement("canvas");
  canvas.width = 1100;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fffaf1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#117a7a";
  ctx.fillRect(0, 0, canvas.width, 110);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 38px Arial";
  ctx.fillText(state.config.title, 48, 68);
  ctx.fillStyle = "#172125";
  ctx.font = "700 62px Arial";
  ctx.fillText(result.total === null ? "Negotiation" : money(result.total), 48, 180);
  ctx.font = "24px Arial";
  ctx.fillStyle = "#667175";
  ctx.fillText(result.note, 48, 224);
  ctx.font = "22px Arial";
  result.lines.slice(0, 12).forEach((line, index) => {
    const y = 286 + index * 34;
    ctx.fillStyle = "#172125";
    ctx.fillText(line.name, 48, y);
    ctx.fillStyle = "#667175";
    ctx.fillText(`${line.value}  ${line.detail}`, 430, y);
  });
  canvas.toBlob((blob) => download(`quotation-${state.type}.png`, blob), "image/png");
};

document.querySelectorAll("[data-select-type]").forEach((button) => {
  button.addEventListener("click", () => initType(button.dataset.selectType, true));
});

els.presetSelect.addEventListener("change", () => loadPreset(Number(els.presetSelect.value)));

document.querySelector("[data-export-image]").addEventListener("click", exportImage);

const params = new URLSearchParams(location.search);
const initialType = params.get("type");
if (initialType === "videoEditing" || initialType === "illustration") {
  initType(initialType);
} else {
  els.modal.hidden = false;
}
