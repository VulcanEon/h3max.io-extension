const PRESETS = [
  {
    id: "cinematic-reveal",
    icon: "◐",
    title: "Cinematic",
    direction:
      "Create a cinematic reveal with clear visual progression, dimensional lighting, natural motion, and a strong final composition.",
  },
  {
    id: "product-ad",
    icon: "◆",
    title: "Product ad",
    direction:
      "Create a premium product commercial with precise material detail, controlled highlights, purposeful motion, and a memorable hero ending.",
  },
  {
    id: "character-shot",
    icon: "●",
    title: "Character",
    direction:
      "Create an expressive character-driven shot with consistent identity, believable body motion, subtle facial performance, and cinematic blocking.",
  },
  {
    id: "nature-travel",
    icon: "⌁",
    title: "Nature",
    direction:
      "Create an immersive nature or travel sequence with atmospheric depth, organic environmental motion, realistic light, and a sense of scale.",
  },
  {
    id: "stylized-motion",
    icon: "✦",
    title: "Stylized",
    direction:
      "Create a stylized motion piece with a cohesive art direction, intentional color palette, clean silhouettes, and fluid animation timing.",
  },
  {
    id: "frame-transition",
    icon: "⇢",
    title: "Frame transition",
    direction:
      "Animate a coherent transition from the supplied first frame to the supplied last frame while preserving subjects, spatial logic, and visual continuity.",
  },
];

const DEFAULTS = {
  presetId: PRESETS[0].id,
  details: "",
  duration: "10",
  resolution: "768P",
  camera: "A smooth cinematic push-in",
  audio: true,
};

const STORAGE_KEY = "h3max-video-prompt-studio-state";

const elements = {
  presetGrid: document.querySelector("#preset-grid"),
  details: document.querySelector("#scene-details"),
  duration: document.querySelector("#duration"),
  resolution: document.querySelector("#resolution"),
  camera: document.querySelector("#camera"),
  audio: document.querySelector("#audio"),
  output: document.querySelector("#prompt-output"),
  status: document.querySelector("#status"),
  reset: document.querySelector("#reset-button"),
  copy: document.querySelector("#copy-button"),
  open: document.querySelector("#open-button"),
};

let state = { ...DEFAULTS };

function hasChromeStorage() {
  return Boolean(
    typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,
  );
}

function hasChromeTabs() {
  return Boolean(typeof chrome !== "undefined" && chrome.tabs);
}

function getPreset(id) {
  return PRESETS.find((preset) => preset.id === id) || PRESETS[0];
}

function normalize(value) {
  return value.trim().replace(/\s+/g, " ");
}

function buildPrompt() {
  const preset = getPreset(state.presetId);
  const details = normalize(state.details);
  const scene = details || "Describe the main subject, action, setting, and mood";
  const audio = state.audio
    ? "Generate synchronized audio with scene-appropriate ambience, tactile sound effects, and precise timing."
    : "No audio direction; focus on visual motion and continuity.";

  return [
    `${preset.direction} Scene: ${scene}.`,
    `Camera: ${state.camera}. Keep movement smooth, motivated, and physically believable.`,
    `Timing and output: ${state.duration} seconds at ${state.resolution}. Maintain temporal consistency, stable subject identity, and clean frame-to-frame detail.`,
    `Audio: ${audio}`,
    "Avoid flicker, warping, duplicate subjects, broken anatomy, unreadable text, abrupt camera jumps, and unintended logos.",
  ].join("\n\n");
}

function setStatus(message) {
  elements.status.textContent = message;
}

function renderPresets() {
  elements.presetGrid.replaceChildren();

  PRESETS.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-card";
    button.dataset.presetId = preset.id;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(state.presetId === preset.id));
    button.setAttribute("aria-label", `${preset.title} prompt starter`);

    const icon = document.createElement("span");
    icon.className = "preset-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = preset.icon;

    const title = document.createElement("span");
    title.className = "preset-title";
    title.textContent = preset.title;

    button.append(icon, title);
    button.addEventListener("click", () => {
      state.presetId = preset.id;
      update();
    });

    elements.presetGrid.append(button);
  });
}

function syncControls() {
  elements.details.value = state.details;
  elements.duration.value = state.duration;
  elements.resolution.value = state.resolution;
  elements.camera.value = state.camera;
  elements.audio.checked = state.audio;
}

async function persist() {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function readControls() {
  state.details = elements.details.value;
  state.duration = elements.duration.value;
  state.resolution = elements.resolution.value;
  state.camera = elements.camera.value;
  state.audio = elements.audio.checked;
}

function update(options = {}) {
  renderPresets();
  elements.output.value = buildPrompt();
  if (!options.skipPersist) {
    void persist();
  }
}

function sanitizeStoredState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ...DEFAULTS };
  }

  return {
    presetId: getPreset(candidate.presetId).id,
    details:
      typeof candidate.details === "string" ? candidate.details : DEFAULTS.details,
    duration: ["5", "10", "15"].includes(candidate.duration)
      ? candidate.duration
      : DEFAULTS.duration,
    resolution: ["480P", "768P"].includes(candidate.resolution)
      ? candidate.resolution
      : DEFAULTS.resolution,
    camera:
      typeof candidate.camera === "string" ? candidate.camera : DEFAULTS.camera,
    audio:
      typeof candidate.audio === "boolean" ? candidate.audio : DEFAULTS.audio,
  };
}

async function restore() {
  try {
    let saved;
    if (hasChromeStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      saved = result[STORAGE_KEY];
    } else {
      const raw = localStorage.getItem(STORAGE_KEY);
      saved = raw ? JSON.parse(raw) : undefined;
    }
    state = sanitizeStoredState(saved);
  } catch (error) {
    console.error("Failed to restore prompt studio state", error);
    state = { ...DEFAULTS };
  }

  syncControls();
  update({ skipPersist: true });
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(elements.output.value);
    setStatus("Prompt copied — paste it into the H3 Max workspace.");
  } catch (error) {
    console.error("Clipboard copy failed", error);
    elements.output.focus();
    elements.output.select();
    setStatus("Select the prompt and copy it manually.");
  }
}

function openH3Max() {
  const url =
    "https://h3max.io/?utm_source=chrome_extension&utm_medium=side_panel&utm_campaign=video_prompt_studio";
  if (hasChromeTabs()) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, "_blank", "noopener");
  }
  setStatus("Opened h3max.io in a new tab.");
}

[
  elements.details,
  elements.duration,
  elements.resolution,
  elements.camera,
  elements.audio,
].forEach((control) => {
  control.addEventListener("input", () => {
    readControls();
    update();
    setStatus("");
  });
});

elements.reset.addEventListener("click", () => {
  state = { ...DEFAULTS };
  syncControls();
  update();
  setStatus("Prompt studio reset.");
});

elements.copy.addEventListener("click", () => void copyPrompt());
elements.open.addEventListener("click", openH3Max);

void restore();
