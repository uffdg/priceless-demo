/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const STORAGE_KEY = "priceless-demo-v4";
const STATE_VERSION = 4;

const S = {
  index:               "index",
  merchantInvite:      "merchant/invite",
  merchantJoin:        "merchant/join",
  merchantRegister:    "merchant/register",
  merchantOtp:         "merchant/otp",
  merchantOnboard:     "merchant/onboard",
  merchantDashboard:   "merchant/dashboard",
  merchantBenefits:    "merchant/benefits",
  merchantNew:         "merchant/new",
  merchantPartnerships:"merchant/partnerships",
  networkQueue:        "network/queue",
  networkDetail:       "network/detail",
  networkAI:           "network/ai",
  networkRules:        "network/rules",
  networkLibrary:      "network/library",
  issuerLibrary:       "issuer/library",
  issuerActivation:    "issuer/activation",
  issuerAnalytics:     "issuer/analytics",
  issuerLifecycle:     "issuer/lifecycle",
};

/* ─── DEMO DATA ──────────────────────────────────────────────────────────── */
const DEMO_BENEFITS = [
  { id:"b1", title:"Enjoy a delicious breakfast at Spot with 50% off", assigned:400,  used:400,  status:"Pending",   color:"#9B59B6", initials:"SP" },
  { id:"b2", title:"Get 5% cashback all March with your Cashi payment", assigned:4853, used:4853, status:"Published", color:"#2E86C1", initials:"CA" },
  { id:"b3", title:"20% Off pantry essentials",                         assigned:100,  used:100,  status:"Published", color:"#27AE60", initials:"PE" },
  { id:"b4", title:"15% Off school shoes",                              assigned:7000, used:7000, status:"Published", color:"#2C3E50", initials:"SS" },
  { id:"b5", title:"$300 Bonus on select smartphones",                  assigned:7000, used:7000, status:"Published", color:"#1A5276", initials:"PH" },
  { id:"b6", title:"Up to 30% off cleaning products",                   assigned:1000, used:1000, status:"Paused",    color:"#28B463", initials:"CP" },
];

const DEMO_BENEFIT_DETAIL = {
  id: "b-zappos",
  title: "Valentine's Day 2-for-1 Shoes",
  tagline: "Buy one pair, get one free for Valentine's Day.",
  description: "$40 cash back reward on purchases + $400",
  status: "Pending",
  assigned: 923,
  used: 423,
  audience: "~40%",
  audienceCount: "3265 members approx",
  images: [
    { label:"Hero offer",      kind:"hero",     title:"2-for-1",      sub:"Valentine shoes" },
    { label:"Lifestyle",       kind:"lifestyle", title:"Date night",  sub:"Weekend drop" },
    { label:"Product shot",    kind:"product",  title:"New arrivals", sub:"Selected pairs" },
    { label:"Member code",     kind:"code",     title:"Cashback",     sub:"Scan to redeem" },
  ],
  days: ["D","L","M","M","J","V","S"],
  activeDays: [1,2,3,4],
};

function defaultBenefitDraft() {
  return {
    title: "Valentine's Day 2-for-1 Shoes",
    description: "",
    type: "cashback",
    discountValue: "40",
    productCode: "",
    hasProductCode: true,
    timezone: "Buenos Aires, Argentina (GMT -3:00)",
    startDate: "09/17/2025",
    startTime: "12:00 AM",
    endDate: "",
    endTime: "",
    withoutEnd: true,
    activeDays: [1,2,3,4,5],
    mediaTitle: "Chasback: $40",
    mediaDescription: "",
    mediaAssets: [
      { id: "label", label: "Main", name: "", src: "", title: "", alt: "" },
      { id: "secondary", label: "Secondary", name: "", src: "", title: "", alt: "" },
      { id: "extra", label: "Extra", name: "", src: "", title: "", alt: "", optional: true },
    ],
  };
}

function buildMockMediaAsset(kind, title, sub) {
  const palettes = {
    hero: ["#2D1B38", "#6C2A73", "#F08B26"],
    lifestyle: ["#7A1D33", "#D85B78", "#F7C7A2"],
    product: ["#1C2A3E", "#355D8A", "#8FC7FF"],
    code: ["#111114", "#3B3F47", "#848B99"],
  };
  const icons = {
    hero: "★",
    lifestyle: "♥",
    product: "◌",
    code: "▣",
  };
  const [c1, c2, c3] = palettes[kind] || palettes.hero;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="55%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
      </defs>
      <rect width="480" height="320" rx="28" fill="url(#g)"/>
      <circle cx="396" cy="72" r="58" fill="rgba(255,255,255,0.12)"/>
      <text x="34" y="210" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#FFFFFF">${title}</text>
      <text x="34" y="246" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.82)">${sub}</text>
      <text x="390" y="238" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" fill="rgba(255,255,255,0.92)">${icons[kind] || "★"}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function loadBenefitIntoWizard(benefitId) {
  const selected = state.benefits.find(b => b.id === benefitId);
  const detail = { ...DEMO_BENEFIT_DETAIL, title: selected?.title || DEMO_BENEFIT_DETAIL.title };
  state.editingBenefitId = benefitId;
  state.wizardTab = "basic";
  state.benefit = {
    ...defaultBenefitDraft(),
    title: detail.title,
    description: detail.description,
    discountValue: "40",
    hasProductCode: false,
    productCode: "",
    startDate: "09/17/2025",
    startTime: "12:00 AM",
    endDate: "",
    endTime: "",
    withoutEnd: true,
    activeDays: [0,4,5,6],
    mediaTitle: "Chasback: $40",
    mediaDescription: detail.tagline,
    mediaAssets: defaultBenefitDraft().mediaAssets.map((asset, index) => {
      const source = detail.images[index];
      if (!source) return asset;
      return {
        ...asset,
        name: `${source.label}.png`,
        src: buildMockMediaAsset(source.kind, source.title, source.sub),
        title: source.title,
        alt: `${source.sub} visual`,
      };
    }),
  };
  state.funding = {
    ...state.funding,
    model: "cofunded",
    merchantPct: 70,
    totalBudget: "50000",
    perRedemption: "40",
  };
}

function initialsFromTitle(title) {
  const parts = cleanFieldValue(title).split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(part => part[0]).join("") || "BN").toUpperCase();
}

function saveWizardBenefitToList(status) {
  const title = cleanFieldValue(state.benefit.title) || DEMO_BENEFIT_DETAIL.title;
  if (state.editingBenefitId) {
    const current = state.benefits.find(b => b.id === state.editingBenefitId);
    if (current) {
      current.title = title;
      current.status = status;
      current.initials = initialsFromTitle(title);
      return current.id;
    }
  }

  const id = `b-${Date.now()}`;
  state.benefits.unshift({
    id,
    title,
    assigned: 0,
    used: 0,
    status,
    color: "#E07820",
    initials: initialsFromTitle(title),
  });
  return id;
}

/* ─── STATE ──────────────────────────────────────────────────────────────── */
function initialState() {
  return {
    version: 4,
    screen: parseHash(),
    // merchant auth flow
    merchantOnboarded: false,
    merchantEmail: "",
    merchantOtp: "358606",
    company: { name:"Zappos", size:"", industry:"Footwear", city:"Las Vegas", website:"zappos.com", logo:null },
    // benefits list
    selectedBenefitId: null,
    benefits: [...DEMO_BENEFITS],
    benefitsStatus: "all",
    editingBenefitId: null,
    activePicker: null,
    // wizard
    wizardTab: "basic",
    benefit: defaultBenefitDraft(),
    // funding model
    funding: {
      model: "merchant", // "merchant" | "cofunded" | "issuer"
      merchantPct: 70,
      totalBudget: "50000",
      perRedemption: "40",
    },
    // partnerships selected issuer
    selectedIssuerId: null,
    partnershipsStatus: "all",
    mediaEditor: null,
    // network orchestrator
    network: {
      selectedDealId: null,
      reviewNotes: "",
      queueFilter: "all",
      rulesTab: "all",
      libraryTab: "all",
      confirmModal: null, // null | { action: "approve"|"reject"|"changes" }
    },
    // issuer publisher
    issuer: {
      libraryFilter: "all",
      selectedDealId: null,
      activationStep: 0,        // 0=configure 1=preview 2=confirm
      activation: {
        segment: "all",         // "all"|"premium"|"millennials"|"families"
        budgetCap: "22000",
        channels: ["app","email"],
        publishDate: "04/01/2026",
        publishTime: "9:00 AM",
        notes: "",
      },
      activatedDeals: [],       // ids of deals activated by this issuer
    },
    // shared with orchestrator / issuer
    workflow: {
      submitted: false,
      orchestratorDecision: null, // null | "approved" | "changes" | "rejected"
      issuerActivated: false,
    },
  };
}

function loadState() {
  try {
    // try current key first
    let raw = localStorage.getItem(STORAGE_KEY);
    // migrate from v3 if present
    if (!raw) {
      const oldRaw = localStorage.getItem("priceless-demo-v3");
      if (oldRaw) {
        const old = JSON.parse(oldRaw);
        // carry over workflow, company, merchantOnboarded from v3
        const init = initialState();
        const migrated = {
          ...init,
          merchantOnboarded: old.merchantOnboarded ?? init.merchantOnboarded,
          merchantEmail: old.merchantEmail ?? init.merchantEmail,
          company: { ...init.company, ...(old.company || {}) },
          benefits: old.benefits ?? init.benefits,
          workflow: { ...init.workflow, ...(old.workflow || {}) },
        };
        return { ...migrated, screen: parseHash() };
      }
      return initialState();
    }
    const parsed = JSON.parse(raw);
    if (parsed.version !== STATE_VERSION) return initialState();
    const def = initialState();
    const next = {
      ...def,
      ...parsed,
      screen: parseHash(),
      // deep-merge sub-objects so new keys added in later versions are present
      network: { ...def.network,  ...(parsed.network  || {}) },
      issuer:  {
        ...def.issuer,
        ...(parsed.issuer || {}),
        activation: { ...def.issuer.activation, ...((parsed.issuer || {}).activation || {}) },
        activatedDeals: (parsed.issuer || {}).activatedDeals ?? [],
      },
      workflow: { ...def.workflow, ...(parsed.workflow || {}) },
    };
    next.benefit = normalizeBenefitDraft({ ...def.benefit, ...(parsed.benefit || {}) });
    next.activePicker = null;
    next.network.confirmModal = null;
    return next;
  } catch { return initialState(); }
}

const state = loadState();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseHash() {
  const h = window.location.hash.replace(/^#/, "");
  return h || S.index;
}

function navigate(screen) {
  state.screen = screen;
  window.location.hash = screen;
  save();
  render();
}

window.addEventListener("hashchange", () => {
  state.screen = parseHash();
  render();
});

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function icon(name, cls = "") {
  return `<i class="ph ph-${name}${cls ? " " + cls : ""}"></i>`;
}

function cleanFieldValue(value) {
  if (value == null) return "";
  const cleaned = String(value).trim();
  return cleaned && cleaned !== "undefined" ? cleaned : "";
}

function isValidDisplayDate(value) {
  const cleaned = cleanFieldValue(value);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(cleaned)) return false;
  const [month, day, year] = cleaned.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isValidDisplayTime(value) {
  return /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(cleanFieldValue(value));
}

function formatDateForInput(value) {
  const cleaned = cleanFieldValue(value);
  if (!isValidDisplayDate(cleaned)) return "";
  const [month, day, year] = cleaned.split("/");
  return `${year}-${month}-${day}`;
}

function formatDateFromInput(value) {
  const cleaned = cleanFieldValue(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return "";
  const [year, month, day] = cleaned.split("-");
  return `${month}/${day}/${year}`;
}

function formatTimeForInput(value) {
  const cleaned = cleanFieldValue(value).toUpperCase();
  if (!isValidDisplayTime(cleaned)) return "";
  const [time, suffix] = cleaned.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (suffix === "AM" && hours === 12) hours = 0;
  if (suffix === "PM" && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatTimeFromInput(value) {
  const cleaned = cleanFieldValue(value);
  if (!/^\d{2}:\d{2}$/.test(cleaned)) return "";
  let [hours, minutes] = cleaned.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatValiditySummary(benefit) {
  const startDate = isValidDisplayDate(benefit.startDate) ? benefit.startDate : "Not set";
  const startTime = isValidDisplayTime(benefit.startTime) ? benefit.startTime : "Not set";
  const endParts = [
    isValidDisplayDate(benefit.endDate) ? benefit.endDate : "",
    isValidDisplayTime(benefit.endTime) ? benefit.endTime : "",
  ].filter(Boolean).join(" ");
  const endValue = benefit.withoutEnd ? "Not set" : (endParts || "Not set");
  return `From ${startDate} ${startTime} to ${endValue}`.replace(/\s+/g, " ").trim();
}

function normalizeBenefitDraft(benefit) {
  const defaultAssets = defaultBenefitDraft().mediaAssets;
  const mediaAssets = Array.isArray(benefit.mediaAssets)
    ? defaultAssets.map((asset, index) => {
        const current = benefit.mediaAssets[index] || {};
        return {
          ...asset,
          name: cleanFieldValue(current.name),
          src: cleanFieldValue(current.src),
          title: cleanFieldValue(current.title),
          alt: cleanFieldValue(current.alt),
        };
      })
    : defaultAssets;
  return {
    ...benefit,
    startDate: isValidDisplayDate(benefit.startDate) ? benefit.startDate : "",
    startTime: isValidDisplayTime(benefit.startTime) ? benefit.startTime : "",
    endDate: isValidDisplayDate(benefit.endDate) ? benefit.endDate : "",
    endTime: isValidDisplayTime(benefit.endTime) ? benefit.endTime : "",
    productCode: cleanFieldValue(benefit.productCode),
    description: cleanFieldValue(benefit.description),
    mediaTitle: cleanFieldValue(benefit.mediaTitle),
    mediaDescription: cleanFieldValue(benefit.mediaDescription),
    mediaAssets,
  };
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function setByPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((acc, key) => acc[key], obj);
  target[last] = value;
}

function parseDisplayDateParts(value) {
  if (!isValidDisplayDate(value)) return null;
  const [month, day, year] = value.split("/").map(Number);
  return { year, monthIndex: month - 1, day };
}

function parseDisplayTimeParts(value) {
  if (!isValidDisplayTime(value)) return null;
  const cleaned = cleanFieldValue(value).toUpperCase();
  const [time, meridiem] = cleaned.split(" ");
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute, meridiem };
}

function openPicker(path, kind) {
  const raw = getByPath(state, path);
  if (kind === "date") {
    const parts = parseDisplayDateParts(raw) || (() => {
      const now = new Date();
      return { year: now.getFullYear(), monthIndex: now.getMonth(), day: now.getDate() };
    })();
    state.activePicker = {
      kind,
      field: path,
      year: parts.year,
      monthIndex: parts.monthIndex,
      day: parts.day,
    };
  } else {
    const parts = parseDisplayTimeParts(raw) || { hour: 12, minute: 0, meridiem: "AM" };
    state.activePicker = {
      kind,
      field: path,
      hour: parts.hour,
      minute: parts.minute,
      meridiem: parts.meridiem,
    };
  }
}

function closePicker() {
  state.activePicker = null;
}

function renderDatePicker(field, value, disabled, iconName) {
  const isOpen = state.activePicker?.field === field && state.activePicker?.kind === "date" && !disabled;
  const display = isValidDisplayDate(value) ? value : "Not set";
  let popover = "";

  if (isOpen) {
    const { year, monthIndex } = state.activePicker;
    const monthLabel = new Date(year, monthIndex, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
    const start = new Date(year, monthIndex, 1);
    const startWeekday = start.getDay();
    const gridStart = new Date(year, monthIndex, 1 - startWeekday);
    const selected = parseDisplayDateParts(value);
    const cells = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      const inMonth = date.getMonth() === monthIndex;
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const isSelected = selected
        && selected.year === date.getFullYear()
        && selected.monthIndex === date.getMonth()
        && selected.day === date.getDate();
      const today = new Date();
      const isToday = today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
      return `<button type="button" class="picker-day ${inMonth ? "" : "outside"} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}" data-picker-date="${field}" data-picker-value="${iso}">${date.getDate()}</button>`;
    }).join("");

    popover = `
      <div class="picker-popover picker-date-popover">
        <div class="picker-header">
          <button type="button" class="picker-nav" data-picker-month="${field}" data-direction="-1">${icon("caret-left")}</button>
          <div class="picker-title">${monthLabel}</div>
          <button type="button" class="picker-nav" data-picker-month="${field}" data-direction="1">${icon("caret-right")}</button>
        </div>
        <div class="picker-weekdays">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class="picker-days-grid">${cells}</div>
        <div class="picker-actions">
          <button type="button" class="picker-link" data-picker-clear="${field}">Clear</button>
          <button type="button" class="picker-link" data-picker-today="${field}">Today</button>
        </div>
      </div>`;
  }

  return `
    <div class="picker-field ${disabled ? "disabled" : ""}">
      <button type="button" class="picker-display" data-open-picker="${field}" data-picker-kind="date" ${disabled ? "disabled" : ""}>
        <span class="${display === "Not set" ? "placeholder" : ""}">${display}</span>
        <span class="input-icon">${icon(iconName)}</span>
      </button>
      ${popover}
    </div>`;
}

function renderTimePicker(field, value, disabled, iconName) {
  const isOpen = state.activePicker?.field === field && state.activePicker?.kind === "time" && !disabled;
  const display = isValidDisplayTime(value) ? value : "Not set";
  let popover = "";

  if (isOpen) {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1).map(hour =>
      `<button type="button" class="picker-chip ${state.activePicker.hour === hour ? "selected" : ""}" data-picker-hour="${field}" data-value="${hour}">${String(hour).padStart(2, "0")}</button>`
    ).join("");
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5).map(minute =>
      `<button type="button" class="picker-chip ${state.activePicker.minute === minute ? "selected" : ""}" data-picker-minute="${field}" data-value="${minute}">${String(minute).padStart(2, "0")}</button>`
    ).join("");
    const meridiems = ["AM", "PM"].map(meridiem =>
      `<button type="button" class="picker-chip ${state.activePicker.meridiem === meridiem ? "selected" : ""}" data-picker-meridiem="${field}" data-value="${meridiem}">${meridiem}</button>`
    ).join("");

    popover = `
      <div class="picker-popover picker-time-popover">
        <div class="picker-time-columns">
          <div class="picker-column">
            <div class="picker-column-title">Hour</div>
            <div class="picker-chip-grid">${hours}</div>
          </div>
          <div class="picker-column">
            <div class="picker-column-title">Minute</div>
            <div class="picker-chip-grid">${minutes}</div>
          </div>
          <div class="picker-column picker-column-sm">
            <div class="picker-column-title">Period</div>
            <div class="picker-chip-grid picker-chip-grid-period">${meridiems}</div>
          </div>
        </div>
        <div class="picker-actions">
          <button type="button" class="picker-link" data-picker-clear-time="${field}">Clear</button>
          <button type="button" class="btn btn-primary" data-picker-save-time="${field}">Save</button>
        </div>
      </div>`;
  }

  return `
    <div class="picker-field ${disabled ? "disabled" : ""}">
      <button type="button" class="picker-display" data-open-picker="${field}" data-picker-kind="time" ${disabled ? "disabled" : ""}>
        <span class="${display === "Not set" ? "placeholder" : ""}">${display}</span>
        <span class="input-icon">${icon(iconName)}</span>
      </button>
      ${popover}
    </div>`;
}

function mcLogo() {
  return `<div class="mc-circles">
    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="12" r="12" fill="#EB001B"/>
      <circle cx="24" cy="12" r="12" fill="#F79E1B"/>
      <path d="M19 4.8a12 12 0 0 1 0 14.4A12 12 0 0 1 19 4.8z" fill="#FF5F00"/>
    </svg>
  </div>`;
}

function logoBlock(size = "md") {
  const sizes = { sm: "13px", md: "15px", lg: "20px" };
  const s = sizes[size] || sizes.md;
  return `<div class="sidebar-logo">
    ${mcLogo()}
    <div>
      <div style="display:flex;align-items:center;gap:4px;">
        <span class="sidebar-brand-name" style="font-size:${s}">priceless</span>
        <span class="sidebar-brand-by">by</span>
        <span class="sidebar-brand-q">Qurable</span>
      </div>
    </div>
  </div>`;
}

function badge(status) {
  const map = {
    "Draft":             "badge-draft",
    "Pending":           "badge-pending",
    "Published":         "badge-published",
    "Paused":            "badge-paused",
    "Approved":          "badge-approved",
    "Rejected":          "badge-rejected",
    "In Review":         "badge-review",
    "Changes Requested": "badge-changes",
    "Expired":           "badge-draft",
  };
  return `<span class="badge ${map[status] || "badge-draft"}">${status}</span>`;
}

function fmtNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K" : String(n);
}

/* ─── APP SHELL (with sidebar) ───────────────────────────────────────────── */
function appShell(content, activePath) {
  const navItems = [
    { label:"Dashboard",     icon:"gauge",        path:S.merchantDashboard },
    { label:"Benefits",      icon:"gift",         path:S.merchantBenefits },
    { label:"Partnerships",  icon:"handshake",    path:S.merchantPartnerships },
    { label:"Audiences",     icon:"funnel",       path:"merchant/audiences", disabled:true },
    { label:"Members",       icon:"users",        path:"merchant/members", disabled:true },
    { divider: true },
    { label:"Redeem",        icon:"scan",         path:"merchant/redeem", disabled:true },
    { label:"Loyalty portal",icon:"layout",       path:"merchant/portal", disabled:true },
    { divider: true },
    { label:"Billing",       icon:"receipt",      path:"merchant/billing", disabled:true },
    { label:"Settings",      icon:"gear",         path:"merchant/settings", disabled:true },
    { label:"Help",          icon:"chat-circle",  path:"merchant/help", disabled:true },
  ];

  const nav = navItems.map(item => {
    if (item.divider) return `<div class="sidebar-divider"></div>`;
    const active = activePath === item.path ? "active" : "";
    if (item.disabled) {
      return `<div class="nav-item ${active}" style="opacity:.45;cursor:default">
        ${icon(item.icon)} <span>${item.label}</span>
      </div>`;
    }
    return `<a class="nav-item ${active}" href="#${item.path}">
      ${icon(item.icon)} <span>${item.label}</span>
    </a>`;
  }).join("");

  const initials = state.company.name ? state.company.name.slice(0,2).toUpperCase() : "AR";

  return `<div class="app-container">
    <aside class="sidebar">
      ${logoBlock()}
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-bottom">
        <div class="sidebar-user" data-nav="${S.index}">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <div class="user-name">Azunyan U. Wu</div>
            <div class="user-role">Basic Member</div>
          </div>
          ${icon("arrow-square-out","user-ext")}
        </div>
      </div>
    </aside>
    <div class="workspace">
      ${content}
    </div>
  </div>`;
}

/* ─── RENDER DISPATCH ────────────────────────────────────────────────────── */
function render() {
  const app = document.getElementById("app");
  app.innerHTML = renderScreen();
  bindEvents();
}

function renderPreservingWizardFormScroll() {
  const form = document.querySelector(".wizard-form");
  const pageContent = document.querySelector(".page-content");
  const windowScrollTop = window.scrollY;
  const pageScrollTop = pageContent ? pageContent.scrollTop : 0;
  const scrollTop = form ? form.scrollTop : 0;
  render();
  requestAnimationFrame(() => {
    const nextForm = document.querySelector(".wizard-form");
    const nextPageContent = document.querySelector(".page-content");
    window.scrollTo(0, windowScrollTop);
    if (nextPageContent) nextPageContent.scrollTop = pageScrollTop;
    if (nextForm) nextForm.scrollTop = scrollTop;
  });
}

function renderScreen() {
  switch (state.screen) {
    case S.index:                return renderIndex();
    case S.merchantInvite:       return renderInvite();
    case S.merchantJoin:         return renderJoin();
    case S.merchantRegister:     return renderRegister();
    case S.merchantOtp:          return renderOtp();
    case S.merchantOnboard:      return renderOnboard();
    case S.merchantDashboard:    return renderDashboard();
    case S.merchantBenefits:     return renderBenefits();
    case S.merchantNew:          return renderWizard();
    case S.merchantPartnerships: return renderPartnerships();
    case S.networkQueue:         return renderNetworkQueue();
    case S.networkDetail:        return renderNetworkDetail();
    case S.networkAI:            return renderNetworkAI();
    case S.networkRules:         return renderNetworkRules();
    case S.networkLibrary:       return renderNetworkLibrary();
    case S.issuerLibrary:        return renderIssuerLibrary();
    case S.issuerActivation:     return renderIssuerActivation();
    case S.issuerAnalytics:      return renderIssuerAnalytics();
    case S.issuerLifecycle:      return renderIssuerLifecycle();
    default:                     return renderIndex();
  }
}

/* ─── INDEX ──────────────────────────────────────────────────────────────── */
function renderIndex() {
  const wf = state.workflow;

  // Workflow progress steps
  const flowSteps = [
    { label:"Deal created",       done: state.merchantOnboarded,                                   actor:"merchant" },
    { label:"Submitted for review",done: wf.submitted,                                             actor:"merchant" },
    { label:"Under review",       done: !!wf.orchestratorDecision,                                 actor:"network"  },
    { label:"Network decision",   done: wf.orchestratorDecision === "approved",
      failed: wf.orchestratorDecision === "rejected",
      warn: wf.orchestratorDecision === "changes",                                                  actor:"network"  },
    { label:"Issuer activated",   done: wf.issuerActivated,                                        actor:"issuer"   },
  ];

  const stepDots = flowSteps.map((s, i) => {
    const cls = s.failed ? "flow-dot failed" : s.warn ? "flow-dot warn" : s.done ? "flow-dot done" : "flow-dot";
    const ico = s.failed ? "x-circle" : s.warn ? "warning" : s.done ? "check-circle" : "circle";
    return `
      <div class="flow-step">
        <div class="${cls}">${icon(ico, "ph-fill")}</div>
        <div class="flow-step-label">${s.label}</div>
      </div>
      ${i < flowSteps.length - 1 ? `<div class="flow-connector ${flowSteps[i+1].done||flowSteps[i+1].warn||flowSteps[i+1].failed?"done":""}"></div>` : ""}`;
  }).join("");

  // Derive per-actor status text
  const merchantStatus = !state.merchantOnboarded
    ? { text:"Ready to onboard", color:"var(--muted)" }
    : wf.submitted && wf.orchestratorDecision === "changes"
    ? { text:"Changes requested — update deal", color:"var(--warning)", pulse:true }
    : wf.submitted
    ? { text:`Deal submitted · ${wf.orchestratorDecision ? wf.orchestratorDecision.charAt(0).toUpperCase()+wf.orchestratorDecision.slice(1) : "Awaiting review"}`, color: wf.orchestratorDecision === "approved" ? "var(--success)" : "var(--muted)" }
    : { text:"Deal in progress", color:"var(--brand)" };

  const networkStatus = !wf.submitted
    ? { text:"No submissions yet", color:"var(--muted)" }
    : wf.orchestratorDecision
    ? { text:`Decision made: ${wf.orchestratorDecision === "approved" ? "Approved" : wf.orchestratorDecision === "rejected" ? "Rejected" : "Changes requested"}`,
        color: wf.orchestratorDecision === "approved" ? "var(--success)" : wf.orchestratorDecision === "rejected" ? "var(--danger)" : "var(--warning)" }
    : { text:"1 deal awaiting review", color:"var(--warning)", pulse:true };

  const issuerStatus = wf.issuerActivated
    ? { text:"Deal activated · Live to members", color:"var(--success)" }
    : wf.orchestratorDecision === "approved"
    ? { text:"1 approved deal ready to activate", color:"var(--brand)", pulse:true }
    : { text:"Awaiting approved deals", color:"var(--muted)" };

  const nextActor = !state.merchantOnboarded ? "merchant"
    : !wf.submitted ? "merchant"
    : !wf.orchestratorDecision ? "network"
    : wf.orchestratorDecision === "approved" && !wf.issuerActivated ? "issuer"
    : wf.orchestratorDecision === "changes" ? "merchant"
    : null;

  const actors = [
    {
      key: "merchant",
      icon: "storefront",
      label: "Zappos · Partner",
      title: "Benefit Creator",
      persona: "Nina Watts, Merchant Admin",
      copy: "Draft benefits, configure targeting, upload media, and manage published deals for your customers.",
      screen: state.merchantOnboarded ? S.merchantBenefits : S.merchantInvite,
      cta: state.merchantOnboarded ? "Open portal" : "Start onboarding",
      status: merchantStatus,
    },
    {
      key: "network",
      icon: "shield-check",
      label: "Mastercard · Network",
      title: "Deal Orchestrator",
      persona: "Marcus Patel, Network Admin",
      copy: "Review deals against governance rules, validate content, and clear offers for issuer consumption.",
      screen: S.networkQueue,
      cta: "Open console",
      status: networkStatus,
    },
    {
      key: "issuer",
      icon: "buildings",
      label: "Banco BVA · Issuer",
      title: "Issuer Publisher",
      persona: "Avery Coleman, Offer Manager",
      copy: "Discover approved deals, set activation details, and publish to your customers' channels.",
      screen: S.issuerLibrary,
      cta: "Open portal",
      status: issuerStatus,
    },
  ];

  const cards = actors.map(a => `
    <div class="actor-card ${nextActor===a.key?"actor-card-next":""}" data-nav="${a.screen}">
      ${nextActor===a.key ? `<div class="actor-next-chip">${icon("arrow-right")} Next step</div>` : ""}
      <div class="actor-card-top">
        <div class="actor-icon">${icon(a.icon)}</div>
        <div>
          <div class="actor-label">${a.label}</div>
          <div class="actor-title">${a.title}</div>
        </div>
      </div>
      <div class="actor-persona">${icon("user-circle")} ${a.persona}</div>
      <p class="actor-copy">${a.copy}</p>
      <div class="actor-status-row" style="color:${a.status.color}">
        ${a.status.pulse ? `<span class="status-pulse" style="background:${a.status.color}"></span>` : icon("circle","ph-fill")}
        <span>${a.status.text}</span>
      </div>
      <div class="actor-cta">
        <span>${a.cta}</span>
        ${icon("arrow-right")}
      </div>
    </div>`).join("");

  return `<div class="index-shell">
    <div class="index-topbar">
      <div class="index-logo">
        ${mcLogo()}
        <span class="brand-name">priceless</span>
        <span class="brand-by">by</span>
        <span class="brand-q">Qurable</span>
      </div>
      <button class="btn btn-secondary" data-action="reset-demo" style="font-size:12px;height:32px;padding:0 12px;gap:6px">
        ${icon("arrow-counter-clockwise")} Reset demo
      </button>
    </div>
    <div class="index-hero">
      <h1>Priceless Deal Orchestrator</h1>
      <p>A multi-actor demo showing how merchants, Mastercard, and issuing banks collaborate to create, approve, and publish loyalty deals.</p>
    </div>

    <div class="flow-track">
      <div class="flow-track-label">Demo progress — Zappos Valentine's 2-for-1 Shoes</div>
      <div class="flow-steps">${stepDots}</div>
    </div>

    <div class="actor-grid">${cards}</div>
  </div>`;
}

/* ─── MERCHANT AUTH FLOW ─────────────────────────────────────────────────── */
function renderInvite() {
  return `<div class="email-shell">
    <div class="email-preview-wrap">
      <div class="email-browser-bar">
        <div class="email-browser-dot" style="background:#FF5F56"></div>
        <div class="email-browser-dot" style="background:#FFBD2E"></div>
        <div class="email-browser-dot" style="background:#27C93F"></div>
        <span style="margin-left:8px">Gmail</span>
      </div>
      <div class="email-client">
        <div class="email-meta">
          <div class="email-subject">We want you to be part of us</div>
          <div class="email-from">
            <strong>FROM</strong> &lt;priceless@mastercard.com&gt; &nbsp;·&nbsp; 8:02 AM (34 minutes ago)
          </div>
        </div>
        <div class="email-body">
          <div class="email-card">
            <h2>Join the Priceless network and watch your audience soar!</h2>
            <p>Hello Alex,</p>
            <p>We are ready to take the next step together!</p>
            <p>You can now activate your partnership with Priceless and start offering benefits to millions of users across the United States.</p>
            <p>Click the link below to set up your profile.</p>
            <button class="email-card-btn" data-nav="${S.merchantJoin}">Join Priceless ${icon("arrow-right")}</button>
          </div>
        </div>
        <div class="email-cta-wrap">
          <div style="margin-bottom:8px">
            <button class="email-cta-big" data-nav="${S.merchantJoin}">Join Priceless ${icon("arrow-right")}</button>
          </div>
          <div style="font-size:13px;color:var(--muted)">or <a href="#${S.index}" style="color:var(--brand);font-weight:500">go back to actor selection</a></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderJoin() {
  return `<div class="join-shell">
    <div class="auth-topbar">
      <div class="auth-logo">
        ${mcLogo()}
        <span class="brand-name">priceless</span>
        <span class="brand-by">by</span>
        <span class="brand-q">Qurable</span>
      </div>
    </div>
    <div class="join-content">
      <div class="join-text">
        <h1>Connect with millions of users across the region, boosting your client base and enhancing their lifetime value.</h1>
        <p>Connect with millions of users through the Priceless network.<br>Join in today!</p>
        <button class="join-btn" data-nav="${S.merchantRegister}">Join Priceless ${icon("arrow-right")}</button>
        <a class="join-decline" href="#${S.index}">Decline invitation</a>
      </div>
    </div>
  </div>`;
}

function renderRegister() {
  return `<div class="auth-bg">
    <div class="auth-topbar">
      <div class="auth-logo">
        ${mcLogo()}
        <span class="brand-name">priceless</span>
        <span class="brand-by">by</span>
        <span class="brand-q">Qurable</span>
      </div>
    </div>
    <div class="auth-center">
      <div class="auth-card">
        <div>
          <div class="auth-card-title">Create an account</div>
          <div class="auth-card-sub">Already have an account? <a href="#${S.merchantBenefits}">Log in</a></div>
        </div>
        <div class="auth-field">
          <label>What's the corporate email?</label>
          <input class="auth-input" id="reg-email" type="email" placeholder="Enter the email address" value="${state.merchantEmail}" />
        </div>
        <button class="auth-btn" data-action="send-otp">Send verification code</button>
        <div class="auth-divider">OR</div>
        <button class="auth-google" data-action="google-signup">
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
          Sign up with Google
        </button>
      </div>
    </div>
  </div>`;
}

function renderOtp() {
  return `<div class="auth-bg">
    <div class="auth-topbar">
      <div class="auth-logo">
        ${mcLogo()}
        <span class="brand-name">priceless</span>
        <span class="brand-by">by</span>
        <span class="brand-q">Qurable</span>
      </div>
    </div>
    <div class="auth-center">
      <div class="auth-card">
        <div class="auth-card-title">Create an account</div>
        <div class="otp-icon">${icon("envelope-open")}</div>
        <div class="otp-hint">
          We have sent a verification number to your email
          <strong>${state.merchantEmail || "your email"}</strong>
          Enter the code below
        </div>
        <div class="otp-boxes">
          <input class="otp-box" id="otp-0" maxlength="1" inputmode="numeric" value="3" />
          <input class="otp-box" id="otp-1" maxlength="1" inputmode="numeric" value="5" />
          <input class="otp-box" id="otp-2" maxlength="1" inputmode="numeric" value="8" />
          <input class="otp-box" id="otp-3" maxlength="1" inputmode="numeric" value="6" />
          <input class="otp-box" id="otp-4" maxlength="1" inputmode="numeric" value="0" />
          <input class="otp-box" id="otp-5" maxlength="1" inputmode="numeric" value="6" />
        </div>
        <div class="otp-timer">Expires in <strong>14:38</strong></div>
        <div class="otp-resend">Didn't receive the code via email? <a href="#">Resend</a></div>
        <button class="auth-btn" data-action="verify-otp">Next</button>
      </div>
    </div>
  </div>`;
}

function renderOnboard() {
  const c = state.company;
  return `<div class="auth-bg">
    <div class="auth-topbar">
      <div class="auth-logo">
        ${mcLogo()}
        <span class="brand-name">priceless</span>
        <span class="brand-by">by</span>
        <span class="brand-q">Qurable</span>
      </div>
    </div>
    <div class="auth-center">
      <div class="auth-card">
        <div class="auth-card-title">Create an account</div>
        <div class="logo-upload">
          <p style="color:var(--brand);font-weight:600;margin:0">Add a corporate logo to your account...</p>
          <p>Supported Format: SVG, JPG, PNG (10mb each)</p>
          <div class="upload-btns">
            <button class="upload-btn">Download ${icon("download-simple")}</button>
            <button class="upload-btn filled">Browse File ${icon("upload-simple")}</button>
          </div>
          <p>.jpg .png only (800x800 px preferable)</p>
        </div>
        <div class="profile-fields">
          <div class="profile-field">
            <label>Company name</label>
            <input id="co-name" value="${c.name}" placeholder="Your company name" />
          </div>
          <div class="profile-field">
            <label>Size of business</label>
            <select id="co-size">
              <option value="">How many stores</option>
              <option value="1-10" ${c.size==="1-10"?"selected":""}>1–10 locations</option>
              <option value="11-50" ${c.size==="11-50"?"selected":""}>11–50 locations</option>
              <option value="51-200" ${c.size==="51-200"?"selected":""}>51–200 locations</option>
              <option value="200+" ${c.size==="200+"?"selected":""}>200+ locations</option>
            </select>
          </div>
          <div class="profile-field">
            <label>Industry</label>
            <select id="co-industry">
              <option value="">Select industry</option>
              <option value="Footwear" ${c.industry==="Footwear"?"selected":""}>Footwear</option>
              <option value="Fashion" ${c.industry==="Fashion"?"selected":""}>Fashion & Apparel</option>
              <option value="Food" ${c.industry==="Food"?"selected":""}>Food & Beverage</option>
              <option value="Tech" ${c.industry==="Tech"?"selected":""}>Technology</option>
              <option value="Travel" ${c.industry==="Travel"?"selected":""}>Travel</option>
            </select>
          </div>
          <div class="profile-field">
            <label>City</label>
            <select id="co-city">
              <option value="">Select city</option>
              <option value="Las Vegas" ${c.city==="Las Vegas"?"selected":""}>Las Vegas</option>
              <option value="New York" ${c.city==="New York"?"selected":""}>New York</option>
              <option value="Los Angeles" ${c.city==="Los Angeles"?"selected":""}>Los Angeles</option>
            </select>
          </div>
          <div class="profile-field">
            <label>Web site</label>
            <input id="co-website" value="${c.website}" placeholder="Enter link http://" />
          </div>
        </div>
        <button class="auth-btn" data-action="complete-onboard">Next</button>
        <div class="auth-skip" data-action="skip-onboard">Skip for now</div>
      </div>
    </div>
  </div>`;
}

/* ─── BENEFITS LIST ──────────────────────────────────────────────────────── */
function renderBenefits() {
  const sel = state.selectedBenefitId;
  const selectedBenefit = state.benefits.find(b => b.id === sel);
  const statusFilters = [
    { key: "all", label: "All" },
    { key: "Pending", label: "Pending" },
    { key: "Published", label: "Published" },
    { key: "Paused", label: "Paused" },
  ];
  const filtersHtml = statusFilters.map(filter =>
    `<button class="status-filter ${state.benefitsStatus===filter.key?"active":""}" data-benefit-status="${filter.key}">${filter.label}</button>`
  ).join("");

  const filteredBenefits = state.benefits.filter(b =>
    state.benefitsStatus === "all" ? true : b.status === state.benefitsStatus
  );

  const rows = [...filteredBenefits].map(b => {
    return `<tr class="${sel===b.id?"selected":""}" data-select-benefit="${b.id}">
      <td>
        <div class="coupon-cell">
          <div class="coupon-thumb" style="background:${b.color||"#888"};color:#fff">
            <span style="font-size:11px;font-weight:700">${b.initials||"?"}</span>
          </div>
          <span class="coupon-name">${b.title}</span>
        </div>
      </td>
      <td>${fmtNum(b.assigned)}</td>
      <td>${fmtNum(b.used)}</td>
      <td>${badge(b.status)}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" title="${b.status==="Paused"?"Resume":"Pause"}">${icon(b.status==="Paused"?"play":"pause")}</button>
          <button class="btn-icon" title="More options">${icon("dots-three")}</button>
        </div>
      </td>
    </tr>`;
  }).join("");

  const listPane = `
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-title">Benefits</div>
        <p class="page-summary">
          <strong>Benefit creator</strong>
          Create benefits for your customers. Configure parameters such as discount amount, usage limits, and expiration dates. Track usage and performance in real time.
        </p>
      </div>
    </div>
    <div class="page-controls-row">
      <div class="search-bar">
        ${icon("magnifying-glass")}
        <input placeholder="Search coupons by name" />
      </div>
      <div class="status-filters">${filtersHtml}</div>
    </div>
    <div style="border-bottom:1px solid var(--line);margin-bottom:16px"></div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Coupon <span class="sort">↕</span></th>
            <th>Assigned <span class="sort">↕</span></th>
            <th>Used <span class="sort">↕</span></th>
            <th>Status <span class="sort">↕</span></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="pagination">
        <button class="page-btn">${icon("caret-left")}</button>
        <button class="page-btn">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">4</button>
        <button class="page-btn active">5</button>
        <span style="font-size:13px;color:var(--muted);padding:0 4px">…</span>
        <button class="page-btn">99</button>
        <button class="page-btn">${icon("caret-right")}</button>
      </div>
    </div>`;

  const d = {
    ...DEMO_BENEFIT_DETAIL,
    title: selectedBenefit?.title || DEMO_BENEFIT_DETAIL.title,
    status: selectedBenefit?.status || DEMO_BENEFIT_DETAIL.status,
  };
  const days = ["D","L","M","M","J","V","S"];
  const dayPills = days.map((day,i) =>
    `<span class="day-pill ${d.activeDays.includes(i)?"":"off"}">${day}</span>`
  ).join("");
  const detailFacts = [
    { icon: "percent", text: "40% off" },
    { icon: "handshake", text: "Co-funded" },
    { icon: "coins", text: "$50,000" },
    { icon: "barcode", text: "Product code not set" },
  ].map(item => `
    <div class="detail-fact-line">
      ${icon(item.icon)}
      <span>${item.text}</span>
    </div>
  `).join("");
  const imgs = d.images.map(im => `
    <div class="detail-img-card">
      <div class="img-area detail-img-area detail-img-${im.kind}">
        <div class="detail-img-overlay">
          <div class="detail-img-kicker">${im.title}</div>
          <div class="detail-img-sub">${im.sub}</div>
        </div>
        <div class="detail-img-art">${icon(im.kind === "code" ? "qr-code" : im.kind === "product" ? "high-heel" : im.kind === "lifestyle" ? "heart" : "sparkle","ph-2x")}</div>
      </div>
      <div class="img-label">${im.label}</div>
    </div>`).join("");

  const detailPane = sel ? `
    <div class="benefits-detail-pane" style="padding:0">
      <div class="detail-topbar">
        <button class="btn-icon" data-action="close-detail">${icon("x")}</button>
      </div>
      <div class="detail-body">
        <div class="detail-title-row">
          <div>
            <div class="detail-title">${d.title}</div>
            <div class="detail-tagline">${d.tagline}</div>
          </div>
          <div class="detail-edit" data-action="edit-benefit">Edit benefit ${icon("arrow-right")}</div>
        </div>
        <div>
          <div class="detail-section-label">Description</div>
          <div class="detail-desc">${d.description}</div>
        </div>
        <div>
          <div class="detail-images">${imgs}</div>
        </div>
        <div class="detail-facts-card">
          ${detailFacts}
        </div>
        <div class="detail-validity">
          <div class="detail-validity-line">
            ${icon("calendar-blank")}
            <span>From 09/17/2025 12:00 AM to Not set</span>
          </div>
          <div class="detail-validity-days">
            ${dayPills}
          </div>
        </div>
        <div class="detail-stats">
          <div class="stats-title">${icon("chart-bar")} Statistics</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Impacted audience<br><span style="font-size:10px">Last update 22 November 2025</span></div>
              <div class="stat-value">${d.audience}</div>
              <div class="stat-sub">${d.audienceCount}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Total assigned<br><span style="font-size:10px">Coupons assigned to members</span></div>
              <div class="stat-value">${fmtNum(d.assigned)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Total used<br><span style="font-size:10px">Coupons used by members</span></div>
              <div class="stat-value">${fmtNum(d.used)}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-footer">
        <button class="btn btn-primary" style="width:100%;justify-content:center;height:44px" data-action="request-review">
          ${icon("paper-plane-tilt")} Request review
        </button>
      </div>
    </div>` : "";

  const mainContent = `
    <div class="benefits-layout">
      <div class="benefits-list-pane">
        <div class="topbar">
          <div class="topbar-left">
            <div class="topbar-breadcrumb">${icon("gift")} Benefit</div>
          </div>
          <div class="topbar-right">
            <button class="btn btn-primary" data-action="new-benefit">${icon("plus")} New</button>
            <button class="btn-ai">${icon("sparkle")} AI assistant</button>
          </div>
        </div>
        <div class="page-content">${listPane}</div>
      </div>
      ${detailPane}
    </div>`;

  return appShell(mainContent, S.merchantBenefits);
}

/* ─── WIZARD ─────────────────────────────────────────────────────────────── */
function renderWizard() {
  const b = state.benefit;
  const tabs = [
    { key:"basic",    icon:"file-text",      title:"Basic",    sub:"Identity and value" },
    { key:"validity", icon:"calendar-blank", title:"Validity", sub:"Validity and timeframe" },
    { key:"media",    icon:"image-square",   title:"Media",    sub:"Content" },
  ];

  const tabsHtml = tabs.map(t => `
    <div class="wizard-tab ${state.wizardTab===t.key?"active":""}" data-wizard-tab="${t.key}">
      ${icon(t.icon)}
      <div class="wizard-tab-text">
        <div class="wizard-tab-title">${t.title}</div>
        <div class="wizard-tab-sub">${t.sub}</div>
      </div>
    </div>`).join("");

  let formHtml = "";
  if (state.wizardTab === "basic") formHtml = renderWizardBasic(b);
  else if (state.wizardTab === "validity") formHtml = renderWizardValidity(b);
  else formHtml = renderWizardMedia(b);

  const previewHtml = renderWizardPreview(b);

  const footerLeft = state.wizardTab !== "basic"
    ? `<button class="btn btn-secondary" data-wizard-back>← Back</button>` : `<span></span>`;
  const footerRight = state.wizardTab !== "media"
    ? `<button class="btn btn-primary" data-wizard-next>Continue →</button>`
    : `<button class="btn btn-primary" data-action="save-benefit">Save &amp; publish →</button>`;

  const innerContent = `
    <div class="wizard-topbar">
      <div class="wizard-title-block">
        <div class="wizard-eyebrow">${icon("gift")} Benefit</div>
        <div class="wizard-title">${b.title || "New benefit"}</div>
        <div style="margin-top:4px">
          <span class="badge badge-draft">Draft</span>
        </div>
      </div>
      <div class="wizard-actions">
        <button class="btn btn-secondary">Publish</button>
        <button class="btn btn-primary" data-action="save-draft">Save</button>
        <button class="btn-ai">${icon("sparkle")} AI assistant</button>
      </div>
    </div>
    <div class="wizard-body">
      <div class="wizard-tabs">${tabsHtml}</div>
      <div class="wizard-form">${formHtml}</div>
      <div class="wizard-preview">${previewHtml}</div>
    </div>
    <div class="wizard-footer">
      ${footerLeft}
      ${footerRight}
    </div>`;

  return appShell(`<div class="workspace" style="display:flex;flex-direction:column">
    <div class="topbar">
      <div class="topbar-left">
        <a href="#${S.merchantBenefits}" class="topbar-breadcrumb" style="color:var(--muted)">
          ${icon("caret-left")} Benefits
        </a>
      </div>
    </div>
    ${innerContent}
  </div>`, S.merchantBenefits);
}

function renderWizardBasic(b) {
  const types = [
    { key:"percentage", icon:"percent",    title:"Percentage discount", sub:"A % off the purchase price" },
    { key:"fixed",      icon:"percent",    title:"Fixed discount",      sub:"A fixed amount off the price" },
    { key:"cashback",   icon:"arrows-left-right", title:"Cashback",    sub:"Return cash or credit to member" },
    { key:"gift",       icon:"arrows-left-right", title:"Gift / Free product", sub:"A free item or BOGO offer" },
  ];

  const typeCards = types.map(t => `
    <div class="benefit-type-card ${b.type===t.key?"selected":""}" data-benefit-type="${t.key}">
      <div class="type-icon">${icon(t.icon)}</div>
      <div class="type-text">
        <div class="type-title">${t.title}</div>
        <div class="type-sub">${t.sub}</div>
      </div>
      <div class="type-check">${icon("check")}</div>
    </div>`).join("");

  return `
    <div class="form-section">
      <div class="form-section-title">Identification</div>
      <div class="form-section-sub">Set the details for the benefit</div>
      <div class="form-field">
        <label>Title</label>
        <input class="form-input" placeholder="Write coupon name" value="${b.title}" data-bind="benefit.title" />
      </div>
      <div class="form-field">
        <label>Description</label>
        <input class="form-input" placeholder="Write a coupon description" value="${b.description}" data-bind="benefit.description" />
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Benefit type</div>
      <div class="form-section-sub">Choose how the benefit is delivered</div>
      <div class="benefit-types">${typeCards}</div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Discount %</div>
      <div class="discount-input-wrap">
        <div class="discount-prefix">%</div>
        <input placeholder="e.g. 30" value="${b.discountValue}" data-bind="benefit.discountValue" />
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Funding model</div>
      <div class="form-section-sub">Define who covers the cost of this benefit</div>
      <div class="funding-cards">
        ${[
          { key:"merchant", icon:"storefront",   title:"Merchant-funded",   sub:"You absorb the full cost of every redemption" },
          { key:"cofunded", icon:"handshake",    title:"Co-funded",         sub:"Share the cost with the issuing bank" },
          { key:"issuer",   icon:"buildings",    title:"Issuer-funded",     sub:"The issuer covers 100% of the redemption cost" },
        ].map(f => `
          <div class="funding-card ${state.funding.model===f.key?"selected":""}" data-funding-model="${f.key}">
            <div class="funding-card-icon">${icon(f.icon)}</div>
            <div class="funding-card-body">
              <div class="funding-card-title">${f.title}</div>
              <div class="funding-card-sub">${f.sub}</div>
            </div>
            <div class="funding-card-check">${icon("check-circle","ph-fill")}</div>
          </div>`).join("")}
      </div>
      ${state.funding.model === "cofunded" ? `
      <div class="cofund-split">
        <div class="cofund-labels">
          <span>Merchant ${state.funding.merchantPct}%</span>
          <span>Issuer ${100 - state.funding.merchantPct}%</span>
        </div>
        <input type="range" min="10" max="90" step="5" value="${state.funding.merchantPct}"
               class="cofund-slider" data-funding-split />
      </div>` : ""}
      <div class="funding-budget-row">
        <div class="form-field">
          <label>Total budget (USD)</label>
          <div class="discount-input-wrap">
            <div class="discount-prefix">$</div>
            <input placeholder="e.g. 50000" value="${state.funding.totalBudget}" data-bind-funding="totalBudget" />
          </div>
        </div>
        <div class="form-field">
          <label>Max per redemption (USD)</label>
          <div class="discount-input-wrap">
            <div class="discount-prefix">$</div>
            <input placeholder="e.g. 40" value="${state.funding.perRedemption}" data-bind-funding="perRedemption" />
          </div>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Product specific code</div>
      <div class="form-section-sub">Limit this benefit to a specific product</div>
      <div class="form-toggle">
        <div class="toggle-switch ${b.hasProductCode?"":"off"}" data-toggle="benefit.hasProductCode"></div>
        <span>Product specific code</span>
      </div>
      ${b.hasProductCode ? `<div class="form-field">
        <input class="form-input" placeholder="e.g. PROD-00123-XL" value="${b.productCode}" data-bind="benefit.productCode" />
      </div>` : ""}
    </div>`;
}

function renderWizardValidity(b) {
  const days = [
    {label:"Mon",idx:0},{label:"Tue",idx:1},{label:"Wed",idx:2},
    {label:"Thu",idx:3},{label:"Fri",idx:4},{label:"Sat",idx:5},{label:"Sun",idx:6}
  ];
  const dayToggles = days.map(d =>
    `<button class="day-toggle ${b.activeDays.includes(d.idx)?"on":""}" data-day="${d.idx}">${d.label}</button>`
  ).join("");

  return `
    <div class="form-section">
      <div class="form-section-title">Validity</div>
      <div class="form-section-sub">This section sets the active dates and lifetime limits for the coupon.</div>
    </div>
    <div class="form-section">
      <div class="form-field">
        <label>Time zone</label>
        <select class="form-input" data-bind="benefit.timezone">
          <option value="Buenos Aires, Argentina (GMT -3:00)" ${b.timezone==="Buenos Aires, Argentina (GMT -3:00)"?"selected":""}>Buenos Aires, Argentina (GMT -3:00)</option>
          <option value="Mexico City, Mexico (GMT -6:00)" ${b.timezone==="Mexico City, Mexico (GMT -6:00)"?"selected":""}>Mexico City, Mexico (GMT -6:00)</option>
          <option value="New York, USA (GMT -5:00)" ${b.timezone==="New York, USA (GMT -5:00)"?"selected":""}>New York, USA (GMT -5:00)</option>
          <option value="Miami, USA (GMT -5:00)" ${b.timezone==="Miami, USA (GMT -5:00)"?"selected":""}>Miami, USA (GMT -5:00)</option>
          <option value="Los Angeles, USA (GMT -8:00)" ${b.timezone==="Los Angeles, USA (GMT -8:00)"?"selected":""}>Los Angeles, USA (GMT -8:00)</option>
          <option value="Chicago, USA (GMT -6:00)" ${b.timezone==="Chicago, USA (GMT -6:00)"?"selected":""}>Chicago, USA (GMT -6:00)</option>
          <option value="São Paulo, Brazil (GMT -3:00)" ${b.timezone==="São Paulo, Brazil (GMT -3:00)"?"selected":""}>São Paulo, Brazil (GMT -3:00)</option>
          <option value="Bogotá, Colombia (GMT -5:00)" ${b.timezone==="Bogotá, Colombia (GMT -5:00)"?"selected":""}>Bogotá, Colombia (GMT -5:00)</option>
          <option value="Santiago, Chile (GMT -4:00)" ${b.timezone==="Santiago, Chile (GMT -4:00)"?"selected":""}>Santiago, Chile (GMT -4:00)</option>
          <option value="London, UK (GMT +0:00)" ${b.timezone==="London, UK (GMT +0:00)"?"selected":""}>London, UK (GMT +0:00)</option>
          <option value="Madrid, Spain (GMT +1:00)" ${b.timezone==="Madrid, Spain (GMT +1:00)"?"selected":""}>Madrid, Spain (GMT +1:00)</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-field">
          <label>Start date</label>
          ${renderDatePicker("benefit.startDate", b.startDate, false, "calendar-blank")}
        </div>
        <div class="form-field">
          <label>Start time</label>
          ${renderTimePicker("benefit.startTime", b.startTime, false, "clock")}
        </div>
        <div class="form-field">
          <label>End date</label>
          ${renderDatePicker("benefit.endDate", b.endDate, b.withoutEnd, "calendar-blank")}
        </div>
        <div class="form-field">
          <label>End time</label>
          ${renderTimePicker("benefit.endTime", b.endTime, b.withoutEnd, "clock")}
        </div>
      </div>
      <div class="form-toggle">
        <div class="toggle-switch ${b.withoutEnd?"":"off"}" data-toggle="benefit.withoutEnd"></div>
        <div>
          <div style="font-weight:500">Without end</div>
          <div style="font-size:12px;color:var(--muted)">Coupon will remain active until manually stopped.</div>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Days of the week</div>
      <div class="form-section-sub">Choose specific days or select all week days</div>
      <div class="days-row">${dayToggles}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:6px">No days selected — applies to all days by default.</div>
    </div>`;
}

function renderWizardMedia(b) {
  const mediaEditor = state.mediaEditor !== null ? (b.mediaAssets || [])[state.mediaEditor] : null;
  const mediaSlots = (b.mediaAssets || []).map((asset, index) => {
    const hasImage = Boolean(asset.src);
    const isCollapsedExtra = asset.optional && !hasImage;
    if (isCollapsedExtra) {
      return `
        <div class="media-slot media-slot-add">
          <button class="media-upload-zone media-upload-zone-sm" type="button" data-media-trigger="${index}">
            ${icon("plus")}
          </button>
          <input class="media-file-input" type="file" accept="image/*" data-media-input="${index}" hidden />
        </div>`;
    }

    return `
      <div class="media-slot ${hasImage ? "media-slot-loaded" : ""}">
        <button class="media-upload-zone ${hasImage ? "media-upload-zone-filled" : ""}" type="button" data-media-trigger="${index}">
          ${hasImage
            ? `<img src="${asset.src}" alt="${asset.alt || asset.label}" class="media-upload-preview" />`
            : `<span class="media-upload-empty">${icon("upload-simple")}</span>`}
        </button>
        <input class="media-file-input" type="file" accept="image/*" data-media-input="${index}" hidden />
        ${hasImage ? `
          <div class="media-upload-actions">
            <button class="media-mini-action" type="button" data-action="open-media-editor" data-media-index="${index}">${icon("pencil-simple")}</button>
            <button class="media-mini-action" type="button" data-media-delete="${index}">${icon("trash")}</button>
          </div>` : ""}
        <div class="media-upload-label">${asset.label}</div>
      </div>`;
  }).join("");

  return `
    <div class="form-section">
      <div class="form-section-title">Media</div>
      <div class="form-section-sub">Visual and search elements associated with the coupon.</div>
      <div class="form-field">
        <label>Title</label>
        <input class="form-input" placeholder="Chasback: $40" value="${b.mediaTitle}" data-bind="benefit.mediaTitle" />
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Description</div>
      <div class="rte-editor">
        <div class="rte-toolbar">
          <select><option>16</option><option>12</option><option>14</option><option>18</option></select>
          <button class="rte-btn" title="Font color">A</button>
          <button class="rte-btn" title="Highlight">&#x25A1;</button>
          <div class="rte-sep"></div>
          <button class="rte-btn"><strong>B</strong></button>
          <button class="rte-btn"><em>I</em></button>
          <button class="rte-btn"><u>U</u></button>
          <button class="rte-btn"><s>S</s></button>
          <div class="rte-sep"></div>
          <button class="rte-btn">≡</button>
          <button class="rte-btn">≡#</button>
          <button class="rte-btn">≡•</button>
        </div>
        <div class="rte-body" contenteditable="true">${b.mediaDescription || "Enter your main text here..."}</div>
      </div>
      <div class="rte-count">300/300</div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Images</div>
      <div class="form-section-sub">Upload images for each position</div>
      <div class="media-slots-row">${mediaSlots}</div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Custom attributes</div>
      <div class="form-section-sub">Custom attributes allow you to add extra structured data to this coupon. These attributes can be used by the front-end to control content, behavior, or layout.</div>
      <div class="add-attr">${icon("plus")} Add custom attribute</div>
    </div>
    ${mediaEditor ? `
      <div class="media-modal-backdrop" data-action="close-media-editor">
        <div class="media-modal" onclick="event.stopPropagation()">
          <div class="media-modal-title">Edit image details</div>
          <div class="media-modal-fields">
            <div class="form-field">
              <label>Image title</label>
              <input id="media-editor-title" class="form-input" type="text" value="${mediaEditor.title || ""}" placeholder="Add image title" />
            </div>
            <div class="form-field">
              <label>Alt text</label>
              <input id="media-editor-alt" class="form-input" type="text" value="${mediaEditor.alt || ""}" placeholder="Add alt text" />
            </div>
          </div>
          <div class="media-modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-media-editor">Cancel</button>
            <button class="btn btn-primary" type="button" data-action="save-media-editor">Save</button>
          </div>
        </div>
      </div>` : ""}`;
}

function renderWizardPreview(b) {
  const title = b.mediaTitle || b.title || "New benefit";
  const sub = b.description || "$40 cash back reward on purchases + $400";
  const discountAmount = b.discountValue ? `${b.discountValue}% off` : "Not set";
  const fundingLabels = {
    merchant: "Merchant-funded",
    cofunded: "Co-funded",
    issuer: "Issuer-funded",
  };
  const fundingModel = fundingLabels[state.funding.model] || "Not set";
  const totalBudget = state.funding.totalBudget ? `$${Number(state.funding.totalBudget || 0).toLocaleString()}` : "Not set";
  const productValue = b.hasProductCode
    ? (b.productCode || "Product code not set")
    : "All products";
  const dayLabels = ["D","L","M","M","J","V","S"];
  const dayPills = dayLabels.map((d,i) =>
    `<span class="day-pill ${b.activeDays.includes(i) ? "" : "off"}">${d}</span>`
  ).join("");
  const validityRange = b.withoutEnd
    ? `From ${b.startDate || "Not set"} ${b.startTime || ""}`.trim()
    : `From ${b.startDate || "Not set"} ${b.startTime || ""} to ${b.endDate || "Not set"} ${b.endTime || ""}`.trim();
  const previewImages = (b.mediaAssets || []).filter(asset => asset.src);
  const imageArea = previewImages.length
    ? `<div class="preview-images">
        ${previewImages.slice(0, 4).map(asset => `
          <div class="preview-img-thumb">
            <img src="${asset.src}" alt="${asset.label}" />
            <div class="img-name">${asset.label}</div>
          </div>
        `).join("")}
      </div>`
    : `<div class="preview-no-image">
        <p>No image set yet</p>
        <span>Add an image to make it more attractive</span>
      </div>`;

  return `
    <div class="preview-card">
      <div class="preview-card-header">
        <div>
          <div class="preview-card-title">${title}</div>
          <div class="preview-card-sub">${sub}</div>
        </div>
        <div class="preview-edit">Edit media ${icon("caret-right")}</div>
      </div>
      <div class="preview-desc-label">Description</div>
      ${imageArea}
      <div class="preview-meta">
        <div class="preview-meta-item">${icon("percent")} <span data-preview-discount>${discountAmount}</span></div>
        <div class="preview-meta-item">${icon("handshake")} <span data-preview-funding>${fundingModel}</span></div>
        <div class="preview-meta-item">${icon("coins")} <span data-preview-budget>${totalBudget}</span></div>
        <div class="preview-meta-item">${icon("barcode")} <span data-preview-product>${productValue}</span></div>
      </div>
      <div class="preview-validity">
        <div class="preview-meta-item">${icon("calendar-blank")} <span data-preview-validity>${validityRange}</span></div>
        <div class="preview-meta-item"><div class="day-pills" data-preview-days>${dayPills}</div></div>
      </div>
      <div class="preview-key">
        <div class="preview-key-label">Benefit key</div>
        <div class="preview-key-value">
          ADG-12345679 00
          ${icon("copy")}
        </div>
      </div>
    </div>`;
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
function renderDashboard() {
  const kpis = [
    { label:"Total revenue",     value:"$20,320", meta:"Redeemed value",  delta:"+12.4% vs last month", icon:"coins",       up:true,  spark:[58,64,61,73,70,78,82] },
    { label:"Total orders",      value:"10,320",  meta:"Redemption events",delta:"+8.1% vs last month",  icon:"receipt",     up:true,  spark:[42,48,51,55,52,61,66] },
    { label:"New customers",     value:"4,305",   meta:"First-time users",delta:"+6.7% this month",      icon:"users",       up:true,  spark:[28,34,39,37,45,49,54] },
    { label:"Conversion rate",   value:"3.9%",    meta:"Benefit to redeem",delta:"-0.2 pts vs target",   icon:"chart-line",  up:false, spark:[60,58,57,56,54,53,52] },
  ];

  const kpiHtml = kpis.map((k, index) => `
    <div class="kpi-card dashboard-animate" style="--enter-delay:${index * 60}ms">
      <div class="kpi-body">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-main-row">
          <div>
            <div class="kpi-value">${k.value}</div>
            <div class="kpi-meta">${k.meta}</div>
          </div>
          <div class="kpi-spark">
            ${k.spark.map(v => `<span style="height:${v}%"></span>`).join("")}
          </div>
        </div>
        <div class="kpi-delta ${k.up?"up":"down"}">${icon(k.up?"trend-up":"trend-down")} ${k.delta}</div>
      </div>
    </div>`).join("");

  const pipeline = [
    { label:"Draft",    count:3, note:"Ready to refine",  badgeClass:"pipeline-badge-draft" },
    { label:"Pending",  count:2, note:"Waiting approval", badgeClass:"pipeline-badge-pending" },
    { label:"Approved", count:8, note:"Live in market",   badgeClass:"pipeline-badge-approved" },
    { label:"Paused",   count:1, note:"Temporarily off",  badgeClass:"pipeline-badge-paused" },
  ];
  const total = pipeline.reduce((s,p) => s + p.count, 0);
  const pipelineHtml = pipeline.map(p => `
    <div class="pipeline-step">
      <div class="pipeline-main">
        <div class="pipeline-count">${p.count}</div>
        <div class="pipeline-copy">
          <div class="pipeline-heading">
            <span class="pipeline-badge ${p.badgeClass}">${p.label}</span>
          </div>
          <div class="pipeline-note">${p.note}</div>
        </div>
      </div>
    </div>`).join("");

  const trendData = [
    { month:"Jan", newUsers:8, existing:14 },
    { month:"Feb", newUsers:10, existing:18 },
    { month:"Mar", newUsers:9, existing:16 },
    { month:"Apr", newUsers:12, existing:22 },
    { month:"May", newUsers:11, existing:17 },
    { month:"Jun", newUsers:15, existing:23, active:true },
    { month:"Jul", newUsers:12, existing:19 },
    { month:"Aug", newUsers:10, existing:16 },
    { month:"Sep", newUsers:14, existing:20 },
    { month:"Oct", newUsers:16, existing:24 },
    { month:"Nov", newUsers:13, existing:17 },
    { month:"Dec", newUsers:11, existing:15 },
  ];
  const trendMax = Math.max(...trendData.map(d => d.newUsers + d.existing));
  const trendBarsHtml = trendData.map((d, index) => `
    <div class="trend-col ${d.active ? "active" : ""}" style="--enter-delay:${index * 50}ms">
      <div class="trend-grid-stack">
        ${Array.from({ length: 8 }).map(() => `<span class="trend-grid-cell"></span>`).join("")}
      </div>
      <div class="trend-stack">
        <span class="trend-bar trend-bar-new" style="height:${Math.round(d.newUsers / trendMax * 100)}%"></span>
        <span class="trend-bar trend-bar-existing" style="height:${Math.round(d.existing / trendMax * 100)}%"></span>
      </div>
      <div class="trend-month">${d.month}</div>
    </div>`).join("");

  const redemptionData = [
    { month:"Apr", val:6200 },
    { month:"May", val:6800 },
    { month:"Jun", val:7400 },
    { month:"Jul", val:7900 },
    { month:"Aug", val:8600 },
    { month:"Sep", val:9300 },
    { month:"Oct", val:7200 },
    { month:"Nov", val:9800 },
    { month:"Dec", val:13200 },
    { month:"Jan", val:11400 },
    { month:"Feb", val:12900 },
    { month:"Mar", val:14302 },
  ];
  const redemptionMax = Math.max(...redemptionData.map(d => d.val));
  const redemptionBarsHtml = redemptionData.map((d, index) => `
    <div class="bar-col" style="--enter-delay:${index * 60}ms">
      <div class="bar-shape-wrap">
        <div class="bar-fill" style="height:${Math.round(d.val/redemptionMax*100)}%"></div>
      </div>
      <div class="bar-meta">
        <div class="bar-value">${Math.round(d.val/1000)}K</div>
        <div class="bar-label">${d.month}</div>
      </div>
    </div>`).join("");

  const breakdownData = [68, 54, 32, 73, 49, 41, 57, 33, 69, 48, 61, 52];
  const breakdownBarsHtml = breakdownData.map((v, index) => `
    <div class="breakdown-col" style="--enter-delay:${index * 45}ms">
      <span style="height:${v}%"></span>
    </div>`).join("");

  const topBenefits = [
    { name:"Valentine's 2-for-1 Shoes",  redemptions:4302, budget:"$40K", pct:86, model:"Merchant" },
    { name:"5% Cashback – Cashi",         redemptions:3855, budget:"$25K", pct:92, model:"Co-funded" },
    { name:"20% Off pantry essentials",   redemptions:2940, budget:"$15K", pct:71, model:"Issuer" },
    { name:"15% Off school shoes",        redemptions:2100, budget:"$18K", pct:58, model:"Merchant" },
    { name:"$300 Bonus smartphones",      redemptions:1105, budget:"$30K", pct:37, model:"Co-funded" },
  ];
  const topBenefitsHtml = topBenefits.map(b => `
    <tr>
      <td>${b.name}</td>
      <td style="text-align:right">${b.redemptions.toLocaleString()}</td>
      <td><span class="funding-pill ${b.model.toLowerCase().replace("-","")}">${b.model}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--line)">
            <div style="height:100%;width:${b.pct}%;border-radius:3px;background:var(--brand)"></div>
          </div>
          <span style="font-size:12px;color:var(--muted);min-width:28px">${b.pct}%</span>
        </div>
      </td>
    </tr>`).join("");

  const issuers = [
    { name:"Banco BVA",    country:"🇦🇷", benefits:4, budget:"$22K", pct:74 },
    { name:"BBVA Mexico",  country:"🇲🇽", benefits:3, budget:"$18K", pct:61 },
    { name:"Chase USA",    country:"🇺🇸", benefits:1, budget:"$10K", pct:31 },
  ];
  const issuerDistHtml = issuers.map(i => `
    <div class="issuer-dist-row">
      <div class="issuer-dist-flag">${i.country}</div>
      <div class="issuer-dist-name">${i.name}</div>
      <div class="issuer-dist-bar-wrap">
        <div class="issuer-dist-bar" style="width:${i.pct}%"></div>
      </div>
      <div class="issuer-dist-stat">${i.benefits} benefits · ${i.budget}</div>
    </div>`).join("");

  const activity = [
    { icon:"check-circle", color:"var(--success)", text:'<strong>Banco BVA</strong> activated "Valentine\'s 2-for-1 Shoes"',    time:"2h ago" },
    { icon:"clock",        color:"var(--warning)", text:'<strong>Zappos</strong> submitted "Spring Sale 30% Off" for review',    time:"5h ago" },
    { icon:"x-circle",     color:"var(--danger)",  text:'<strong>Mastercard</strong> requested changes on "Back to School"',     time:"1d ago" },
    { icon:"gift",         color:"var(--brand)",   text:'<strong>BBVA Mexico</strong> activated "5% Cashback – Cashi"',          time:"2d ago" },
    { icon:"pause-circle", color:"var(--muted)",   text:'<strong>Zappos</strong> paused "30% off cleaning products"',            time:"3d ago" },
  ];
  const activityHtml = activity.map(a => `
    <div class="activity-row">
      <div class="activity-dot" style="color:${a.color}">${icon(a.icon)}</div>
      <div class="activity-body">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join("");

  const budgetUsed = 20000;
  const budgetTotal = 50000;
  const budgetPct = Math.round(budgetUsed / budgetTotal * 100);
  const budgetDisplay = new Intl.NumberFormat("de-DE");

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("gauge")} Dashboard</div>
      </div>
      <div class="topbar-right dashboard-header-actions">
        <div class="dashboard-filters">
          <button class="dashboard-chip active">Monthly</button>
          <button class="dashboard-chip">Quarterly</button>
          <button class="dashboard-chip">2026</button>
        </div>
        <button class="btn btn-secondary" style="gap:6px">${icon("download-simple")} Export</button>
      </div>
    </div>
    <div class="page-content dashboard-page">
      <div class="page-header dashboard-animate" style="margin-bottom:0">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("gauge")} Overview</div>
          <div class="page-title">Dashboard overview</div>
          <p class="page-summary">Monitor benefit performance, redemption behavior, issuer traction, and campaign health in one place.</p>
        </div>
      </div>

      <div class="kpi-grid">${kpiHtml}</div>

      <div class="dashboard-main-grid">
        <div class="dash-card dash-card-lg dashboard-animate" style="--enter-delay:120ms">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">${icon("chart-bar")} Sales trend</div>
              <div class="dash-card-sub">Total revenue <strong class="dash-inline-total">$20,320</strong></div>
            </div>
            <div class="chart-legend">
              <span><i class="legend-dot legend-dot-brand"></i> New user</span>
              <span><i class="legend-dot legend-dot-dark"></i> Existing user</span>
              <div class="chart-tabs">
                <button class="chart-tab">Weekly</button>
                <button class="chart-tab active">Monthly</button>
                <button class="chart-tab">Yearly</button>
              </div>
            </div>
          </div>
          <div class="trend-chart-wrap">
            <div class="trend-axis">
              <span>60K</span>
              <span>45K</span>
              <span>30K</span>
              <span>15K</span>
              <span>0K</span>
            </div>
            <div class="trend-chart">
              <div class="trend-chart-grid"></div>
              <div class="trend-focus-line"></div>
              <div class="trend-tooltip">
                <div class="trend-tooltip-month">Jun 2025</div>
                <div class="trend-tooltip-row"><span>New User</span><strong>38K</strong></div>
                <div class="trend-tooltip-row"><span>Existing User</span><strong>18K</strong></div>
              </div>
              <div class="trend-bars">${trendBarsHtml}</div>
            </div>
          </div>
        </div>
        <div class="dash-card dash-breakdown-card dashboard-animate" style="--enter-delay:180ms">
          <div class="dash-card-header">
            <div>
              <div class="dash-card-title">${icon("chart-pie-slice")} Revenue breakdown</div>
              <div class="dash-card-sub">Revenue by category</div>
            </div>
            <div class="dash-card-sub">Jan 1 - Aug 30</div>
          </div>
          <div class="breakdown-total">$20,320</div>
          <div class="breakdown-insight">${icon("sparkle")} Get AI insight for better analysis</div>
          <div class="breakdown-chart">${breakdownBarsHtml}</div>
          <div class="breakdown-foot">
            <span>1 Jan</span>
            <span>30 Jan 2026</span>
          </div>
        </div>
      </div>

      <div class="dashboard-secondary-grid">
        <div class="dash-card dashboard-animate dashboard-monthly-card" style="--enter-delay:240ms">
          <div class="dash-card-header">
            <div class="dash-card-title">${icon("chart-bar")} Monthly redemptions</div>
            <div class="dash-card-sub">Oct 2025 - Mar 2026</div>
          </div>
          <div class="bar-chart">${redemptionBarsHtml}</div>
        </div>
        <div class="dashboard-side-stack dashboard-secondary-stack">
          <div class="dash-card dashboard-animate" style="--enter-delay:300ms">
            <div class="dash-card-header">
              <div class="dash-card-title">${icon("funnel")} Pipeline status</div>
              <div class="dash-card-sub">${total} total benefits</div>
            </div>
            <div class="pipeline-track">${pipelineHtml}</div>
          </div>
          <div class="dash-card dashboard-animate" style="--enter-delay:360ms">
            <div class="dash-card-header">
              <div class="dash-card-title">${icon("coins")} Budget tracker</div>
              <div class="dash-card-sub">FY 2026</div>
            </div>
            <div class="budget-panel">
              <div class="budget-track">
                <div class="budget-numbers">
                  <span class="budget-used">${budgetDisplay.format(budgetUsed)}</span>
                  <span class="budget-total">of ${budgetDisplay.format(budgetTotal)}</span>
                </div>
                <div class="budget-bar-row">
                  <div class="budget-bar-wrap">
                    <div class="budget-bar" style="width:${budgetPct}%"></div>
                  </div>
                  <div class="budget-pct">${budgetPct}%</div>
                </div>
                <div class="budget-metrics">
                  <div class="budget-metric">
                    <span>Remaining</span>
                    <strong>${budgetDisplay.format(budgetTotal - budgetUsed)}</strong>
                  </div>
                  <div class="budget-metric">
                    <span>Avg / month</span>
                    <strong>${budgetDisplay.format(Math.round(budgetUsed / 6))}</strong>
                  </div>
                  <div class="budget-metric">
                    <span>Highest load</span>
                    <strong>Merchant</strong>
                  </div>
                </div>
                <div class="budget-breakdown">
                  <div class="budget-item merchant"><span>Merchant-funded</span><strong>12.000</strong></div>
                  <div class="budget-item cofunded"><span>Co-funded</span><strong>5.000</strong></div>
                  <div class="budget-item issuer"><span>Issuer-funded</span><strong>3.000</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-bottom-grid">
        <div class="dash-card dashboard-animate" style="--enter-delay:360ms">
          <div class="dash-card-header">
            <div class="dash-card-title">${icon("trophy")} Top benefits by redemption</div>
            <div class="dash-card-sub">Highest performing live offers</div>
          </div>
          <table class="dash-table">
            <thead><tr>
              <th>Benefit</th><th style="text-align:right">Redemptions</th>
              <th>Funded by</th><th>Budget used</th>
            </tr></thead>
            <tbody>${topBenefitsHtml}</tbody>
          </table>
        </div>
        <div class="dashboard-side-stack">
          <div class="dash-card dashboard-animate" style="--enter-delay:420ms">
            <div class="dash-card-header">
              <div class="dash-card-title">${icon("buildings")} Issuer distribution</div>
            </div>
            <div class="issuer-dist-list">${issuerDistHtml}</div>
          </div>
        </div>
      </div>

      <div class="dash-card dashboard-animate" style="--enter-delay:540ms">
        <div class="dash-card-header">
          <div class="dash-card-title">${icon("clock-clockwise")} Recent activity</div>
          <div class="dash-card-sub">Updated in real time</div>
        </div>
        <div class="activity-list">${activityHtml}</div>
      </div>
    </div>`;

  return appShell(content, S.merchantDashboard);
}

/* ─── PARTNERSHIPS ───────────────────────────────────────────────────────── */
const DEMO_ISSUERS = [
  {
    id:"i1", name:"Banco BVA", country:"Argentina", flag:"🇦🇷",
    initials:"BV", color:"#1A5276",
    status:"Active", joinDate:"Jan 2024",
    activeBenefits:4, totalRedemptions:8302, budget:"$22,000",
    contact:"partnerships@bva.com.ar",
    benefits:[
      { title:"Valentine's 2-for-1 Shoes", model:"Merchant", status:"Published", redemptions:4302 },
      { title:"5% Cashback – Cashi",        model:"Co-funded", status:"Published", redemptions:2100 },
      { title:"20% Off pantry essentials",  model:"Issuer",   status:"Published", redemptions:940  },
      { title:"$300 Bonus smartphones",     model:"Co-funded", status:"Pending",   redemptions:0    },
    ],
  },
  {
    id:"i2", name:"BBVA Mexico", country:"Mexico", flag:"🇲🇽",
    initials:"BB", color:"#0D47A1",
    status:"Active", joinDate:"Mar 2024",
    activeBenefits:3, totalRedemptions:5200, budget:"$18,000",
    contact:"loyalty@bbva.mx",
    benefits:[
      { title:"5% Cashback – Cashi",        model:"Co-funded", status:"Published", redemptions:3100 },
      { title:"15% Off school shoes",        model:"Merchant",  status:"Published", redemptions:1600 },
      { title:"Valentine's 2-for-1 Shoes",  model:"Merchant",  status:"Pending",   redemptions:0    },
    ],
  },
  {
    id:"i3", name:"Chase USA", country:"United States", flag:"🇺🇸",
    initials:"CH", color:"#117A65",
    status:"Negotiating", joinDate:"Nov 2024",
    activeBenefits:1, totalRedemptions:800, budget:"$10,000",
    contact:"benefits@chase.com",
    benefits:[
      { title:"20% Off pantry essentials", model:"Issuer", status:"Published", redemptions:800 },
    ],
  },
  {
    id:"i4", name:"Santander BR", country:"Brazil", flag:"🇧🇷",
    initials:"SB", color:"#922B21",
    status:"Invited", joinDate:"—",
    activeBenefits:0, totalRedemptions:0, budget:"—",
    contact:"fidelidade@santander.com.br",
    benefits:[],
  },
];

function renderPartnerships() {
  const sel = state.selectedIssuerId;
  const partnershipFilters = [
    { key: "all", label: "All" },
    { key: "Active", label: "Active" },
    { key: "Negotiating", label: "Negotiating" },
    { key: "Invited", label: "Invited" },
  ];
  const partnershipsFiltersHtml = partnershipFilters.map(filter =>
    `<button class="status-filter ${state.partnershipsStatus===filter.key?"active":""}" data-partnership-status="${filter.key}">${filter.label}</button>`
  ).join("");
  const filteredIssuers = DEMO_ISSUERS.filter(issuer =>
    state.partnershipsStatus === "all" ? true : issuer.status === state.partnershipsStatus
  );
  const selIssuer = filteredIssuers.find(i => i.id === sel) || null;

  const statusClass = {
    "Active":"partner-status-active",
    "Negotiating":"partner-status-negotiating",
    "Invited":"partner-status-invited",
  };

  const totalBenefits = DEMO_ISSUERS.reduce((sum, issuer) => sum + issuer.activeBenefits, 0);
  const totalRedemptions = DEMO_ISSUERS.reduce((sum, issuer) => sum + issuer.totalRedemptions, 0);
  const activePartners = DEMO_ISSUERS.filter(i => i.status === "Active").length;

  const rows = filteredIssuers.map(i => `
    <tr class="partner-list-row ${sel===i.id?"selected":""}" data-select-issuer="${i.id}">
      <td>
        <div class="partner-cell-main">
          <div class="partner-avatar partner-avatar-list" style="background:${i.color}">${i.initials}</div>
          <div class="partner-primary-copy">
            <div class="partner-name">${i.flag} ${i.name}</div>
            <div class="partner-country">${i.country} · ${i.contact}</div>
          </div>
        </div>
      </td>
      <td>${i.joinDate}</td>
      <td>${i.activeBenefits}</td>
      <td>${i.totalRedemptions.toLocaleString()}</td>
      <td>${i.budget}</td>
      <td><span class="partner-status-pill ${statusClass[i.status]}">${i.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon" title="Open details">${icon("arrows-out-simple")}</button>
          <button class="btn-icon" title="More options">${icon("dots-three")}</button>
        </div>
      </td>
    </tr>`).join("");

  const detailPane = selIssuer ? `
    <div class="partner-detail">
      <div class="detail-topbar">
        <button class="btn-icon" data-action="close-issuer-detail">${icon("x")}</button>
      </div>
      <div class="detail-body partnerships-detail-body">
        <div class="partner-detail-hero">
          <div class="partner-avatar lg" style="background:${selIssuer.color}">${selIssuer.initials}</div>
          <div>
            <div class="partner-detail-title">${selIssuer.flag} ${selIssuer.name}</div>
            <div class="partner-detail-sub">${selIssuer.country} · Partner since ${selIssuer.joinDate}</div>
            <div style="margin-top:8px"><span class="partner-status-pill ${statusClass[selIssuer.status]}">${selIssuer.status}</span></div>
          </div>
        </div>
        <div class="partner-detail-metrics">
          <div class="partner-metric-card">
            <span>Benefits</span>
            <strong>${selIssuer.activeBenefits}</strong>
          </div>
          <div class="partner-metric-card">
            <span>Redemptions</span>
            <strong>${selIssuer.totalRedemptions.toLocaleString()}</strong>
          </div>
          <div class="partner-metric-card">
            <span>Budget</span>
            <strong>${selIssuer.budget}</strong>
          </div>
        </div>
        <div>
          <div class="detail-section-label">Contact</div>
          <div class="partner-detail-contact">${selIssuer.contact}</div>
        </div>
        <div class="detail-section-label">Benefits in this partnership</div>
        ${selIssuer.benefits.length === 0
          ? `<div class="partner-empty-state">No active benefits yet. Invite this issuer to activate a benefit.</div>`
          : selIssuer.benefits.map(b => `
          <div class="partner-benefit-row">
            <div class="partner-benefit-info">
              <div class="partner-benefit-title">${b.title}</div>
              <div class="partner-benefit-meta">${b.redemptions.toLocaleString()} redemptions</div>
            </div>
            <div class="partner-benefit-tags">
              <span class="funding-pill ${b.model.toLowerCase().replace("-","")}">${b.model}</span>
              ${badge(b.status)}
            </div>
          </div>`).join("")}
      </div>
      <div class="detail-footer">
        <button class="btn btn-primary" style="width:100%;justify-content:center;height:44px">
          ${icon("paper-plane-tilt")} Invite to new benefit
        </button>
      </div>
    </div>` : "";

  const mainContent = `
    <div class="benefits-layout">
      <div class="benefits-list-pane">
        <div class="topbar">
          <div class="topbar-left">
            <div class="topbar-breadcrumb">${icon("handshake")} Partnerships</div>
          </div>
          <div class="topbar-right">
            <button class="btn btn-primary">${icon("plus")} Invite issuer</button>
            <button class="btn-ai">${icon("sparkle")} AI assistant</button>
          </div>
        </div>
        <div class="page-content">
          <div class="page-header">
            <div class="page-header-left">
              <div class="page-title">Partnerships</div>
            </div>
          </div>
          <div class="partnerships-overview">
            <p class="page-summary partnerships-overview-copy">
              <strong>Issuer partnerships</strong>
              Manage your issuer relationships in a list-first workspace. Review participation, current budget, and live redemption volume before opening each partnership.
            </p>
            <div class="partnerships-overview-stats">
              <div class="partnerships-stat-card">
                <span>Active issuers</span>
                <strong>${activePartners}</strong>
              </div>
              <div class="partnerships-stat-card">
                <span>Live benefits</span>
                <strong>${totalBenefits}</strong>
              </div>
              <div class="partnerships-stat-card">
                <span>Total redemptions</span>
                <strong>${totalRedemptions.toLocaleString()}</strong>
              </div>
            </div>
          </div>
          <div class="page-controls-row partnerships-controls-row">
            <div class="search-bar partnerships-search">
              ${icon("magnifying-glass")}
              <input placeholder="Search issuer partnerships" />
            </div>
            <div class="status-filters">${partnershipsFiltersHtml}</div>
          </div>
          <div class="partnerships-table-top">
            <div class="partnerships-table-title">Issuer list</div>
            <div class="partnerships-table-sub">Select a row to inspect active benefits and contact details.</div>
          </div>
          <div style="border-bottom:1px solid var(--line);margin-bottom:16px"></div>
          <div class="table-wrap partnerships-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Issuer <span class="sort">↕</span></th>
                  <th>Since</th>
                  <th>Benefits</th>
                  <th>Redemptions</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
      ${detailPane}
    </div>`;

  return appShell(mainContent, S.merchantPartnerships);
}

/* ─── PLACEHOLDER SCREENS (Orchestrator / Issuer) ───────────────────────── */
/* ─── NETWORK ORCHESTRATOR ───────────────────────────────────────────────── */

const GOVERNANCE_RULES = [
  { id:"r1", title:"Title length 10–80 characters",        category:"Content",   severity:"Required",  desc:"Deal title must clearly describe the offer without exceeding character limits." },
  { id:"r2", title:"Description free of prohibited terms", category:"Content",   severity:"Required",  desc:"No competitor brand names, misleading superlatives, or prohibited financial claims." },
  { id:"r3", title:"Discount value ≤ 50% (or pre-approved)",category:"Financial", severity:"Required", desc:"Discounts above 50% require Network Director pre-approval before submission." },
  { id:"r4", title:"Budget minimum $1,000",                category:"Financial", severity:"Required",  desc:"Total benefit budget must meet the network minimum to ensure campaign viability." },
  { id:"r5", title:"Campaign duration ≥ 7 days",           category:"Timing",    severity:"Required",  desc:"Short-duration campaigns risk poor issuer adoption and customer confusion." },
  { id:"r6", title:"Active days ≥ 3 per week",             category:"Timing",    severity:"Advisory",  desc:"Limiting redemptions to fewer than 3 days per week reduces reach and engagement." },
  { id:"r7", title:"At least 1 approved image attached",   category:"Content",   severity:"Advisory",  desc:"Visual content increases activation rates by issuers by up to 40%." },
  { id:"r8", title:"Co-fund agreements documented",        category:"Legal",     severity:"Required",  desc:"Any co-funded model requires a signed cost-sharing agreement on file." },
];

const DEMO_QUEUE = [
  {
    id:"q1",
    title:"Valentine's Day 2-for-1 Shoes",
    merchant:"Zappos", merchantColor:"#E07820", merchantInitials:"ZP",
    type:"Cashback", funding:"cofunded",
    submittedDate:"03/18/2026", submittedTime:"09:14 AM",
    slaHours:48, elapsedHours:50,
    status:"Pending",
    ruleResults:[
      { ruleId:"r1", verdict:"pass" },
      { ruleId:"r2", verdict:"pass" },
      { ruleId:"r3", verdict:"pass" },
      { ruleId:"r4", verdict:"pass" },
      { ruleId:"r5", verdict:"pass" },
      { ruleId:"r6", verdict:"pass" },
      { ruleId:"r7", verdict:"pass" },
      { ruleId:"r8", verdict:"warn", note:"Co-fund agreement pending signature." },
    ],
    discount:"40", budget:"50000", perRedemption:"40",
    timezone:"Buenos Aires, Argentina (GMT -3:00)",
    startDate:"09/17/2025", endDate:"—", activeDays:[0,4,5,6],
    mediaTitle:"Cashback: $40",
    mediaDescription:"Buy one pair, get one free for Valentine's Day.",
  },
  {
    id:"q2",
    title:"Spring Flash Sale — 25% Off Apparel",
    merchant:"Nordstrom", merchantColor:"#1A5276", merchantInitials:"NR",
    type:"Percentage", funding:"merchant",
    submittedDate:"03/20/2026", submittedTime:"11:30 AM",
    slaHours:48, elapsedHours:14,
    status:"In Review",
    ruleResults:[
      { ruleId:"r1", verdict:"pass" },
      { ruleId:"r2", verdict:"pass" },
      { ruleId:"r3", verdict:"pass" },
      { ruleId:"r4", verdict:"pass" },
      { ruleId:"r5", verdict:"pass" },
      { ruleId:"r6", verdict:"pass" },
      { ruleId:"r7", verdict:"pass" },
      { ruleId:"r8", verdict:"pass" },
    ],
    discount:"25", budget:"30000", perRedemption:"80",
    timezone:"New York, USA (GMT -5:00)",
    startDate:"04/01/2026", endDate:"04/30/2026", activeDays:[0,1,2,3,4,5,6],
    mediaTitle:"Spring Flash Sale",
    mediaDescription:"25% off all apparel lines this spring.",
  },
  {
    id:"q3",
    title:"Back-to-School $300 Laptop Bonus",
    merchant:"BestBuy", merchantColor:"#0D47A1", merchantInitials:"BB",
    type:"Fixed", funding:"issuer",
    submittedDate:"03/15/2026", submittedTime:"03:45 PM",
    slaHours:48, elapsedHours:145,
    status:"Changes Requested",
    ruleResults:[
      { ruleId:"r1", verdict:"pass" },
      { ruleId:"r2", verdict:"fail", note:"Title contains competitor brand reference." },
      { ruleId:"r3", verdict:"pass" },
      { ruleId:"r4", verdict:"pass" },
      { ruleId:"r5", verdict:"warn", note:"Campaign duration is only 5 days." },
      { ruleId:"r6", verdict:"pass" },
      { ruleId:"r7", verdict:"fail", note:"No approved image attached." },
      { ruleId:"r8", verdict:"pass" },
    ],
    discount:"300", budget:"45000", perRedemption:"300",
    timezone:"Los Angeles, USA (GMT -8:00)",
    startDate:"08/10/2026", endDate:"08/14/2026", activeDays:[0,1,2,3,4],
    mediaTitle:"$300 Laptop Bonus",
    mediaDescription:"Get $300 back on select laptops for back to school.",
  },
];

function getQueueDeal(id) {
  const deal = DEMO_QUEUE.find(d => d.id === id) || DEMO_QUEUE[0];
  // Zappos deal (q1) reflects live workflow state
  if (deal.id === "q1") {
    const d = state.workflow.orchestratorDecision;
    const status = d === "approved" ? "Approved"
      : d === "rejected" ? "Rejected"
      : d === "changes"  ? "Changes Requested"
      : state.workflow.submitted ? "Pending"
      : "Pending";
    return { ...deal, status };
  }
  return deal;
}

function getLiveQueue() {
  return DEMO_QUEUE.map(d => d.id === "q1" ? getQueueDeal("q1") : d);
}

function networkShell(content, activePath) {
  const navItems = [
    { label:"Review Queue",   icon:"tray",           path:S.networkQueue },
    { label:"AI Analysis",    icon:"robot",          path:S.networkAI },
    { label:"Rules Engine",   icon:"shield-check",   path:S.networkRules },
    { label:"Library",        icon:"books",          path:S.networkLibrary },
    { divider: true },
    { label:"Reports",        icon:"chart-bar",      path:"network/reports", disabled:true },
    { label:"Settings",       icon:"gear",           path:"network/settings", disabled:true },
    { label:"Help",           icon:"chat-circle",    path:"network/help", disabled:true },
  ];

  const nav = navItems.map(item => {
    if (item.divider) return `<div class="sidebar-divider"></div>`;
    const active = activePath === item.path ? "active" : "";
    if (item.disabled) {
      return `<div class="nav-item ${active}" style="opacity:.45;cursor:default">
        ${icon(item.icon)} <span>${item.label}</span>
      </div>`;
    }
    return `<a class="nav-item ${active}" href="#${item.path}">
      ${icon(item.icon)} <span>${item.label}</span>
    </a>`;
  }).join("");

  return `<div class="app-container">
    <aside class="sidebar">
      ${logoBlock()}
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-bottom">
        <div class="sidebar-user" data-nav="${S.index}">
          <div class="user-avatar" style="background:#1A5276">MP</div>
          <div class="user-info">
            <div class="user-name">Marcus Patel</div>
            <div class="user-role">Network Admin</div>
          </div>
          ${icon("arrow-square-out","user-ext")}
        </div>
      </div>
    </aside>
    <div class="workspace">
      ${content}
    </div>
  </div>`;
}

function renderNetworkQueue() {
  const filter = state.network.queueFilter;
  const filters = ["all","Pending","In Review","Approved","Changes Requested","Rejected"];
  const liveQueue = getLiveQueue();
  const filterCounts = filters.reduce((acc, f) => {
    acc[f] = f === "all" ? liveQueue.length : liveQueue.filter(d => d.status === f).length;
    return acc;
  }, {});

  const filterChips = filters.map(f => {
    const count = filterCounts[f] || 0;
    const isActive = filter === f;
    return `<button class="status-filter ${isActive?"active":""}" data-net-filter="${f}">
      ${f === "all" ? "All" : f}
      ${count > 0 && f !== "all" ? `<span class="filter-count">${count}</span>` : ""}
    </button>`;
  }).join("");

  const deals = liveQueue.filter(d => filter === "all" || d.status === filter);

  const slaTag = (d) => {
    const remaining = d.slaHours - d.elapsedHours;
    if (remaining < 0) return `<span class="sla-chip sla-over">${icon("warning")} Overdue ${Math.abs(remaining)}h</span>`;
    if (remaining < 8)  return `<span class="sla-chip sla-warn">${icon("clock")} ${remaining}h left</span>`;
    return `<span class="sla-chip sla-ok">${icon("check")} ${remaining}h left</span>`;
  };

  const fundingLabel = { merchant:"Merchant", cofunded:"Co-funded", issuer:"Issuer" };

  const rows = deals.map(d => `
    <tr class="${state.network.selectedDealId === d.id ? "selected" : ""}" data-select-deal="${d.id}">
      <td>
        <div class="coupon-cell">
          <div class="coupon-thumb" style="background:${d.merchantColor};color:#fff">
            <span style="font-size:11px;font-weight:700">${d.merchantInitials}</span>
          </div>
          <div>
            <div style="font-weight:600;font-size:13.5px">${d.title}</div>
            <div style="font-size:12px;color:var(--muted)">${d.type}</div>
          </div>
        </div>
      </td>
      <td>${d.merchant}</td>
      <td><span class="funding-pill ${d.funding}">${fundingLabel[d.funding]}</span></td>
      <td><div style="font-size:13px">${d.submittedDate}</div><div style="font-size:11px;color:var(--muted)">${d.submittedTime}</div></td>
      <td>${slaTag(d)}</td>
      <td>${badge(d.status)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-primary" style="height:30px;font-size:12px;padding:0 12px" data-nav-deal="${d.id}">Review</button>
        </div>
      </td>
    </tr>`).join("");

  // KPI strip
  const overdue = liveQueue.filter(d => d.elapsedHours > d.slaHours && ["Pending","In Review"].includes(d.status)).length;
  const kpis = [
    { label:"Awaiting review",   value: liveQueue.filter(d=>d.status==="Pending").length,  icon:"tray",        color:"var(--warning)" },
    { label:"In review",         value: liveQueue.filter(d=>d.status==="In Review").length, icon:"eye",         color:"var(--info)" },
    { label:"SLA breaches",      value: overdue,                                            icon:"warning",     color:"var(--danger)" },
    { label:"Resolved this week",value: liveQueue.filter(d=>["Approved","Rejected","Changes Requested"].includes(d.status)).length + 4,
                                                                                            icon:"check-circle",color:"var(--success)" },
  ];

  const kpiHtml = kpis.map(k => `
    <div class="net-kpi">
      <div class="net-kpi-icon" style="color:${k.color}">${icon(k.icon)}</div>
      <div>
        <div class="net-kpi-val">${k.value}</div>
        <div class="net-kpi-lab">${k.label}</div>
      </div>
    </div>`).join("");

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("tray")} Review Queue</div>
      </div>
      <div class="topbar-right">
        <div class="search-bar">${icon("magnifying-glass")}<input placeholder="Search submissions…" /></div>
      </div>
    </div>
    <div class="page-content">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("shield-check")} Governance</div>
          <div class="page-title">Deal Review Queue</div>
        </div>
      </div>
      <p class="intro-text">Review merchant benefit submissions against governance rules. Approve, request changes, or reject deals before they reach issuers.</p>

      <div class="net-kpi-strip">${kpiHtml}</div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        ${filterChips}
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Submission</th>
            <th>Merchant</th>
            <th>Funding</th>
            <th>Submitted</th>
            <th>SLA</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            ${rows || `<tr><td colspan="7"><div class="empty-state" style="padding:32px 0"><p>No submissions match this filter.</p></div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

  return networkShell(content, S.networkQueue);
}

function renderNetworkDetail() {
  const deal = state.network.selectedDealId
    ? getQueueDeal(state.network.selectedDealId)
    : DEMO_QUEUE[0];

  if (!state.network.selectedDealId) state.network.selectedDealId = deal.id;

  const passCount = deal.ruleResults.filter(r => r.verdict === "pass").length;
  const warnCount = deal.ruleResults.filter(r => r.verdict === "warn").length;
  const failCount = deal.ruleResults.filter(r => r.verdict === "fail").length;
  const score = passCount;
  const scorePct = Math.round(passCount / deal.ruleResults.length * 100);

  const verdictIcon = { pass:"check-circle", warn:"warning", fail:"x-circle" };
  const verdictColor = { pass:"var(--success)", warn:"var(--warning)", fail:"var(--danger)" };
  const verdictLabel = { pass:"Compliant", warn:"Review", fail:"Violation" };

  const decision = state.workflow.orchestratorDecision;

  const navSections = [
    { id:"sec-identity",    label:"Identity",        verdict: "pass" },
    { id:"sec-funding",     label:"Funding & Budget", verdict: deal.funding === "cofunded" && deal.ruleResults.find(r=>r.ruleId==="r8")?.verdict === "warn" ? "warn" : "pass" },
    { id:"sec-validity",    label:"Validity",         verdict: "pass" },
    { id:"sec-media",       label:"Media",            verdict: deal.ruleResults.find(r=>r.ruleId==="r7")?.verdict || "pass" },
    { id:"sec-compliance",  label:"Compliance",       verdict: failCount > 0 ? "fail" : warnCount > 0 ? "warn" : "pass" },
  ];

  const reviewNav = navSections.map(s => `
    <button class="review-nav-item" data-scroll-to="${s.id}">
      <span class="review-nav-dot" style="color:${verdictColor[s.verdict]}">${icon(verdictIcon[s.verdict])}</span>
      <span>${s.label}</span>
    </button>`).join("");

  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const activeDayPills = dayLabels.map((d,i) =>
    `<span class="day-pill ${deal.activeDays.includes(i)?"":"off"}">${d.slice(0,1)}</span>`
  ).join("");

  const fundingLabel = { merchant:"Merchant-funded", cofunded:"Co-funded", issuer:"Issuer-funded" };
  const fundingClass = deal.funding;

  const complianceRows = deal.ruleResults.map(r => {
    const rule = GOVERNANCE_RULES.find(g => g.id === r.ruleId);
    if (!rule) return "";
    return `<div class="compliance-row">
      <div class="compliance-rule-info">
        <div class="compliance-rule-name">${rule.title}</div>
        <div class="compliance-rule-desc">${r.note || rule.desc}</div>
      </div>
      <div class="compliance-verdict" style="color:${verdictColor[r.verdict]}">
        ${icon(verdictIcon[r.verdict])}
        <span>${verdictLabel[r.verdict]}</span>
      </div>
    </div>`;
  }).join("");

  // Confirm modal overlay
  const modal = state.network.confirmModal ? (() => {
    const a = state.network.confirmModal.action;
    const cfg = {
      approve:  { title:"Approve this deal?",          sub:"It will be sent to the issuer library for activation.", btn:"Approve",          btnClass:"btn-primary",  icon:"check-circle" },
      changes:  { title:"Request changes?",            sub:"The merchant will be notified with your review notes.",  btn:"Request Changes",  btnClass:"btn-secondary", icon:"pencil-simple" },
      reject:   { title:"Reject this submission?",     sub:"The merchant will be notified. This cannot be undone.", btn:"Reject",           btnClass:"btn-danger",    icon:"x-circle" },
    }[a];
    return `<div class="confirm-backdrop">
      <div class="confirm-modal">
        <div class="confirm-icon" style="color:${a==="approve"?"var(--success)":a==="reject"?"var(--danger)":"var(--warning)"}">${icon(cfg.icon)}</div>
        <div class="confirm-title">${cfg.title}</div>
        <div class="confirm-sub">${cfg.sub}</div>
        ${state.network.reviewNotes ? `<div class="confirm-notes">"${state.network.reviewNotes}"</div>` : ""}
        <div class="confirm-actions">
          <button class="btn btn-secondary" data-action="close-confirm">Cancel</button>
          <button class="btn ${cfg.btnClass}" data-action="confirm-decision" data-decision="${a}">${cfg.btn}</button>
        </div>
      </div>
    </div>`;
  })() : "";

  const decisionPanel = decision ? `
    <div class="decision-panel">
      <div class="decision-result ${decision}">
        <div class="decision-result-icon">${icon(decision==="approved"?"check-circle":decision==="rejected"?"x-circle":"pencil-simple","ph-fill")}</div>
        <div>
          <div class="decision-result-label">${decision==="approved"?"Approved":decision==="rejected"?"Rejected":"Changes Requested"}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">Reviewed by Marcus Patel · Just now</div>
        </div>
      </div>
      ${state.network.reviewNotes ? `<div class="review-notes-display"><div class="review-notes-label">${icon("note")} Reviewer notes</div><div class="review-notes-text">${state.network.reviewNotes}</div></div>` : ""}
      <a href="#${S.networkQueue}" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:16px">${icon("caret-left")} Back to queue</a>
    </div>` : `
    <div class="decision-panel">
      <div class="decision-meta-card">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div class="coupon-thumb" style="background:${deal.merchantColor};color:#fff;width:44px;height:44px;border-radius:10px;flex-shrink:0;display:grid;place-items:center;font-size:13px;font-weight:700">${deal.merchantInitials}</div>
          <div>
            <div style="font-weight:700;font-size:14px">${deal.merchant}</div>
            <div style="font-size:12px;color:var(--muted)">Submitted ${deal.submittedDate}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="meta-chip">${icon("tag")} <span>${deal.type}</span></div>
          <div class="meta-chip"><span class="funding-pill ${fundingClass}">${fundingLabel[deal.funding]}</span></div>
          <div class="meta-chip">${icon("coins")} <span>$${Number(deal.budget).toLocaleString()}</span></div>
          <div class="meta-chip">${icon("receipt")} <span>$${deal.perRedemption}/use</span></div>
        </div>
      </div>

      <div class="governance-score-card">
        <div class="governance-ring" style="--score-pct:${scorePct}">
          <svg viewBox="0 0 56 56" class="ring-svg">
            <circle cx="28" cy="28" r="23" fill="none" stroke="var(--line)" stroke-width="5"/>
            <circle cx="28" cy="28" r="23" fill="none"
              stroke="${failCount>0?"var(--danger)":warnCount>0?"var(--warning)":"var(--success)"}"
              stroke-width="5" stroke-linecap="round"
              stroke-dasharray="${Math.round(2*Math.PI*23*scorePct/100)} ${Math.round(2*Math.PI*23)}"
              stroke-dashoffset="${Math.round(2*Math.PI*23*0.25)}"
            />
          </svg>
          <div class="ring-label">${score}/${deal.ruleResults.length}</div>
        </div>
        <div>
          <div style="font-weight:700;font-size:15px">${failCount===0&&warnCount===0?"All rules passed":failCount>0?`${failCount} violation${failCount>1?"s":""}`:`${warnCount} warning${warnCount>1?"s":""}`}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:3px">${failCount===0&&warnCount===0?"Ready for approval":"Review issues below"}</div>
        </div>
      </div>

      <div>
        <div class="review-panel-label">${icon("robot")} AI confidence</div>
        <div class="ai-confidence-strip">
          <div class="ai-confidence-bar" style="width:${deal.ruleResults.filter(r=>r.verdict==="pass").length/deal.ruleResults.length*100}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px">
          <span style="color:var(--muted)">Risk assessment</span>
          <a href="#${S.networkAI}" style="color:var(--brand);font-weight:600">Full AI report →</a>
        </div>
      </div>

      <div>
        <div class="review-panel-label">${icon("note")} Reviewer notes</div>
        <textarea class="review-notes-input" placeholder="Add your review comments here…" data-bind="network.reviewNotes">${state.network.reviewNotes}</textarea>
      </div>

      <div class="decision-actions">
        <button class="btn btn-primary decision-btn approve" data-action="open-confirm" data-decision="approve">
          ${icon("check-circle")} Approve
        </button>
        <button class="btn btn-secondary decision-btn changes" data-action="open-confirm" data-decision="changes">
          ${icon("pencil-simple")} Request Changes
        </button>
        <button class="btn btn-ghost decision-btn reject" data-action="open-confirm" data-decision="reject" style="color:var(--danger);border-color:var(--danger)">
          ${icon("x-circle")} Reject
        </button>
      </div>
    </div>`;

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <a href="#${S.networkQueue}" class="topbar-breadcrumb" style="color:var(--muted)">${icon("caret-left")} Queue</a>
        <span style="color:var(--line-strong);margin:0 8px">/</span>
        <span class="topbar-breadcrumb">${deal.title}</span>
      </div>
      <div class="topbar-right">
        ${badge(deal.status)}
      </div>
    </div>
    <div class="review-shell">
      <div class="review-nav-col">
        <div class="review-nav-label">Sections</div>
        ${reviewNav}
        <div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--line)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">DEAL ID</div>
          <div style="font-size:12px;font-family:monospace;color:var(--text)">${deal.id.toUpperCase()}-2026</div>
        </div>
      </div>

      <div class="review-content" id="review-content">
        <div class="review-section" id="sec-identity">
          <div class="review-section-header">
            <div class="review-section-title">${icon("identification-badge")} Identity</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Title</div>
            <div class="review-field-value">${deal.title}</div>
            <div class="verdict-tag pass">${icon("check-circle")} Compliant</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Benefit type</div>
            <div class="review-field-value">${deal.type}</div>
            <div class="verdict-tag pass">${icon("check-circle")} Compliant</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Discount value</div>
            <div class="review-field-value">$${deal.discount} / ${deal.type === "Percentage" ? deal.discount + "%" : "fixed"}</div>
            <div class="verdict-tag ${Number(deal.discount) > 50 ? "fail" : "pass"}">${icon(Number(deal.discount) > 50 ? "x-circle" : "check-circle")} ${Number(deal.discount) > 50 ? "Violation — exceeds 50%" : "Compliant"}</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Description</div>
            <div class="review-field-value">${deal.mediaDescription}</div>
            <div class="verdict-tag ${deal.ruleResults.find(r=>r.ruleId==="r2")?.verdict || "pass"}">${icon(verdictIcon[deal.ruleResults.find(r=>r.ruleId==="r2")?.verdict||"pass"])} ${verdictLabel[deal.ruleResults.find(r=>r.ruleId==="r2")?.verdict||"pass"]}${deal.ruleResults.find(r=>r.ruleId==="r2")?.note ? ` — ${deal.ruleResults.find(r=>r.ruleId==="r2").note}` : ""}</div>
          </div>
        </div>

        <div class="review-section" id="sec-funding">
          <div class="review-section-header">
            <div class="review-section-title">${icon("coins")} Funding &amp; Budget</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Funding model</div>
            <div class="review-field-value"><span class="funding-pill ${deal.funding}">${fundingLabel[deal.funding]}</span></div>
            <div class="verdict-tag ${deal.ruleResults.find(r=>r.ruleId==="r8")?.verdict||"pass"}">${icon(verdictIcon[deal.ruleResults.find(r=>r.ruleId==="r8")?.verdict||"pass"])} ${verdictLabel[deal.ruleResults.find(r=>r.ruleId==="r8")?.verdict||"pass"]}${deal.ruleResults.find(r=>r.ruleId==="r8")?.note ? ` — ${deal.ruleResults.find(r=>r.ruleId==="r8").note}` : ""}</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Total budget</div>
            <div class="review-field-value">$${Number(deal.budget).toLocaleString()}</div>
            <div class="verdict-tag ${Number(deal.budget) >= 1000 ? "pass" : "fail"}">${icon(Number(deal.budget) >= 1000 ? "check-circle" : "x-circle")} ${Number(deal.budget) >= 1000 ? "Compliant" : "Violation — below $1,000 minimum"}</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Max per redemption</div>
            <div class="review-field-value">$${deal.perRedemption}</div>
            <div class="verdict-tag pass">${icon("check-circle")} Compliant</div>
          </div>
        </div>

        <div class="review-section" id="sec-validity">
          <div class="review-section-header">
            <div class="review-section-title">${icon("calendar-blank")} Validity</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Timezone</div>
            <div class="review-field-value">${deal.timezone}</div>
            <div class="verdict-tag pass">${icon("check-circle")} Compliant</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Date range</div>
            <div class="review-field-value">${deal.startDate} → ${deal.endDate || "No end date"}</div>
            <div class="verdict-tag ${deal.ruleResults.find(r=>r.ruleId==="r5")?.verdict||"pass"}">${icon(verdictIcon[deal.ruleResults.find(r=>r.ruleId==="r5")?.verdict||"pass"])} ${verdictLabel[deal.ruleResults.find(r=>r.ruleId==="r5")?.verdict||"pass"]}${deal.ruleResults.find(r=>r.ruleId==="r5")?.note ? ` — ${deal.ruleResults.find(r=>r.ruleId==="r5").note}` : ""}</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Active days</div>
            <div class="review-field-value"><div class="day-pills" style="gap:3px">${activeDayPills}</div></div>
            <div class="verdict-tag ${deal.ruleResults.find(r=>r.ruleId==="r6")?.verdict||"pass"}">${icon(verdictIcon[deal.ruleResults.find(r=>r.ruleId==="r6")?.verdict||"pass"])} ${verdictLabel[deal.ruleResults.find(r=>r.ruleId==="r6")?.verdict||"pass"]}</div>
          </div>
        </div>

        <div class="review-section" id="sec-media">
          <div class="review-section-header">
            <div class="review-section-title">${icon("image-square")} Media</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Media title</div>
            <div class="review-field-value">${deal.mediaTitle}</div>
            <div class="verdict-tag pass">${icon("check-circle")} Compliant</div>
          </div>
          <div class="review-field">
            <div class="review-field-label">Images attached</div>
            <div class="review-field-value">${deal.ruleResults.find(r=>r.ruleId==="r7")?.verdict === "fail" ? "No images uploaded" : "1 image attached"}</div>
            <div class="verdict-tag ${deal.ruleResults.find(r=>r.ruleId==="r7")?.verdict||"pass"}">${icon(verdictIcon[deal.ruleResults.find(r=>r.ruleId==="r7")?.verdict||"pass"])} ${verdictLabel[deal.ruleResults.find(r=>r.ruleId==="r7")?.verdict||"pass"]}${deal.ruleResults.find(r=>r.ruleId==="r7")?.note ? ` — ${deal.ruleResults.find(r=>r.ruleId==="r7").note}` : ""}</div>
          </div>
        </div>

        <div class="review-section" id="sec-compliance">
          <div class="review-section-header">
            <div class="review-section-title">${icon("shield-check")} Compliance Checklist</div>
            <div style="font-size:13px;color:var(--muted)">${passCount} passed · ${warnCount} warnings · ${failCount} violations</div>
          </div>
          ${complianceRows}
        </div>
      </div>

      ${decisionPanel}
    </div>
    ${modal}`;

  return networkShell(content, S.networkQueue);
}

function renderNetworkAI() {
  const deal = state.network.selectedDealId
    ? getQueueDeal(state.network.selectedDealId)
    : DEMO_QUEUE[0];

  const passCount = deal.ruleResults.filter(r => r.verdict === "pass").length;
  const confidence = Math.round(passCount / deal.ruleResults.length * 100);
  const riskLevel = confidence >= 90 ? "Low" : confidence >= 70 ? "Medium" : "High";
  const riskColor = { Low:"var(--success)", Medium:"var(--warning)", High:"var(--danger)" }[riskLevel];

  const circumference = Math.round(2 * Math.PI * 44);
  const dashArray = Math.round(circumference * confidence / 100);

  const aiRows = deal.ruleResults.map(r => {
    const rule = GOVERNANCE_RULES.find(g => g.id === r.ruleId);
    if (!rule) return "";
    const conf = r.verdict === "pass" ? 95 + Math.floor(Math.random()*5) : r.verdict === "warn" ? 62 : 35;
    const suggestion = r.verdict === "pass" ? "No action needed" : r.verdict === "warn" ? "Manual review recommended" : "Block until resolved";
    return `<tr>
      <td><div style="font-weight:500;font-size:13px">${rule.title}</div><div style="font-size:11px;color:var(--muted)">${rule.category} · ${rule.severity}</div></td>
      <td><span style="color:${r.verdict==="pass"?"var(--success)":r.verdict==="warn"?"var(--warning)":"var(--danger)"};font-weight:600">${r.verdict === "pass" ? "Pass" : r.verdict === "warn" ? "Warning" : "Fail"}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--line)">
            <div style="height:100%;width:${conf}%;background:${r.verdict==="pass"?"var(--success)":r.verdict==="warn"?"var(--warning)":"var(--danger)"};border-radius:3px"></div>
          </div>
          <span style="font-size:12px;font-weight:600;min-width:28px">${conf}%</span>
        </div>
      </td>
      <td style="font-size:12px;color:var(--muted)">${suggestion}</td>
    </tr>`;
  }).join("");

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("robot")} AI Analysis</div>
      </div>
      <div class="topbar-right">
        <span style="font-size:12px;color:var(--muted)">Priceless AI v2 · Analyzed 2 min ago</span>
      </div>
    </div>
    <div class="page-content" style="gap:20px;display:flex;flex-direction:column">
      <div class="page-header" style="margin-bottom:0">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("robot")} AI</div>
          <div class="page-title">Risk Analysis — ${deal.title}</div>
        </div>
        <div class="page-header-right">
          <a href="#${S.networkDetail}" class="btn btn-secondary">${icon("file-search")} View full review</a>
        </div>
      </div>

      <div class="ai-hero-card">
        <div class="ai-donut-wrap">
          <svg viewBox="0 0 100 100" class="ai-donut">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" stroke-width="9"/>
            <circle cx="50" cy="50" r="44" fill="none"
              stroke="${riskColor}" stroke-width="9" stroke-linecap="round"
              stroke-dasharray="${dashArray} ${circumference}"
              stroke-dashoffset="${Math.round(circumference * 0.25)}"
              style="transition:stroke-dasharray .6s ease"
            />
          </svg>
          <div class="ai-donut-label">
            <div class="ai-donut-value">${confidence}%</div>
            <div class="ai-donut-sub">confidence</div>
          </div>
        </div>
        <div class="ai-hero-body">
          <div class="ai-hero-risk">
            <span class="ai-risk-pill" style="background:${riskColor}20;color:${riskColor}">${icon("shield")} ${riskLevel} Risk</span>
          </div>
          <div class="ai-hero-title">AI Assessment Complete</div>
          <div class="ai-hero-desc">Model analyzed ${deal.ruleResults.length} governance rules across 4 categories. ${passCount} rules passed automatically. ${deal.ruleResults.length - passCount} require human review.</div>
          <div class="ai-tags">
            <span class="ai-tag">${icon("check")} Content verified</span>
            <span class="ai-tag">${icon("check")} Financial limits checked</span>
            <span class="ai-tag">${icon("check")} Timing validated</span>
            ${deal.funding === "cofunded" ? `<span class="ai-tag warn">${icon("warning")} Legal: pending</span>` : `<span class="ai-tag">${icon("check")} Legal cleared</span>`}
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div class="dash-card">
          <div class="dash-card-header"><div class="dash-card-title">${icon("text-aa")} Sentiment &amp; Brand Fit</div></div>
          <div class="ai-score-ring" style="--s:82">
            <div style="font-size:22px;font-weight:800;color:var(--success)">82%</div>
            <div style="font-size:12px;color:var(--muted)">Brand fit score</div>
          </div>
          <p style="font-size:12px;color:var(--muted);margin-top:12px;line-height:1.5">Deal language is clear and on-brand. Tone is consistent with Priceless network standards. No negative sentiment detected.</p>
        </div>
        <div class="dash-card">
          <div class="dash-card-header"><div class="dash-card-title">${icon("users")} Audience Relevance</div></div>
          <div style="font-size:22px;font-weight:800;color:var(--info);margin-bottom:8px">~73%</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Estimated member match</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${["Millennials 25–34","Lifestyle shoppers","Fashion-forward","High LTV"].map(t => `<span style="font-size:11px;padding:3px 8px;border-radius:var(--r-full);background:var(--info-soft);color:var(--info)">${t}</span>`).join("")}
          </div>
        </div>
        <div class="dash-card">
          <div class="dash-card-header"><div class="dash-card-title">${icon("trend-up")} Competitive Context</div></div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Similar active deals in library</div>
          ${["BOGO offer — Aldo (Active)","Footwear 20% — DSW (Expired)","Valentine cashback — Steve Madden (Active)"].map(t => `
            <div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--line);color:var(--text)">${t}</div>`).join("")}
          <div style="font-size:11px;color:var(--success);margin-top:8px;font-weight:600">${icon("check")} Differentiated from active portfolio</div>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">${icon("list-checks")} Rule-by-Rule AI Breakdown</div>
        </div>
        <table class="dash-table">
          <thead><tr>
            <th>Rule</th><th>Assessment</th><th>Confidence</th><th>Suggested action</th>
          </tr></thead>
          <tbody>${aiRows}</tbody>
        </table>
      </div>
    </div>`;

  return networkShell(content, S.networkAI);
}

function renderNetworkRules() {
  const tab = state.network.rulesTab;
  const tabs = ["all","Content","Financial","Timing","Legal"];

  const tabsHtml = tabs.map(t => `
    <button class="status-filter ${tab===t?"active":""}" data-rules-tab="${t}">${t==="all"?"All categories":t}</button>`
  ).join("");

  const filtered = tab === "all" ? GOVERNANCE_RULES : GOVERNANCE_RULES.filter(r => r.category === tab);
  const categoryColor = { Content:"var(--info)", Financial:"var(--brand)", Timing:"var(--warning)", Legal:"var(--danger)" };

  const rows = filtered.map(r => `
    <tr>
      <td>
        <div style="font-weight:600;font-size:13.5px">${r.title}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:3px">${r.desc}</div>
      </td>
      <td><span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:var(--r-full);background:${categoryColor[r.category]}20;color:${categoryColor[r.category]}">${r.category}</span></td>
      <td><span class="badge ${r.severity==="Required"?"badge-pending":"badge-draft"}">${r.severity}</span></td>
      <td><span class="badge badge-approved">Active</span></td>
    </tr>`).join("");

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("shield-check")} Rules Engine</div>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary" style="opacity:.5;cursor:default">${icon("plus")} Add rule</button>
      </div>
    </div>
    <div class="page-content">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("shield-check")} Governance</div>
          <div class="page-title">Rules Engine</div>
        </div>
      </div>
      <p class="intro-text">These governance rules are automatically evaluated against every merchant submission. Required rules block approval; Advisory rules trigger warnings for manual review.</p>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
        ${[
          { label:"Total rules", value:GOVERNANCE_RULES.length, color:"var(--text)" },
          { label:"Required",    value:GOVERNANCE_RULES.filter(r=>r.severity==="Required").length, color:"var(--danger)" },
          { label:"Advisory",    value:GOVERNANCE_RULES.filter(r=>r.severity==="Advisory").length, color:"var(--warning)" },
          { label:"Active",      value:GOVERNANCE_RULES.length, color:"var(--success)" },
        ].map(k => `<div class="dash-card" style="padding:14px 16px">
          <div style="font-size:24px;font-weight:800;color:${k.color}">${k.value}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${k.label}</div>
        </div>`).join("")}
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">${tabsHtml}</div>

      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Rule</th><th>Category</th><th>Severity</th><th>Status</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  return networkShell(content, S.networkRules);
}

function renderNetworkLibrary() {
  const libraryDeals = [
    { id:"l1", title:"Summer Getaway 15% Off Hotels",          merchant:"Marriott",  merchantColor:"#8B0000", merchantInitials:"MR", funding:"merchant", approvedDate:"02/10/2026", issuer:"Chase USA",   status:"Approved", redemptions:2840 },
    { id:"l2", title:"5% Cashback on Grocery — Q1",           merchant:"Kroger",    merchantColor:"#1B5E20", merchantInitials:"KR", funding:"issuer",   approvedDate:"01/22/2026", issuer:"Banco BVA",  status:"Approved", redemptions:6120 },
    { id:"l3", title:"$50 Off First Smart TV Purchase",        merchant:"Samsung",   merchantColor:"#0D47A1", merchantInitials:"SM", funding:"cofunded", approvedDate:"03/01/2026", issuer:"BBVA Mexico",status:"Approved", redemptions:1330 },
    { id:"l4", title:"Free Delivery — 30 Days",               merchant:"DoorDash",  merchantColor:"#E65100", merchantInitials:"DD", funding:"merchant", approvedDate:"12/05/2025", issuer:"Chase USA",   status:"Approved", redemptions:9200 },
    { id:"l5", title:"Back-to-School Laptop Bonus (revised)", merchant:"BestBuy",   merchantColor:"#0D47A1", merchantInitials:"BB", funding:"issuer",   approvedDate:"—",          issuer:"Pending",     status:"Approved", redemptions:0    },
  ];

  const sel = state.network.selectedDealId;
  const selDeal = libraryDeals.find(d => d.id === sel);
  const fundingLabel = { merchant:"Merchant", cofunded:"Co-funded", issuer:"Issuer" };

  const rows = libraryDeals.map(d => `
    <tr class="${sel===d.id?"selected":""}" data-select-library-deal="${d.id}">
      <td>
        <div class="coupon-cell">
          <div class="coupon-thumb" style="background:${d.merchantColor};color:#fff">
            <span style="font-size:11px;font-weight:700">${d.merchantInitials}</span>
          </div>
          <span class="coupon-name">${d.title}</span>
        </div>
      </td>
      <td>${d.merchant}</td>
      <td><span class="funding-pill ${d.funding}">${fundingLabel[d.funding]}</span></td>
      <td>${d.approvedDate}</td>
      <td>${d.issuer}</td>
      <td>${badge(d.status)}</td>
      <td style="text-align:right;font-weight:600">${d.redemptions.toLocaleString()}</td>
    </tr>`).join("");

  const detailPane = selDeal ? `
    <div class="benefits-detail-pane" style="padding:0">
      <div class="detail-topbar">
        <button class="btn-icon" data-action="close-library-deal">${icon("x")}</button>
      </div>
      <div class="detail-body">
        <div class="detail-title-row">
          <div>
            <div class="detail-title">${selDeal.title}</div>
            <div class="detail-tagline">${selDeal.merchant}</div>
          </div>
        </div>
        <div class="detail-facts-card">
          <div class="meta-chip">${icon("coins")} <span>Funding: <strong>${fundingLabel[selDeal.funding]}</strong></span></div>
          <div class="meta-chip">${icon("buildings")} <span>Issuer: <strong>${selDeal.issuer}</strong></span></div>
          <div class="meta-chip">${icon("calendar-check")} <span>Approved: <strong>${selDeal.approvedDate}</strong></span></div>
          <div class="meta-chip">${icon("receipt")} <span>Redemptions: <strong>${selDeal.redemptions.toLocaleString()}</strong></span></div>
        </div>
        <div>
          <div class="detail-section-label">Audit trail</div>
          ${[
            { action:"Submitted by merchant",       actor:`${selDeal.merchant}`,   time:"D-5" },
            { action:"AI analysis completed",       actor:"Priceless AI v2",       time:"D-5" },
            { action:"Assigned for manual review",  actor:"Marcus Patel",          time:"D-4" },
            { action:"Approved by Network Admin",   actor:"Marcus Patel",          time:selDeal.approvedDate },
          ].map(a => `
            <div class="activity-row">
              <div class="activity-dot" style="color:var(--success)">${icon("check-circle")}</div>
              <div class="activity-body">
                <div class="activity-text">${a.action}</div>
                <div class="activity-time">${a.actor} · ${a.time}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </div>` : "";

  const content = `
    <div class="benefits-layout">
      <div class="benefits-list-pane">
        <div class="topbar">
          <div class="topbar-left">
            <div class="topbar-breadcrumb">${icon("books")} Library</div>
          </div>
        </div>
        <div class="page-content">
          <div class="page-header">
            <div class="page-header-left">
              <div class="page-eyebrow">${icon("books")} Archive</div>
              <div class="page-title">Approved Deals Library</div>
            </div>
          </div>
          <p class="intro-text">All deals cleared by the Network Orchestrator. Issuers can activate any approved deal from their portal.</p>
          <div class="table-wrap">
            <table>
              <thead><tr>
                <th>Deal</th><th>Merchant</th><th>Funding</th>
                <th>Approved</th><th>Issuer</th><th>Status</th>
                <th style="text-align:right">Redemptions</th>
              </tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
      ${detailPane}
    </div>`;

  return networkShell(content, S.networkLibrary);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ISSUER PUBLISHER
   ═══════════════════════════════════════════════════════════════════════════ */

const ISSUER_LIBRARY_DEALS = [
  {
    id:"il1",
    title:"Valentine's Day 2-for-1 Shoes",
    merchant:"Zappos", merchantColor:"#E07820", merchantInitials:"ZP",
    type:"Cashback", funding:"cofunded",
    discount:"$40", budget:"$50,000", perRedemption:"$40",
    approvedDate:"03/21/2026",
    startDate:"09/17/2026", endDate:"Open",
    activeDays:[0,4,5,6],
    category:"Footwear",
    description:"Buy one pair, get one free for Valentine's Day. $40 cashback per qualifying purchase.",
    estimatedMembers: 3265,
    tags:["fashion","valentines","shoes"],
  },
  {
    id:"il2",
    title:"Summer Getaway 15% Off Hotels",
    merchant:"Marriott", merchantColor:"#8B0000", merchantInitials:"MR",
    type:"Percentage", funding:"merchant",
    discount:"15%", budget:"$30,000", perRedemption:"$80",
    approvedDate:"02/10/2026",
    startDate:"06/01/2026", endDate:"08/31/2026",
    activeDays:[0,1,2,3,4,5,6],
    category:"Travel",
    description:"15% off hotel stays across the Marriott portfolio. Valid for bookings made through Priceless.",
    estimatedMembers: 8200,
    tags:["travel","hotels","summer"],
  },
  {
    id:"il3",
    title:"5% Cashback on Grocery — Q1",
    merchant:"Kroger", merchantColor:"#1B5E20", merchantInitials:"KR",
    type:"Cashback", funding:"issuer",
    discount:"5%", budget:"$15,000", perRedemption:"$12",
    approvedDate:"01/22/2026",
    startDate:"04/01/2026", endDate:"06/30/2026",
    activeDays:[0,1,2,3,4,5,6],
    category:"Grocery",
    description:"5% cashback on all grocery purchases at Kroger. Applied automatically at checkout.",
    estimatedMembers: 12400,
    tags:["grocery","cashback","everyday"],
  },
  {
    id:"il4",
    title:"$50 Off First Smart TV Purchase",
    merchant:"Samsung", merchantColor:"#0D47A1", merchantInitials:"SM",
    type:"Fixed", funding:"cofunded",
    discount:"$50", budget:"$45,000", perRedemption:"$50",
    approvedDate:"03/01/2026",
    startDate:"04/15/2026", endDate:"07/15/2026",
    activeDays:[0,1,2,3,4,5,6],
    category:"Electronics",
    description:"$50 fixed discount on first Smart TV purchase. Applies to models 40\" and above.",
    estimatedMembers: 5100,
    tags:["electronics","home","tech"],
  },
  {
    id:"il5",
    title:"Free Delivery — 30 Days",
    merchant:"DoorDash", merchantColor:"#E65100", merchantInitials:"DD",
    type:"Gift", funding:"merchant",
    discount:"Free delivery", budget:"$20,000", perRedemption:"$8",
    approvedDate:"12/05/2025",
    startDate:"05/01/2026", endDate:"05/31/2026",
    activeDays:[4,5,6],
    category:"Food & Dining",
    description:"Free delivery on all DoorDash orders for 30 days. Applies to orders over $15.",
    estimatedMembers: 9800,
    tags:["food","delivery","dining"],
  },
];

const ISSUER_LIFECYCLE_DEALS = [
  { id:"lc1", title:"5% Cashback on Grocery — Q1",     merchant:"Kroger",   merchantColor:"#1B5E20", merchantInitials:"KR", funding:"issuer",   activatedDate:"01/25/2026", status:"Active",  redemptions:6120, budget:"$15,000", consumed:82 },
  { id:"lc2", title:"Summer Getaway 15% Off Hotels",    merchant:"Marriott", merchantColor:"#8B0000", merchantInitials:"MR", funding:"merchant", activatedDate:"02/12/2026", status:"Active",  redemptions:2840, budget:"$30,000", consumed:61 },
  { id:"lc3", title:"$50 Off First Smart TV Purchase",  merchant:"Samsung",  merchantColor:"#0D47A1", merchantInitials:"SM", funding:"cofunded", activatedDate:"03/03/2026", status:"Active",  redemptions:1330, budget:"$45,000", consumed:37 },
  { id:"lc4", title:"Free Delivery — 30 Days",          merchant:"DoorDash", merchantColor:"#E65100", merchantInitials:"DD", funding:"merchant", activatedDate:"12/06/2025", status:"Paused",  redemptions:9200, budget:"$20,000", consumed:95 },
  { id:"lc5", title:"Back-to-School Laptop Bonus",      merchant:"BestBuy",  merchantColor:"#0D47A1", merchantInitials:"BB", funding:"issuer",   activatedDate:"08/15/2025", status:"Expired", redemptions:4400, budget:"$40,000", consumed:100 },
];

function issuerShell(content, activePath) {
  const navItems = [
    { label:"Deal Library",   icon:"books",          path:S.issuerLibrary },
    { label:"Analytics",      icon:"chart-bar",      path:S.issuerAnalytics },
    { label:"Lifecycle",      icon:"arrows-clockwise",path:S.issuerLifecycle },
    { divider: true },
    { label:"Members",        icon:"users",          path:"issuer/members",   disabled:true },
    { label:"Segments",       icon:"funnel",         path:"issuer/segments",  disabled:true },
    { divider: true },
    { label:"Settings",       icon:"gear",           path:"issuer/settings",  disabled:true },
    { label:"Help",           icon:"chat-circle",    path:"issuer/help",      disabled:true },
  ];

  const nav = navItems.map(item => {
    if (item.divider) return `<div class="sidebar-divider"></div>`;
    const active = activePath === item.path ? "active" : "";
    if (item.disabled) {
      return `<div class="nav-item ${active}" style="opacity:.45;cursor:default">
        ${icon(item.icon)} <span>${item.label}</span>
      </div>`;
    }
    return `<a class="nav-item ${active}" href="#${item.path}">
      ${icon(item.icon)} <span>${item.label}</span>
    </a>`;
  }).join("");

  return `<div class="app-container">
    <aside class="sidebar">
      ${logoBlock()}
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-bottom">
        <div class="sidebar-user" data-nav="${S.index}">
          <div class="user-avatar" style="background:#117A65">AC</div>
          <div class="user-info">
            <div class="user-name">Avery Coleman</div>
            <div class="user-role">Offer Manager · Banco BVA</div>
          </div>
          ${icon("arrow-square-out","user-ext")}
        </div>
      </div>
    </aside>
    <div class="workspace">
      ${content}
    </div>
  </div>`;
}

/* ─── ISSUER LIBRARY ─────────────────────────────────────────────────────── */
function renderIssuerLibrary() {
  const filter = state.issuer.libraryFilter;
  const sel = state.issuer.selectedDealId;
  const categories = ["all","Footwear","Travel","Grocery","Electronics","Food & Dining"];
  const fundingLabel = { merchant:"Merchant", cofunded:"Co-funded", issuer:"Issuer" };
  const activated = state.issuer.activatedDeals;

  const chips = categories.map(c => `
    <button class="status-filter ${filter===c?"active":""}" data-issuer-filter="${c}">
      ${c === "all" ? "All categories" : c}
    </button>`).join("");

  const deals = filter === "all" ? ISSUER_LIBRARY_DEALS : ISSUER_LIBRARY_DEALS.filter(d => d.category === filter);

  // Zappos deal (il1) shows "New" badge when just approved by orchestrator
  const zapposNewlyApproved = state.workflow.orchestratorDecision === "approved"
    && !state.issuer.activatedDeals.includes("il1");

  const cards = deals.map(d => {
    const isActivated = activated.includes(d.id);
    const isNew = d.id === "il1" && zapposNewlyApproved;
    return `
    <div class="issuer-deal-card ${sel===d.id?"selected":""}${isActivated?" activated":""}${isNew?" newly-approved":""}" data-select-issuer-deal="${d.id}">
      ${isNew ? `<div class="issuer-new-ribbon">${icon("check-circle")} Just approved</div>` : ""}
      <div class="issuer-deal-card-top">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="coupon-thumb" style="background:${d.merchantColor};color:#fff;width:40px;height:40px;border-radius:8px;flex-shrink:0;display:grid;place-items:center;font-size:12px;font-weight:700">${d.merchantInitials}</div>
          <div>
            <div style="font-size:11px;color:var(--muted)">${d.merchant} · ${d.category}</div>
            <div style="font-weight:700;font-size:13.5px;line-height:1.3;margin-top:1px">${d.title}</div>
          </div>
        </div>
        ${isActivated
          ? `<span class="badge badge-published" style="flex-shrink:0">Active</span>`
          : `<span class="badge badge-approved" style="flex-shrink:0">Ready</span>`}
      </div>
      <div class="issuer-deal-card-meta">
        <div class="issuer-meta-item">${icon("percent")} <span>${d.discount}</span></div>
        <div class="issuer-meta-item">${icon("coins")} <span>${d.budget}</span></div>
        <div class="issuer-meta-item"><span class="funding-pill ${d.funding}">${fundingLabel[d.funding]}</span></div>
      </div>
      <div class="issuer-deal-card-desc">${d.description}</div>
      <div class="issuer-deal-card-footer">
        <div style="font-size:11px;color:var(--muted)">~${d.estimatedMembers.toLocaleString()} eligible members</div>
        ${isActivated
          ? `<button class="btn btn-secondary" style="height:32px;font-size:12px;padding:0 12px;opacity:.6;cursor:default">${icon("check")} Activated</button>`
          : `<button class="btn btn-primary" style="height:32px;font-size:12px;padding:0 12px" data-activate-deal="${d.id}">${icon("rocket-launch")} Activate</button>`}
      </div>
    </div>`;
  }).join("");

  // Detail panel when a deal is selected
  const selDeal = ISSUER_LIBRARY_DEALS.find(d => d.id === sel);
  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const detailPane = selDeal ? `
    <div class="issuer-detail-pane">
      <div class="detail-topbar">
        <button class="btn-icon" data-action="close-issuer-lib-deal">${icon("x")}</button>
      </div>
      <div class="detail-body">
        <div class="detail-title-row">
          <div>
            <div class="detail-title">${selDeal.title}</div>
            <div class="detail-tagline">${selDeal.merchant} · ${selDeal.category}</div>
          </div>
        </div>
        <div class="detail-facts-card">
          <div class="meta-chip">${icon("percent")} <span>Discount: <strong>${selDeal.discount}</strong></span></div>
          <div class="meta-chip">${icon("coins")} <span>Budget: <strong>${selDeal.budget}</strong></span></div>
          <div class="meta-chip">${icon("receipt")} <span>Per use: <strong>${selDeal.perRedemption}</strong></span></div>
          <div class="meta-chip"><span class="funding-pill ${selDeal.funding}">${fundingLabel[selDeal.funding]}</span></div>
          <div class="meta-chip">${icon("calendar-blank")} <span>${selDeal.startDate} → ${selDeal.endDate}</span></div>
          <div class="meta-chip">${icon("users")} <span>~${selDeal.estimatedMembers.toLocaleString()} eligible</span></div>
        </div>
        <div>
          <div class="detail-section-label">Description</div>
          <div class="detail-desc">${selDeal.description}</div>
        </div>
        <div>
          <div class="detail-section-label">Active days</div>
          <div class="day-pills" style="gap:4px;display:flex;flex-wrap:nowrap;margin-top:8px">
            ${dayLabels.map((d,i) => `<span class="day-pill ${selDeal.activeDays.includes(i)?"":"off"}">${d.slice(0,1)}</span>`).join("")}
          </div>
        </div>
        <div>
          <div class="detail-section-label">Tags</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
            ${selDeal.tags.map(t => `<span style="font-size:11px;padding:3px 8px;border-radius:var(--r-full);background:var(--surface-2);border:1px solid var(--line);color:var(--muted)">#${t}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="detail-footer">
        ${activated.includes(selDeal.id)
          ? `<button class="btn btn-secondary" style="width:100%;justify-content:center;height:44px;opacity:.6;cursor:default">${icon("check-circle")} Already activated</button>`
          : `<button class="btn btn-primary" style="width:100%;justify-content:center;height:44px" data-activate-deal="${selDeal.id}">${icon("rocket-launch")} Activate this deal</button>`}
      </div>
    </div>` : "";

  const content = `
    <div class="benefits-layout">
      <div class="benefits-list-pane">
        <div class="topbar">
          <div class="topbar-left">
            <div class="topbar-breadcrumb">${icon("books")} Deal Library</div>
          </div>
          <div class="topbar-right">
            <div class="search-bar">${icon("magnifying-glass")}<input placeholder="Search approved deals…" /></div>
          </div>
        </div>
        <div class="page-content">
          <div class="page-header">
            <div class="page-header-left">
              <div class="page-eyebrow">${icon("books")} Catalog</div>
              <div class="page-title">Approved Deal Library</div>
            </div>
          </div>
          <p class="intro-text">Browse all deals approved by the Network Orchestrator. Activate a deal to configure your segment, budget, and publication channels for your members.</p>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">${chips}</div>

          <div class="issuer-deals-grid">${cards}</div>
        </div>
      </div>
      ${detailPane}
    </div>`;

  return issuerShell(content, S.issuerLibrary);
}

/* ─── ISSUER ACTIVATION WIZARD ───────────────────────────────────────────── */
function renderIssuerActivation() {
  const step = state.issuer.activationStep;
  const act = state.issuer.activation;
  const dealId = state.issuer.selectedDealId || "il1";
  const deal = ISSUER_LIBRARY_DEALS.find(d => d.id === dealId) || ISSUER_LIBRARY_DEALS[0];
  const fundingLabel = { merchant:"Merchant", cofunded:"Co-funded", issuer:"Issuer" };

  const steps = [
    { label:"Configure",  icon:"sliders" },
    { label:"Preview",    icon:"eye" },
    { label:"Confirm",    icon:"check-circle" },
  ];

  const stepBar = steps.map((s, i) => `
    <div class="act-step ${i===step?"active":i<step?"done":""}">
      <div class="act-step-dot">${i < step ? icon("check") : String(i+1)}</div>
      <div class="act-step-label">${s.label}</div>
    </div>
    ${i < steps.length-1 ? `<div class="act-step-line ${i<step?"done":""}"></div>` : ""}`
  ).join("");

  const channels = [
    { id:"app",   icon:"device-mobile", label:"Mobile App" },
    { id:"email", icon:"envelope",      label:"Email" },
    { id:"web",   icon:"globe",         label:"Web Portal" },
    { id:"sms",   icon:"chat-text",     label:"SMS" },
  ];

  let formContent = "";
  if (step === 0) {
    const segmentOpts = [
      { id:"all",         label:"All members",              desc:"~12,400 eligible" },
      { id:"premium",     label:"Premium cardholders",      desc:"~4,200 eligible" },
      { id:"millennials", label:"Millennials (25–40)",      desc:"~3,800 eligible" },
      { id:"families",    label:"Families",                 desc:"~5,100 eligible" },
    ];
    const segCards = segmentOpts.map(s => `
      <div class="act-segment-card ${act.segment===s.id?"selected":""}" data-act-segment="${s.id}">
        <div class="act-segment-body">
          <div class="act-segment-label">${s.label}</div>
          <div class="act-segment-desc">${s.desc}</div>
        </div>
        <div class="act-segment-check">${icon("check-circle","ph-fill")}</div>
      </div>`).join("");

    const channelToggles = channels.map(ch => {
      const on = act.channels.includes(ch.id);
      return `<div class="act-channel ${on?"on":""}" data-act-channel="${ch.id}">
        ${icon(ch.icon)}
        <span>${ch.label}</span>
        <div class="act-channel-dot ${on?"on":""}"></div>
      </div>`;
    }).join("");

    formContent = `
      <div class="act-section">
        <div class="act-section-title">Target segment</div>
        <div class="act-section-sub">Choose which members will see this deal</div>
        <div class="act-segments">${segCards}</div>
      </div>
      <div class="act-section">
        <div class="act-section-title">Issuer budget cap</div>
        <div class="act-section-sub">Maximum budget your bank will commit to this activation</div>
        <div class="discount-input-wrap">
          <div class="discount-prefix">$</div>
          <input placeholder="e.g. 22000" value="${act.budgetCap}" data-bind-act="budgetCap" />
        </div>
        ${deal.funding === "cofunded" ? `<div style="font-size:12px;color:var(--info);margin-top:6px;display:flex;align-items:center;gap:4px">${icon("info")} Co-funded: merchant covers the remaining portion.</div>` : ""}
      </div>
      <div class="act-section">
        <div class="act-section-title">Publication channels</div>
        <div class="act-section-sub">Select where this deal will be surfaced to your members</div>
        <div class="act-channels">${channelToggles}</div>
      </div>
      <div class="act-section">
        <div class="act-section-title">Publish date &amp; time</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-field">
            <label>Date</label>
            <input class="form-input" placeholder="MM/DD/YYYY" value="${act.publishDate}" data-bind-act="publishDate" />
          </div>
          <div class="form-field">
            <label>Time</label>
            <input class="form-input" placeholder="9:00 AM" value="${act.publishTime}" data-bind-act="publishTime" />
          </div>
        </div>
      </div>
      <div class="act-section">
        <div class="act-section-title">Internal notes</div>
        <div class="act-section-sub">Optional notes visible only to your team</div>
        <textarea class="review-notes-input" placeholder="e.g. Prioritise premium segment push…" data-bind-act="notes">${act.notes}</textarea>
      </div>`;
  } else if (step === 1) {
    const segLabel = { all:"All members", premium:"Premium cardholders", millennials:"Millennials 25–40", families:"Families" };
    formContent = `
      <div class="act-section">
        <div class="act-section-title">Deal preview</div>
        <div class="act-section-sub">This is how the deal will appear to your members in each channel</div>
      </div>
      <div class="act-preview-channels">
        <div class="act-preview-card app">
          <div class="act-preview-channel-label">${icon("device-mobile")} Mobile App</div>
          <div class="act-preview-deal-card">
            <div class="act-deal-badge">NEW OFFER</div>
            <div class="act-deal-merchant">${deal.merchant}</div>
            <div class="act-deal-title">${deal.title}</div>
            <div class="act-deal-value">${deal.discount} cashback</div>
            <div class="act-deal-meta">Valid ${deal.startDate} · ${segLabel[act.segment]}</div>
            <button class="act-deal-cta">Activate offer</button>
          </div>
        </div>
        <div class="act-preview-card email">
          <div class="act-preview-channel-label">${icon("envelope")} Email</div>
          <div class="act-preview-email">
            <div class="act-email-subject">New offer available: ${deal.title}</div>
            <div class="act-email-from">offers@bancobva.com.ar</div>
            <div class="act-email-body">
              <div class="act-email-hero">${deal.merchant}</div>
              <div class="act-email-title">${deal.title}</div>
              <div class="act-email-desc">${deal.description}</div>
              <div class="act-email-cta">View offer →</div>
            </div>
          </div>
        </div>
      </div>
      <div class="act-section" style="margin-top:16px">
        <div class="act-section-title">Activation summary</div>
        <div class="act-summary-grid">
          <div class="act-summary-row"><span>Segment</span><strong>${segLabel[act.segment]}</strong></div>
          <div class="act-summary-row"><span>Budget cap</span><strong>$${Number(act.budgetCap).toLocaleString()}</strong></div>
          <div class="act-summary-row"><span>Channels</span><strong>${act.channels.map(c => channels.find(ch=>ch.id===c)?.label||c).join(", ")}</strong></div>
          <div class="act-summary-row"><span>Publish date</span><strong>${act.publishDate} at ${act.publishTime}</strong></div>
          <div class="act-summary-row"><span>Funding model</span><strong><span class="funding-pill ${deal.funding}">${fundingLabel[deal.funding]}</span></strong></div>
        </div>
      </div>`;
  } else {
    const segLabel = { all:"All members", premium:"Premium cardholders", millennials:"Millennials 25–40", families:"Families" };
    formContent = `
      <div class="act-confirm-hero">
        <div class="act-confirm-icon">${icon("rocket-launch","ph-fill")}</div>
        <div class="act-confirm-title">Ready to publish</div>
        <div class="act-confirm-sub">Review the final details and confirm activation. Once live, your members will see this deal on ${act.publishDate}.</div>
      </div>
      <div class="act-section">
        <div class="act-section-title">Final review</div>
        <div class="act-summary-grid" style="border:1px solid var(--line);border-radius:var(--r-md);padding:4px 0">
          ${[
            ["Deal",        deal.title],
            ["Merchant",    deal.merchant],
            ["Type",        deal.type],
            ["Discount",    deal.discount],
            ["Funding",     `<span class="funding-pill ${deal.funding}">${fundingLabel[deal.funding]}</span>`],
            ["Budget cap",  `$${Number(act.budgetCap).toLocaleString()}`],
            ["Segment",     segLabel[act.segment]],
            ["Channels",    act.channels.map(c => channels.find(ch=>ch.id===c)?.label||c).join(", ")],
            ["Publish",     `${act.publishDate} at ${act.publishTime}`],
          ].map(([k,v]) => `<div class="act-summary-row" style="padding:10px 16px">${icon("dot-outline","" )} <span>${k}</span><strong>${v}</strong></div>`).join("")}
        </div>
      </div>
      ${act.notes ? `<div class="act-section"><div class="review-notes-display"><div class="review-notes-label">${icon("note")} Internal notes</div><div class="review-notes-text">${act.notes}</div></div></div>` : ""}`;
  }

  const footerLeft = step > 0 ? `<button class="btn btn-secondary" data-act-back>← Back</button>` : `<a href="#${S.issuerLibrary}" class="btn btn-secondary">← Library</a>`;
  const footerRight = step < 2
    ? `<button class="btn btn-primary" data-act-next>Continue →</button>`
    : `<button class="btn btn-primary" style="background:var(--success);border-color:var(--success)" data-action="confirm-activation">${icon("rocket-launch")} Confirm activation</button>`;

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <a href="#${S.issuerLibrary}" class="topbar-breadcrumb" style="color:var(--muted)">${icon("caret-left")} Library</a>
        <span style="color:var(--line-strong);margin:0 8px">/</span>
        <span class="topbar-breadcrumb">Activate deal</span>
      </div>
    </div>
    <div class="act-shell">
      <div class="act-header">
        <div style="display:flex;align-items:center;gap:14px">
          <div class="coupon-thumb" style="background:${deal.merchantColor};color:#fff;width:44px;height:44px;border-radius:10px;flex-shrink:0;display:grid;place-items:center;font-size:13px;font-weight:700">${deal.merchantInitials}</div>
          <div>
            <div style="font-size:12px;color:var(--muted)">${deal.merchant}</div>
            <div style="font-size:17px;font-weight:800">${deal.title}</div>
          </div>
        </div>
        <div class="act-stepbar">${stepBar}</div>
      </div>
      <div class="act-body">${formContent}</div>
      <div class="act-footer">${footerLeft}${footerRight}</div>
    </div>`;

  return issuerShell(content, S.issuerLibrary);
}

/* ─── ISSUER ANALYTICS ───────────────────────────────────────────────────── */
function renderIssuerAnalytics() {
  const kpis = [
    { label:"Active deals",     value:"4",      delta:"+1 this month",      icon:"gift",          up:true  },
    { label:"Total redemptions",value:"19,890", delta:"+22% vs last month",  icon:"receipt",       up:true  },
    { label:"Members reached",  value:"14,320", delta:"58% of eligible base",icon:"users",         up:true  },
    { label:"Budget consumed",  value:"$31,450",delta:"63% of $50K issuer cap",icon:"coins",       up:false },
  ];

  const kpiHtml = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon-wrap">${icon(k.icon)}</div>
      <div class="kpi-body">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-delta ${k.up?"up":"down"}">${icon(k.up?"trend-up":"trend-down")} ${k.delta}</div>
      </div>
    </div>`).join("");

  const monthlyBars = [
    {m:"Oct",v:3200},{m:"Nov",v:4800},{m:"Dec",v:6100},
    {m:"Jan",v:5400},{m:"Feb",v:7200},{m:"Mar",v:9890},
  ];
  const maxBar = Math.max(...monthlyBars.map(d=>d.v));
  const barsHtml = monthlyBars.map(d => `
    <div class="bar-col">
      <div class="bar-fill" style="height:${Math.round(d.v/maxBar*100)}%"></div>
      <div class="bar-label">${d.m}</div>
    </div>`).join("");

  const segments = [
    { label:"All members",         pct:42, redemptions:8358, color:"var(--brand)" },
    { label:"Premium cardholders", pct:28, redemptions:5569, color:"var(--info)" },
    { label:"Families",            pct:18, redemptions:3580, color:"var(--success)" },
    { label:"Millennials 25–40",   pct:12, redemptions:2386, color:"var(--warning)" },
  ];
  const segHtml = segments.map(s => `
    <div class="issuer-seg-row">
      <div class="issuer-seg-label">${s.label}</div>
      <div class="issuer-seg-bar-wrap">
        <div class="issuer-seg-bar" style="width:${s.pct}%;background:${s.color}"></div>
      </div>
      <div class="issuer-seg-stats">${s.redemptions.toLocaleString()} · ${s.pct}%</div>
    </div>`).join("");

  const topDeals = ISSUER_LIFECYCLE_DEALS.filter(d=>d.status!=="Expired").map(d => `
    <tr>
      <td>
        <div class="coupon-cell">
          <div class="coupon-thumb" style="background:${d.merchantColor};color:#fff">
            <span style="font-size:11px;font-weight:700">${d.merchantInitials}</span>
          </div>
          <span class="coupon-name">${d.title}</span>
        </div>
      </td>
      <td style="text-align:right;font-weight:600">${d.redemptions.toLocaleString()}</td>
      <td><span class="funding-pill ${d.funding}">${{merchant:"Merchant",cofunded:"Co-funded",issuer:"Issuer"}[d.funding]}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--line)">
            <div style="height:100%;width:${d.consumed}%;border-radius:3px;background:${d.consumed>90?"var(--danger)":d.consumed>70?"var(--warning)":"var(--brand)"}"></div>
          </div>
          <span style="font-size:12px;font-weight:600;min-width:28px">${d.consumed}%</span>
        </div>
      </td>
      <td>${badge(d.status)}</td>
    </tr>`).join("");

  const channels = [
    { name:"Mobile App",  icon:"device-mobile", redemptions:9840, pct:49, ctr:"8.2%" },
    { name:"Email",       icon:"envelope",       redemptions:6300, pct:32, ctr:"4.1%" },
    { name:"Web Portal",  icon:"globe",          redemptions:2900, pct:15, ctr:"2.8%" },
    { name:"SMS",         icon:"chat-text",      redemptions:850,  pct:4,  ctr:"6.5%" },
  ];
  const channelRows = channels.map(c => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:8px">${icon(c.icon)} ${c.name}</div></td>
      <td style="text-align:right;font-weight:600">${c.redemptions.toLocaleString()}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--line)">
            <div style="height:100%;width:${c.pct}%;border-radius:3px;background:var(--brand)"></div>
          </div>
          <span style="font-size:12px;color:var(--muted)">${c.pct}%</span>
        </div>
      </td>
      <td style="font-weight:600;color:var(--success)">${c.ctr}</td>
    </tr>`).join("");

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("chart-bar")} Analytics</div>
      </div>
      <div class="topbar-right">
        <button class="btn btn-secondary">${icon("download-simple")} Export</button>
      </div>
    </div>
    <div class="page-content" style="display:flex;flex-direction:column;gap:20px">
      <div class="page-header" style="margin-bottom:0">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("chart-bar")} Performance</div>
          <div class="page-title">Analytics Overview</div>
        </div>
      </div>

      <div class="kpi-grid">${kpiHtml}</div>

      <div style="display:grid;grid-template-columns:1fr 300px;gap:16px">
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title">${icon("chart-bar")} Monthly redemptions</div>
          </div>
          <div class="bar-chart">${barsHtml}</div>
        </div>
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-title">${icon("funnel")} Segment breakdown</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">${segHtml}</div>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">${icon("gift")} Deal performance</div>
        </div>
        <table class="dash-table">
          <thead><tr><th>Deal</th><th style="text-align:right">Redemptions</th><th>Funding</th><th>Budget used</th><th>Status</th></tr></thead>
          <tbody>${topDeals}</tbody>
        </table>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">${icon("broadcast")} Channel performance</div>
        </div>
        <table class="dash-table">
          <thead><tr><th>Channel</th><th style="text-align:right">Redemptions</th><th>Share</th><th>CTR</th></tr></thead>
          <tbody>${channelRows}</tbody>
        </table>
      </div>
    </div>`;

  return issuerShell(content, S.issuerAnalytics);
}

/* ─── ISSUER LIFECYCLE ───────────────────────────────────────────────────── */
function renderIssuerLifecycle() {
  const deals = [
    ...ISSUER_LIFECYCLE_DEALS,
    ...(state.workflow.issuerActivated
      ? [{ id:"lc-new", title:state.issuer.selectedDealId
            ? (ISSUER_LIBRARY_DEALS.find(d=>d.id===state.issuer.selectedDealId)?.title || "New Activation")
            : "New Activation",
           merchant:"Zappos", merchantColor:"#E07820", merchantInitials:"ZP",
           funding:"cofunded", activatedDate:"Today", status:"Active", redemptions:0, budget:"$22,000", consumed:0 }]
      : []),
  ];

  const statusColor = { Active:"var(--success)", Paused:"var(--warning)", Expired:"var(--muted)" };
  const fundingLabel = { merchant:"Merchant", cofunded:"Co-funded", issuer:"Issuer" };

  const rows = deals.map(d => `
    <tr>
      <td>
        <div class="coupon-cell">
          <div class="coupon-thumb" style="background:${d.merchantColor};color:#fff">
            <span style="font-size:11px;font-weight:700">${d.merchantInitials}</span>
          </div>
          <div>
            <div style="font-weight:600;font-size:13.5px">${d.title}</div>
            <div style="font-size:12px;color:var(--muted)">${d.merchant}</div>
          </div>
        </div>
      </td>
      <td><span class="funding-pill ${d.funding}">${fundingLabel[d.funding]}</span></td>
      <td>${d.activatedDate}</td>
      <td style="font-weight:600">${d.redemptions.toLocaleString()}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;min-width:100px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--line)">
            <div style="height:100%;width:${d.consumed}%;border-radius:3px;background:${d.consumed>90?"var(--danger)":d.consumed>70?"var(--warning)":"var(--brand)"}"></div>
          </div>
          <span style="font-size:12px;font-weight:600;min-width:28px">${d.consumed}%</span>
        </div>
      </td>
      <td>
        <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:${statusColor[d.status]}">
          ${icon(d.status==="Active"?"check-circle":d.status==="Paused"?"pause-circle":"clock")}
          ${d.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          ${d.status === "Active"  ? `<button class="btn-icon" title="Pause" data-lc-action="pause" data-lc-id="${d.id}">${icon("pause")}</button>` : ""}
          ${d.status === "Paused" ? `<button class="btn-icon" title="Resume" data-lc-action="resume" data-lc-id="${d.id}">${icon("play")}</button>` : ""}
          ${d.status !== "Expired" ? `<button class="btn-icon" title="View analytics" data-nav="${S.issuerAnalytics}">${icon("chart-bar")}</button>` : ""}
          <button class="btn-icon" title="More">${icon("dots-three")}</button>
        </div>
      </td>
    </tr>`).join("");

  const statCounts = {
    active:  deals.filter(d=>d.status==="Active").length,
    paused:  deals.filter(d=>d.status==="Paused").length,
    expired: deals.filter(d=>d.status==="Expired").length,
  };

  const content = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-breadcrumb">${icon("arrows-clockwise")} Lifecycle</div>
      </div>
    </div>
    <div class="page-content">
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-eyebrow">${icon("arrows-clockwise")} Management</div>
          <div class="page-title">Deal Lifecycle</div>
        </div>
        <div class="page-header-right">
          <a href="#${S.issuerLibrary}" class="btn btn-primary">${icon("plus")} Activate new deal</a>
        </div>
      </div>
      <p class="intro-text">Manage all deals activated by Banco BVA. Pause or resume deals at any time. Expired deals are archived automatically.</p>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">
        ${[
          { label:"Active",  value:statCounts.active,  color:"var(--success)", icon:"check-circle" },
          { label:"Paused",  value:statCounts.paused,  color:"var(--warning)", icon:"pause-circle" },
          { label:"Expired", value:statCounts.expired, color:"var(--muted)",   icon:"clock" },
        ].map(k => `<div class="net-kpi">
          <div class="net-kpi-icon" style="color:${k.color}">${icon(k.icon)}</div>
          <div><div class="net-kpi-val">${k.value}</div><div class="net-kpi-lab">${k.label} deals</div></div>
        </div>`).join("")}
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Deal</th><th>Funding</th><th>Activated</th>
            <th>Redemptions</th><th>Budget used</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  return issuerShell(content, S.issuerLifecycle);
}

/* ─── EVENTS ─────────────────────────────────────────────────────────────── */
function bindEvents() {
  // data-nav clicks
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });

  // actor cards (index)
  document.querySelectorAll(".actor-card[data-nav]").forEach(el => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  // data-action
  document.querySelectorAll("[data-action]").forEach(el => {
    el.addEventListener("click", () => handleAction(el.dataset.action, el));
  });

  document.querySelectorAll("[data-open-picker]").forEach(el => {
    el.addEventListener("click", () => {
      const field = el.dataset.openPicker;
      const kind = el.dataset.pickerKind;
      if ((field === "benefit.endDate" || field === "benefit.endTime") && state.benefit.withoutEnd) {
        state.benefit.withoutEnd = false;
      }
      if (state.activePicker?.field === field && state.activePicker?.kind === kind) {
        closePicker();
      } else {
        openPicker(field, kind);
      }
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-month]").forEach(el => {
    el.addEventListener("click", () => {
      if (!state.activePicker || state.activePicker.kind !== "date") return;
      const direction = parseInt(el.dataset.direction, 10);
      let monthIndex = state.activePicker.monthIndex + direction;
      let year = state.activePicker.year;
      if (monthIndex < 0) { monthIndex = 11; year -= 1; }
      if (monthIndex > 11) { monthIndex = 0; year += 1; }
      state.activePicker = { ...state.activePicker, monthIndex, year };
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-date]").forEach(el => {
    el.addEventListener("click", () => {
      setByPath(state, el.dataset.pickerDate, formatDateFromInput(el.dataset.pickerValue));
      closePicker();
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-today]").forEach(el => {
    el.addEventListener("click", () => {
      const now = new Date();
      const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      setByPath(state, el.dataset.pickerToday, formatDateFromInput(iso));
      closePicker();
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-clear]").forEach(el => {
    el.addEventListener("click", () => {
      setByPath(state, el.dataset.pickerClear, "");
      closePicker();
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-hour]").forEach(el => {
    el.addEventListener("click", () => {
      if (!state.activePicker || state.activePicker.kind !== "time") return;
      state.activePicker = { ...state.activePicker, hour: parseInt(el.dataset.value, 10) };
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-minute]").forEach(el => {
    el.addEventListener("click", () => {
      if (!state.activePicker || state.activePicker.kind !== "time") return;
      state.activePicker = { ...state.activePicker, minute: parseInt(el.dataset.value, 10) };
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-meridiem]").forEach(el => {
    el.addEventListener("click", () => {
      if (!state.activePicker || state.activePicker.kind !== "time") return;
      state.activePicker = { ...state.activePicker, meridiem: el.dataset.value };
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-save-time]").forEach(el => {
    el.addEventListener("click", () => {
      if (!state.activePicker || state.activePicker.kind !== "time") return;
      const { hour, minute, meridiem } = state.activePicker;
      setByPath(state, el.dataset.pickerSaveTime, `${hour}:${String(minute).padStart(2, "0")} ${meridiem}`);
      closePicker();
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-picker-clear-time]").forEach(el => {
    el.addEventListener("click", () => {
      setByPath(state, el.dataset.pickerClearTime, "");
      closePicker();
      save();
      renderPreservingWizardFormScroll();
    });
  });

  document.querySelectorAll("[data-media-trigger]").forEach(el => {
    el.addEventListener("click", () => {
      const input = document.querySelector(`[data-media-input="${el.dataset.mediaTrigger}"]`);
      input?.click();
    });
  });

  document.querySelectorAll("[data-media-input]").forEach(el => {
    el.addEventListener("change", () => {
      const file = el.files?.[0];
      if (!file) return;
      const slotIndex = parseInt(el.dataset.mediaInput, 10);
      const reader = new FileReader();
      reader.onload = () => {
        const nextAssets = [...(state.benefit.mediaAssets || [])];
        nextAssets[slotIndex] = {
          ...(nextAssets[slotIndex] || {}),
          src: typeof reader.result === "string" ? reader.result : "",
          name: file.name,
        };
        state.benefit.mediaAssets = nextAssets;
        save();
        renderPreservingWizardFormScroll();
      };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll("[data-media-delete]").forEach(el => {
    el.addEventListener("click", () => {
      const slotIndex = parseInt(el.dataset.mediaDelete, 10);
      const nextAssets = [...(state.benefit.mediaAssets || [])];
      const current = nextAssets[slotIndex];
      if (!current) return;
      nextAssets[slotIndex] = {
        ...current,
        src: "",
        name: "",
      };
      state.benefit.mediaAssets = nextAssets;
      save();
      renderPreservingWizardFormScroll();
    });
  });

  // data-bind inputs
  document.querySelectorAll("[data-bind]").forEach(el => {
    el.addEventListener("input", () => {
      const path = el.dataset.bind;
      const keys = path.split(".");
      const last = keys.pop();
      const target = keys.reduce((acc, k) => acc[k], state);
      target[last] = el.value;
      save();
      // live-update preview without full re-render
      updatePreview();
    });
  });

  // benefit type cards
  document.querySelectorAll("[data-benefit-type]").forEach(el => {
    el.addEventListener("click", () => {
      state.benefit.type = el.dataset.benefitType;
      save(); render();
    });
  });

  // toggle switches
  document.querySelectorAll("[data-toggle]").forEach(el => {
    el.addEventListener("click", () => {
      const path = el.dataset.toggle;
      const keys = path.split(".");
      const last = keys.pop();
      const target = keys.reduce((acc, k) => acc[k], state);
      target[last] = !target[last];
      if (path === "benefit.withoutEnd" && target[last]) {
        state.benefit.endDate = "";
        state.benefit.endTime = "";
      }
      save();
      if (state.screen === S.merchantNew) {
        renderPreservingWizardFormScroll();
      } else {
        render();
      }
    });
  });

  // wizard tabs
  document.querySelectorAll("[data-wizard-tab]").forEach(el => {
    el.addEventListener("click", () => {
      state.wizardTab = el.dataset.wizardTab;
      save(); render();
    });
  });

  // wizard next/back
  document.querySelectorAll("[data-wizard-next]").forEach(el => {
    el.addEventListener("click", () => {
      const order = ["basic","validity","media"];
      const idx = order.indexOf(state.wizardTab);
      if (idx < order.length - 1) { state.wizardTab = order[idx + 1]; save(); render(); }
    });
  });
  document.querySelectorAll("[data-wizard-back]").forEach(el => {
    el.addEventListener("click", () => {
      const order = ["basic","validity","media"];
      const idx = order.indexOf(state.wizardTab);
      if (idx > 0) { state.wizardTab = order[idx - 1]; save(); render(); }
    });
  });

  // benefit status filters
  document.querySelectorAll("[data-benefit-status]").forEach(el => {
    el.addEventListener("click", () => {
      state.benefitsStatus = el.dataset.benefitStatus;
      save(); render();
    });
  });

  // partnership status filters
  document.querySelectorAll("[data-partnership-status]").forEach(el => {
    el.addEventListener("click", () => {
      state.partnershipsStatus = el.dataset.partnershipStatus;
      if (state.selectedIssuerId) {
        const stillVisible = DEMO_ISSUERS.some(
          issuer => issuer.id === state.selectedIssuerId && (state.partnershipsStatus === "all" || issuer.status === state.partnershipsStatus)
        );
        if (!stillVisible) state.selectedIssuerId = null;
      }
      save(); render();
    });
  });

  // select benefit row
  document.querySelectorAll("[data-select-benefit]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.selectBenefit;
      state.selectedBenefitId = state.selectedBenefitId === id ? null : id;
      save(); render();
    });
  });

  // funding model cards
  document.querySelectorAll("[data-funding-model]").forEach(el => {
    el.addEventListener("click", () => {
      state.funding.model = el.dataset.fundingModel;
      save();
      renderPreservingWizardFormScroll();
    });
  });

  // co-fund split slider
  document.querySelectorAll("[data-funding-split]").forEach(el => {
    el.addEventListener("input", () => {
      state.funding.merchantPct = parseInt(el.value);
      const labels = el.previousElementSibling;
      if (labels) {
        labels.querySelector("span:first-child").textContent = `Merchant ${el.value}%`;
        labels.querySelector("span:last-child").textContent  = `Issuer ${100 - parseInt(el.value)}%`;
      }
      save();
      updatePreview();
    });
  });

  // funding budget inputs
  document.querySelectorAll("[data-bind-funding]").forEach(el => {
    el.addEventListener("input", () => {
      state.funding[el.dataset.bindFunding] = el.value;
      save();
      updatePreview();
    });
  });

  // select issuer (partnerships)
  document.querySelectorAll("[data-select-issuer]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.selectIssuer;
      state.selectedIssuerId = state.selectedIssuerId === id ? null : id;
      save(); render();
    });
  });

  // network queue filter
  document.querySelectorAll("[data-net-filter]").forEach(el => {
    el.addEventListener("click", () => {
      state.network.queueFilter = el.dataset.netFilter;
      save(); render();
    });
  });

  // select deal from queue table
  document.querySelectorAll("[data-select-deal]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.selectDeal;
      state.network.selectedDealId = state.network.selectedDealId === id ? null : id;
      save(); render();
    });
  });

  // review button → navigate to detail
  document.querySelectorAll("[data-nav-deal]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      state.network.selectedDealId = el.dataset.navDeal;
      save();
      navigate(S.networkDetail);
    });
  });

  // scroll-to section in detail
  document.querySelectorAll("[data-scroll-to]").forEach(el => {
    el.addEventListener("click", () => {
      const target = document.getElementById(el.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // rules tab filter
  document.querySelectorAll("[data-rules-tab]").forEach(el => {
    el.addEventListener("click", () => {
      state.network.rulesTab = el.dataset.rulesTab;
      save(); render();
    });
  });

  // select deal in library (network)
  document.querySelectorAll("[data-select-library-deal]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.selectLibraryDeal;
      state.network.selectedDealId = state.network.selectedDealId === id ? null : id;
      save(); render();
    });
  });

  // issuer library filter
  document.querySelectorAll("[data-issuer-filter]").forEach(el => {
    el.addEventListener("click", () => {
      state.issuer.libraryFilter = el.dataset.issuerFilter;
      save(); render();
    });
  });

  // select deal card in issuer library
  document.querySelectorAll("[data-select-issuer-deal]").forEach(el => {
    el.addEventListener("click", (e) => {
      // don't hijack if clicking the activate button inside
      if (e.target.closest("[data-activate-deal]")) return;
      const id = el.dataset.selectIssuerDeal;
      state.issuer.selectedDealId = state.issuer.selectedDealId === id ? null : id;
      save(); render();
    });
  });

  // activate deal button → go to activation wizard
  document.querySelectorAll("[data-activate-deal]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      state.issuer.selectedDealId = el.dataset.activateDeal;
      state.issuer.activationStep = 0;
      save();
      navigate(S.issuerActivation);
    });
  });

  // activation wizard next/back
  document.querySelectorAll("[data-act-next]").forEach(el => {
    el.addEventListener("click", () => {
      if (state.issuer.activationStep < 2) {
        state.issuer.activationStep++;
        save(); render();
      }
    });
  });
  document.querySelectorAll("[data-act-back]").forEach(el => {
    el.addEventListener("click", () => {
      if (state.issuer.activationStep > 0) {
        state.issuer.activationStep--;
        save(); render();
      }
    });
  });

  // activation segment cards
  document.querySelectorAll("[data-act-segment]").forEach(el => {
    el.addEventListener("click", () => {
      state.issuer.activation.segment = el.dataset.actSegment;
      save(); render();
    });
  });

  // activation channel toggles
  document.querySelectorAll("[data-act-channel]").forEach(el => {
    el.addEventListener("click", () => {
      const ch = el.dataset.actChannel;
      const idx = state.issuer.activation.channels.indexOf(ch);
      if (idx >= 0) {
        if (state.issuer.activation.channels.length > 1) {
          state.issuer.activation.channels.splice(idx, 1);
        }
      } else {
        state.issuer.activation.channels.push(ch);
      }
      save(); render();
    });
  });

  // activation form inputs
  document.querySelectorAll("[data-bind-act]").forEach(el => {
    el.addEventListener("input", () => {
      state.issuer.activation[el.dataset.bindAct] = el.value;
      save();
    });
  });

  // lifecycle actions (pause/resume)
  document.querySelectorAll("[data-lc-action]").forEach(el => {
    el.addEventListener("click", () => {
      // demo: just re-render (no persistent lifecycle state for demo deals)
      render();
    });
  });

  // day toggles in wizard
  document.querySelectorAll("[data-day]").forEach(el => {
    el.addEventListener("click", () => {
      const d = parseInt(el.dataset.day);
      const days = state.benefit.activeDays;
      const idx = days.indexOf(d);
      if (idx >= 0) days.splice(idx, 1); else days.push(d);
      save();
      renderPreservingWizardFormScroll();
    });
  });

  // OTP boxes auto-advance
  for (let i = 0; i < 6; i++) {
    const box = document.getElementById(`otp-${i}`);
    if (!box) continue;
    box.addEventListener("input", () => {
      if (box.value.length === 1 && i < 5) {
        document.getElementById(`otp-${i + 1}`)?.focus();
      }
    });
    box.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !box.value && i > 0) {
        document.getElementById(`otp-${i - 1}`)?.focus();
      }
    });
  }
}

function handleAction(action, el) {
  switch (action) {
    case "send-otp": {
      const email = document.getElementById("reg-email")?.value || "";
      if (email) { state.merchantEmail = email; save(); }
      navigate(S.merchantOtp);
      break;
    }
    case "google-signup":
      navigate(S.merchantOtp);
      break;
    case "verify-otp":
      navigate(S.merchantOnboard);
      break;
    case "complete-onboard":
      state.company.name     = document.getElementById("co-name")?.value    || state.company.name;
      state.company.size     = document.getElementById("co-size")?.value    || state.company.size;
      state.company.industry = document.getElementById("co-industry")?.value|| state.company.industry;
      state.company.city     = document.getElementById("co-city")?.value    || state.company.city;
      state.company.website  = document.getElementById("co-website")?.value || state.company.website;
      state.merchantOnboarded = true;
      save();
      navigate(S.merchantBenefits);
      break;
    case "skip-onboard":
      state.merchantOnboarded = true;
      save();
      navigate(S.merchantBenefits);
      break;
    case "new-benefit":
      state.editingBenefitId = null;
      state.wizardTab = "basic";
      state.benefit = defaultBenefitDraft();
      state.funding = {
        ...state.funding,
        model: "merchant",
        merchantPct: 70,
        totalBudget: "50000",
        perRedemption: "40",
      };
      save();
      navigate(S.merchantNew);
      break;
    case "edit-benefit":
      if (state.selectedBenefitId) {
        loadBenefitIntoWizard(state.selectedBenefitId);
        save();
        navigate(S.merchantNew);
      }
      break;
    case "open-media-editor":
      state.mediaEditor = parseInt(el.dataset.mediaIndex, 10);
      save();
      renderPreservingWizardFormScroll();
      break;
    case "close-media-editor":
      state.mediaEditor = null;
      save();
      renderPreservingWizardFormScroll();
      break;
    case "save-media-editor": {
      const index = state.mediaEditor;
      if (index !== null) {
        const nextAssets = [...(state.benefit.mediaAssets || [])];
        const current = nextAssets[index];
        if (current) {
          nextAssets[index] = {
            ...current,
            title: document.getElementById("media-editor-title")?.value || "",
            alt: document.getElementById("media-editor-alt")?.value || "",
          };
          state.benefit.mediaAssets = nextAssets;
        }
      }
      state.mediaEditor = null;
      save();
      renderPreservingWizardFormScroll();
      break;
    }
    case "close-detail":
      state.selectedBenefitId = null;
      save(); render();
      break;
    case "close-issuer-detail":
      state.selectedIssuerId = null;
      save(); render();
      break;
    case "close-library-deal":
      state.network.selectedDealId = null;
      save(); render();
      break;
    case "open-confirm":
      state.network.confirmModal = { action: el.dataset.decision };
      save(); render();
      break;
    case "close-confirm":
      state.network.confirmModal = null;
      save(); render();
      break;
    case "confirm-decision": {
      const decision = el.dataset.decision;
      state.network.confirmModal = null;
      if (decision === "approve") {
        state.workflow.orchestratorDecision = "approved";
        const b = state.benefits.find(b => b.status === "Pending");
        if (b) b.status = "Approved";
      } else if (decision === "reject") {
        state.workflow.orchestratorDecision = "rejected";
        const b = state.benefits.find(b => b.status === "Pending");
        if (b) b.status = "Rejected";
      } else {
        state.workflow.orchestratorDecision = "changes";
        const b = state.benefits.find(b => b.status === "Pending");
        if (b) b.status = "Changes Requested";
      }
      save(); render();
      break;
    }
    case "close-issuer-lib-deal":
      state.issuer.selectedDealId = null;
      save(); render();
      break;
    case "confirm-activation": {
      const dealId = state.issuer.selectedDealId;
      if (dealId && !state.issuer.activatedDeals.includes(dealId)) {
        state.issuer.activatedDeals.push(dealId);
      }
      state.workflow.issuerActivated = true;
      save();
      navigate(S.issuerLifecycle);
      break;
    }
    case "reset-demo":
      localStorage.removeItem(STORAGE_KEY);
      Object.assign(state, initialState());
      navigate(S.index);
      break;
    case "request-review":
      state.workflow.submitted = true;
      state.selectedBenefitId = saveWizardBenefitToList("Pending");
      state.editingBenefitId = null;
      save();
      alert("Benefit submitted for review! The Network Orchestrator will review it shortly.");
      navigate(S.merchantBenefits);
      break;
    case "save-benefit":
    case "save-draft":
      state.selectedBenefitId = saveWizardBenefitToList(action === "save-benefit" ? "Published" : "Draft");
      state.editingBenefitId = null;
      save();
      navigate(S.merchantBenefits);
      break;
  }
}

function updatePreview() {
  // lightweight preview update without full re-render
  const previewTitle = document.querySelector(".preview-card-title");
  const previewSub   = document.querySelector(".preview-card-sub");
  const previewDiscount = document.querySelector("[data-preview-discount]");
  const previewFunding = document.querySelector("[data-preview-funding]");
  const previewBudget = document.querySelector("[data-preview-budget]");
  const previewProduct = document.querySelector("[data-preview-product]");
  const previewValidity = document.querySelector("[data-preview-validity]");
  const previewDays = document.querySelector("[data-preview-days]");
  const fundingLabels = {
    merchant: "Merchant-funded",
    cofunded: "Co-funded",
    issuer: "Issuer-funded",
  };
  if (previewTitle) previewTitle.textContent = state.benefit.mediaTitle || state.benefit.title || "New benefit";
  if (previewSub)   previewSub.textContent   = state.benefit.description || "$40 cash back reward on purchases + $400";
  if (previewDiscount) previewDiscount.textContent = state.benefit.discountValue ? `${state.benefit.discountValue}% off` : "Not set";
  if (previewFunding) previewFunding.textContent = fundingLabels[state.funding.model] || "Not set";
  if (previewBudget) previewBudget.textContent = state.funding.totalBudget ? `$${Number(state.funding.totalBudget || 0).toLocaleString()}` : "Not set";
  if (previewProduct) {
    previewProduct.textContent = state.benefit.hasProductCode
      ? (state.benefit.productCode || "Product code not set")
      : "All products";
  }
  if (previewValidity) {
    previewValidity.textContent = formatValiditySummary(state.benefit);
  }
  if (previewDays) {
    const dayLabels = ["D","L","M","M","J","V","S"];
    previewDays.innerHTML = dayLabels.map((d, i) =>
      `<span class="day-pill ${state.benefit.activeDays.includes(i) ? "" : "off"}">${d}</span>`
    ).join("");
  }
  const wizardTitleEl = document.querySelector(".wizard-title");
  if (wizardTitleEl) wizardTitleEl.textContent = state.benefit.title || "New benefit";
}

/* ─── BOOT ───────────────────────────────────────────────────────────────── */
render();
