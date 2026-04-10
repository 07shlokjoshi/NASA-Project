/* eslint-disable no-alert */
(() => {
  const API_KEY = "FxdKcgCL4qmGFAXeYAyG4DcO4ABGg2EHZhyBnbay";
  const APOD_BASE = "https://api.nasa.gov/planetary/apod";

  const $ = (sel) => document.querySelector(sel);

  const els = {
    statusPill: $("#statusPill"),
    statusText: $("#statusPill .statusText"),

    refreshBtn: $("#refreshBtn"),
    hdGalleryToggle: $("#hdGalleryToggle"),

    galleryGrid: $("#galleryGrid"),

    todayMeta: $("#todayMeta"),
    todayPreview: $("#todayPreview"),
    todayTitle: $("#todayTitle"),
    openTodayBtn: $("#openTodayBtn"),

    dateForm: $("#dateForm"),
    dateInput: $("#dateInput"),
    hdDateToggle: $("#hdDateToggle"),
    archiveStatus: $("#archiveStatus"),
    lastTarget: $("#lastTarget"),

    dateResult: $("#dateResult"),
    detailPills: $("#detailPills"),
    detailMeta: $("#detailMeta"),
    detailMedia: $("#detailMedia"),
    detailTitle: $("#detailTitle"),
    detailText: $("#detailText"),
    openDateBtn: $("#openDateBtn"),
    nasaLink: $("#nasaLink"),
    shareBtn: $("#shareBtn"),

    modal: $("#modal"),
    modalBackdrop: $("#modal .modalBackdrop"),
    modalClose: $("#modalClose"),
    modalHdToggle: $("#modalHdToggle"),
    modalDownload: $("#modalDownload"),
    modalMedia: $("#modalMedia"),
    modalKicker: $("#modalKicker"),
    modalTitle: $("#modalTitle"),
    modalDate: $("#modalDate"),
    modalType: $("#modalType"),
    modalText: $("#modalText"),
    modalCredit: $("#modalCredit"),
  };

  const state = {
    gallery: [],
    today: null,
    dateEntry: null,
    preferHdGallery: false,
    modalEntry: null,
    modalUseHd: false,
  };

  function clampText(s, max = 160) {
    if (!s) return "";
    const t = String(s).trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1)}…`;
  }

  function setStatus(text) {
    if (!els.statusText) return;
    els.statusText.textContent = text;
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(`${iso}T00:00:00Z`);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    } catch {
      return iso;
    }
  }

  function mediaUrl(entry, preferHd) {
    if (!entry) return null;
    if (entry.media_type === "image") {
      if (preferHd && entry.hdurl) return entry.hdurl;
      return entry.url || entry.hdurl || null;
    }
    return entry.url || null;
  }

  function safeCredit(entry) {
    const c = (entry && entry.copyright) ? String(entry.copyright).trim() : "";
    return c || "NASA / APOD";
  }

  function buildApodUrl(params) {
    const u = new URL(APOD_BASE);
    u.searchParams.set("api_key", API_KEY);
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      u.searchParams.set(k, String(v));
    });
    return u.toString();
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try {
        const j = await res.json();
        if (j && j.error && j.error.message) msg = j.error.message;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }
    return await res.json();
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function renderHero(entry) {
    state.today = entry;
    els.todayMeta.textContent = `${fmtDate(entry.date)} • ${entry.media_type}`;
    els.todayTitle.textContent = entry.title || "Untitled";

    clearNode(els.todayPreview);
    const wrap = document.createElement("div");
    wrap.className = "heroImg";

    if (entry.media_type === "image") {
      const img = document.createElement("img");
      img.alt = entry.title || "APOD image";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = mediaUrl(entry, true) || mediaUrl(entry, false) || "";
      wrap.appendChild(img);
    } else {
      const iframe = document.createElement("iframe");
      iframe.title = entry.title || "APOD video";
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "no-referrer";
      iframe.src = entry.url || "";
      wrap.appendChild(iframe);
    }

    els.todayPreview.appendChild(wrap);
    els.todayPreview.setAttribute("aria-busy", "false");

    els.openTodayBtn.disabled = false;
  }

  function cardEl(entry) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${entry.title || "APOD entry"}`);

    const badgeRow = document.createElement("div");
    badgeRow.className = "badgeRow";

    const b1 = document.createElement("div");
    b1.className = "badge badgeAccent";
    b1.textContent = entry.media_type === "video" ? "VIDEO LINK" : "APOD IMAGE";

    const b2 = document.createElement("div");
    b2.className = "badge";
    b2.textContent = entry.date || "—";

    badgeRow.appendChild(b1);
    badgeRow.appendChild(b2);

    const media = document.createElement("div");
    media.className = "cardMedia";

    if (entry.media_type === "image") {
      const img = document.createElement("img");
      img.alt = entry.title || "APOD image";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = mediaUrl(entry, state.preferHdGallery) || "";
      media.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.style.height = "100%";
      placeholder.style.display = "grid";
      placeholder.style.placeItems = "center";
      placeholder.style.color = "rgba(244,248,255,0.76)";
      placeholder.style.fontFamily = "var(--mono)";
      placeholder.style.letterSpacing = "0.08em";
      placeholder.style.textTransform = "uppercase";
      placeholder.textContent = "Video • Click to open";
      media.appendChild(placeholder);
    }

    const body = document.createElement("div");
    body.className = "cardBody";

    const h = document.createElement("h3");
    h.className = "cardTitle";
    h.textContent = entry.title || "Untitled";

    const p = document.createElement("p");
    p.className = "cardText";
    p.textContent = clampText(entry.explanation, 190);

    body.appendChild(h);
    body.appendChild(p);

    card.appendChild(media);
    card.appendChild(badgeRow);
    card.appendChild(body);

    const open = () => openModal(entry, state.preferHdGallery);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    return card;
  }

  function renderGallery(entries) {
    state.gallery = entries.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    clearNode(els.galleryGrid);
    state.gallery.forEach((e) => els.galleryGrid.appendChild(cardEl(e)));
    els.galleryGrid.setAttribute("aria-busy", "false");
  }

  function setLinkDisabled(a, disabled) {
    if (!a) return;
    if (disabled) {
      a.setAttribute("aria-disabled", "true");
      a.href = "#";
      a.tabIndex = -1;
    } else {
      a.removeAttribute("aria-disabled");
      a.tabIndex = 0;
    }
  }

  function renderDateResult(entry, useHd) {
    state.dateEntry = entry;

    els.archiveStatus.textContent = "Linked";
    els.lastTarget.textContent = entry.date || "—";
    els.detailMeta.textContent = `Observation date ${fmtDate(entry.date)}`;

    clearNode(els.detailPills);
    const pillA = document.createElement("span");
    pillA.className = "pill accent";
    pillA.textContent = entry.media_type === "video" ? "DEEP LINK" : "IMAGE";
    const pillB = document.createElement("span");
    pillB.className = "pill";
    pillB.textContent = (entry.service_version || "APOD").toUpperCase();
    els.detailPills.appendChild(pillA);
    els.detailPills.appendChild(pillB);

    els.detailTitle.textContent = entry.title || "Untitled";
    els.detailText.textContent = entry.explanation || "—";

    clearNode(els.detailMedia);
    if (entry.media_type === "image") {
      const img = document.createElement("img");
      img.alt = entry.title || "APOD image";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = mediaUrl(entry, useHd) || "";
      els.detailMedia.appendChild(img);
    } else {
      const iframe = document.createElement("iframe");
      iframe.title = entry.title || "APOD video";
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "no-referrer";
      iframe.src = entry.url || "";
      els.detailMedia.appendChild(iframe);
    }

    els.openDateBtn.disabled = false;
    els.shareBtn.disabled = false;
    setLinkDisabled(els.nasaLink, false);
    els.nasaLink.href = entry.url || "#";
  }

  function modalSetDownload(url, enabled) {
    if (!els.modalDownload) return;
    if (!enabled || !url) {
      els.modalDownload.setAttribute("aria-disabled", "true");
      els.modalDownload.href = "#";
      els.modalDownload.removeAttribute("download");
      return;
    }
    els.modalDownload.removeAttribute("aria-disabled");
    els.modalDownload.href = url;
  }

  function openModal(entry, preferHd) {
    state.modalEntry = entry;
    state.modalUseHd = !!preferHd;

    els.modalHdToggle.checked = state.modalUseHd;
    els.modalHdToggle.disabled = entry.media_type !== "image" || (!entry.hdurl && !entry.url);

    els.modalKicker.textContent = entry.media_type === "video" ? "Deep link" : "Deep space";
    els.modalTitle.textContent = entry.title || "Untitled";
    els.modalDate.textContent = fmtDate(entry.date);
    els.modalType.textContent = entry.media_type || "—";
    els.modalText.textContent = entry.explanation || "—";
    els.modalCredit.textContent = `Image source & credits: ${safeCredit(entry)}`;

    clearNode(els.modalMedia);
    els.modalMedia.setAttribute("aria-busy", "true");

    if (entry.media_type === "image") {
      const img = document.createElement("img");
      img.alt = entry.title || "APOD image";
      img.loading = "eager";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = mediaUrl(entry, state.modalUseHd) || "";
      img.addEventListener("load", () => els.modalMedia.setAttribute("aria-busy", "false"));
      img.addEventListener("error", () => els.modalMedia.setAttribute("aria-busy", "false"));
      els.modalMedia.appendChild(img);

      modalSetDownload(img.src, true);
    } else {
      const iframe = document.createElement("iframe");
      iframe.title = entry.title || "APOD video";
      iframe.loading = "eager";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "no-referrer";
      iframe.src = entry.url || "";
      iframe.addEventListener("load", () => els.modalMedia.setAttribute("aria-busy", "false"));
      els.modalMedia.appendChild(iframe);

      modalSetDownload(entry.url, !!entry.url);
    }

    els.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    els.modalClose.focus();
  }

  function closeModal() {
    els.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.modalEntry = null;
    clearNode(els.modalMedia);
  }

  function updateModalHd(useHd) {
    const entry = state.modalEntry;
    if (!entry || entry.media_type !== "image") return;
    state.modalUseHd = !!useHd;
    const img = els.modalMedia.querySelector("img");
    if (!img) return;
    img.src = mediaUrl(entry, state.modalUseHd) || img.src;
    modalSetDownload(img.src, true);
  }

  async function shareCurrent(entry) {
    const url = entry && (entry.hdurl || entry.url);
    if (!url) return;

    const payload = {
      title: entry.title || "NASA APOD",
      text: `NASA APOD • ${entry.date || ""}`.trim(),
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied to clipboard");
    } catch {
      alert(url);
    }
  }

  function setLoadingGallery() {
    els.galleryGrid.setAttribute("aria-busy", "true");
    els.galleryGrid.innerHTML = "";
    for (let i = 0; i < 9; i += 1) {
      const s = document.createElement("div");
      s.className = "card card--skeleton";
      s.innerHTML =
        '<div class="skeleton media"></div><div class="skeleton line"></div><div class="skeleton line short"></div>';
      els.galleryGrid.appendChild(s);
    }
  }

  async function loadGallery() {
    setStatus("Retrieving gallery");
    setLoadingGallery();
    const url = buildApodUrl({ count: 10, thumbs: true });
    const data = await fetchJson(url);
    const entries = Array.isArray(data) ? data : [data];
    renderGallery(entries);
    setStatus("Telemetry active");
  }

  async function loadToday() {
    const url = buildApodUrl({ thumbs: true });
    const entry = await fetchJson(url);
    renderHero(entry);
  }

  async function loadByDate(dateIso, useHd) {
    els.archiveStatus.textContent = "Querying";
    setStatus("Targeting coordinates");
    els.dateResult.setAttribute("aria-busy", "true");
    const url = buildApodUrl({ date: dateIso, thumbs: true });
    const entry = await fetchJson(url);
    renderDateResult(entry, useHd);
    els.dateResult.setAttribute("aria-busy", "false");
    setStatus("Target acquired");
  }

  function initDateBounds() {
    const min = "1995-06-16";
    const today = new Date();
    const max = today.toISOString().slice(0, 10);
    els.dateInput.min = min;
    els.dateInput.max = max;

    const saved = localStorage.getItem("nme:lastDate");
    if (saved) els.dateInput.value = saved;
  }

  function wireEvents() {
    els.refreshBtn.addEventListener("click", async () => {
      try {
        await loadGallery();
      } catch (e) {
        setStatus("Telemetry error");
        els.galleryGrid.setAttribute("aria-busy", "false");
        els.galleryGrid.innerHTML =
          '<div class="panel" style="grid-column: span 12;"><div style="font-weight:750;">Gallery failed to load</div><div style="margin-top:8px;color:rgba(244,248,255,0.66);line-height:1.6;">' +
          `${String(e.message || e)}` +
          "</div></div>";
      }
    });

    els.hdGalleryToggle.addEventListener("change", () => {
      state.preferHdGallery = els.hdGalleryToggle.checked;
      if (!state.gallery.length) return;
      // Re-render quickly to update thumbnail URLs
      renderGallery(state.gallery);
    });

    els.openTodayBtn.addEventListener("click", () => {
      if (!state.today) return;
      openModal(state.today, true);
    });

    els.dateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dateIso = els.dateInput.value;
      if (!dateIso) return;
      const useHd = !!els.hdDateToggle.checked;
      localStorage.setItem("nme:lastDate", dateIso);
      try {
        await loadByDate(dateIso, useHd);
      } catch (err) {
        els.archiveStatus.textContent = "Not found";
        els.dateResult.setAttribute("aria-busy", "false");
        setStatus("No archive match");

        clearNode(els.detailPills);
        els.detailMeta.textContent = `Observation date ${fmtDate(dateIso)}`;
        clearNode(els.detailMedia);
        els.detailMedia.innerHTML =
          '<div class="emptyState"><div><div class="emptyTitle">No archived entry</div><div class="emptySub">This date may not have an APOD entry. Try a nearby date.</div></div></div>';
        els.detailTitle.textContent = "Target not found";
        els.detailText.textContent = String(err.message || err);
        els.openDateBtn.disabled = true;
        els.shareBtn.disabled = true;
        setLinkDisabled(els.nasaLink, true);
      }
    });

    els.openDateBtn.addEventListener("click", () => {
      if (!state.dateEntry) return;
      openModal(state.dateEntry, !!els.hdDateToggle.checked);
    });

    els.shareBtn.addEventListener("click", async () => {
      if (!state.dateEntry) return;
      await shareCurrent(state.dateEntry);
    });

    els.modalClose.addEventListener("click", closeModal);
    els.modalBackdrop.addEventListener("click", (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.modal.getAttribute("aria-hidden") === "false") closeModal();
    });

    els.modalHdToggle.addEventListener("change", () => updateModalHd(els.modalHdToggle.checked));

    // Trap focus lightly by keeping Tab within modal controls (simple approach).
    els.modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (els.modal.getAttribute("aria-hidden") === "true") return;
      const focusables = els.modal.querySelectorAll(
        'button, [href]:not([aria-disabled="true"]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  async function boot() {
    initDateBounds();
    wireEvents();

    try {
      setStatus("Initializing");
      await Promise.all([loadToday(), loadGallery()]);
      setStatus("Telemetry active");
    } catch (e) {
      setStatus("Telemetry error");
      els.galleryGrid.setAttribute("aria-busy", "false");
      els.todayMeta.textContent = "Unavailable";
      els.todayTitle.textContent = "API error";
      els.openTodayBtn.disabled = true;
    }
  }

  boot();
})();

