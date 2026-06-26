/* ============================================================
   NEWPORT CHESS OUTREACH — SITE SCRIPT
   Small, dependency-free modules. Each `init*`/`render*` function
   checks for its own markup before running, so this one file is
   safely shared across every page.
   ============================================================ */

const ICONS = {
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 11.4 12.6 3.4A2 2 0 0 0 11.2 3H4a1 1 0 0 0-1 1v7.2a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8Z"/><circle cx="8" cy="8" r="1.5"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initAccordion();
  initCounters();
  renderAnnouncements();
  renderUpcomingEvents();
  renderStats();
  renderEventsPage();
  renderEventDetail();
  renderBoard();
  renderValues();
  renderFaqs();
  initWizard();
  initScholarshipForm();
  initForms();
  initDonationForm();
  initFooterYear();
});

/* ---- Navigation ------------------------------------------------ */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href").split("#")[0];
    if (href === path || (href === "index.html" && path === "")) {
      a.classList.add("active");
    }
  });
}

/* ---- Scroll reveal ------------------------------------------------ */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
}

/* ---- Accordion (re-runnable so dynamically rendered FAQs work) --- */
function initAccordion() {
  document.querySelectorAll(".accordion-trigger").forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
    });
  });
}

/* ---- Animated stat counters --------------------------------------- */
function initCounters() {
  const nums = document.querySelectorAll(".stat-num[data-target]");
  if (!nums.length || !("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1100;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(el => obs.observe(el));
}

function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---- Homepage: impact stats ---------------------------------------- */
function renderStats() {
  const grid = document.getElementById("stats-grid");
  if (!grid || typeof SITE_DATA === "undefined") return;
  grid.innerHTML = SITE_DATA.stats.map(s => `
    <div class="stat">
      <div class="stat-num" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");
  initCounters();
}

/* ---- Homepage: announcements --------------------------------------- */
function renderAnnouncements() {
  const grid = document.getElementById("announcements-grid");
  if (!grid || typeof SITE_DATA === "undefined") return;
  const badgeClass = { "Upcoming Events": "badge-red", "Tournament Results": "badge-gold", "Community Updates": "badge-ink", "Fundraising News": "badge-red" };
  grid.innerHTML = SITE_DATA.announcements.map(a => `
    <article class="card reveal">
      <div class="card-body">
        <span class="badge ${badgeClass[a.category] || "badge-ink"}">${a.category}</span>
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
        <div class="card-footer">
          <span class="card-meta"><span>${ICONS.calendar}</span>${a.date}</span>
          <a class="btn-ghost" href="${a.link}">Read more ${ICONS.arrow}</a>
        </div>
      </div>
    </article>
  `).join("");
  initReveal();
}

/* ---- Homepage: upcoming events (first 3) ---------------------------- */
function renderUpcomingEvents() {
  const grid = document.getElementById("upcoming-events-grid");
  if (!grid || typeof SITE_DATA === "undefined") return;
  grid.innerHTML = SITE_DATA.events.slice(0, 3).map(eventCardHTML).join("");
  initReveal();
}

function eventCardHTML(e) {
  return `
    <article class="card reveal">
      <div class="card-media placeholder ratio-16-9">
        ${placeholderIcon()}
        <span>Event Photo</span>
        <small>Replace with image</small>
      </div>
      <div class="card-body">
        <span class="badge badge-red">${e.category}</span>
        <h3>${e.title}</h3>
        <p>${e.short}</p>
        <div class="card-meta">
          <span>${ICONS.calendar} ${e.date}</span>
          <span>${ICONS.pin} ${e.location}</span>
        </div>
        <div class="card-footer" style="flex-wrap:wrap;gap:0.6rem;">
          <span class="card-meta"><span>${ICONS.tag}</span>${e.cost}</span>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <a class="btn btn-outline on-light btn-sm" href="event-detail.html?event=${e.slug}">View Details</a>
            <a class="btn btn-primary btn-sm" href="register.html?event=${e.slug}">Register</a>
          </div>
        </div>
      </div>
    </article>`;
}

function placeholderIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`;
}

/* ---- Events & Camps page: full grid with filters --------------------- */
function renderEventsPage() {
  const grid = document.getElementById("events-grid");
  const bar = document.getElementById("filter-bar");
  if (!grid || typeof SITE_DATA === "undefined") return;

  function draw(filter) {
    const list = filter === "All" ? SITE_DATA.events : SITE_DATA.events.filter(e => e.category === filter);
    grid.innerHTML = list.length ? list.map(eventCardHTML).join("") :
      `<p>No events in this category right now — check back soon.</p>`;
    initReveal();
  }

  if (bar) {
    bar.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        bar.querySelectorAll(".filter-pill").forEach(p => p.setAttribute("aria-pressed", "false"));
        pill.setAttribute("aria-pressed", "true");
        draw(pill.dataset.filter);
      });
    });
  }
  draw("All");
}

/* ---- Event detail page ----------------------------------------------- */
function renderEventDetail() {
  const root = document.getElementById("event-detail");
  if (!root || typeof SITE_DATA === "undefined") return;
  const params = new URLSearchParams(location.search);
  const slug = params.get("event");
  const event = SITE_DATA.events.find(e => e.slug === slug) || SITE_DATA.events[0];
  document.title = `${event.title} — Newport Chess Outreach`;

  document.getElementById("ed-category").textContent = event.category;
  document.getElementById("ed-title").textContent = event.title;
  document.getElementById("ed-description").textContent = event.description;
  document.getElementById("ed-date").innerHTML = `${ICONS.calendar} ${event.date}`;
  document.getElementById("ed-time").innerHTML = `${ICONS.clock} ${event.time}`;
  document.getElementById("ed-location").innerHTML = `${ICONS.pin} ${event.location}`;
  document.getElementById("ed-age").innerHTML = `${ICONS.tag} ${event.ageRange}`;
  document.getElementById("ed-cost").textContent = event.cost;
  document.querySelectorAll(".ed-register").forEach(a => a.href = `register.html?event=${event.slug}`);

  document.getElementById("ed-schedule").innerHTML = event.schedule.map(s => `
    <tr><td>${s.time}</td><td>${s.activity}</td></tr>
  `).join("");

  document.getElementById("ed-materials").innerHTML = event.materials.map(m => `<li>${m}</li>`).join("");
  document.getElementById("ed-refund").textContent = event.refundPolicy;

  document.getElementById("ed-faqs").innerHTML = event.faqs.map((f, i) => `
    <div class="accordion-item">
      <button class="accordion-trigger" aria-expanded="false" aria-controls="ed-faq-${i}">${f.q} ${ICONS.chevron}</button>
      <div class="accordion-panel" id="ed-faq-${i}"><div class="accordion-panel-inner">${f.a}</div></div>
    </div>
  `).join("");
  initAccordion();
}

/* ---- About page: board & values --------------------------------------- */
function renderBoard() {
  const grid = document.getElementById("board-grid");
  if (!grid || typeof SITE_DATA === "undefined") return;
  grid.innerHTML = SITE_DATA.board.map(m => `
    <div class="card reveal">
      <div class="card-media placeholder ratio-1-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        <span>Headshot</span>
      </div>
      <div class="card-body">
        <h3>${m.name}</h3>
        <span class="badge badge-red">${m.role}</span>
        <p>${m.bio}</p>
        <a class="btn-ghost btn-sm" href="${m.linkedin}" aria-label="${m.name} on LinkedIn">View LinkedIn ${ICONS.arrow}</a>
      </div>
    </div>
  `).join("");
  initReveal();
}

function renderValues() {
  const grid = document.getElementById("values-grid");
  if (!grid || typeof SITE_DATA === "undefined") return;
  grid.innerHTML = SITE_DATA.values.map(v => `
    <div class="value-card reveal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 4v6c0 5-3.6 8.4-8 10-4.4-1.6-8-5-8-10V6l8-4Z"/></svg>
      <h4>${v.title}</h4>
      <p>${v.text}</p>
    </div>
  `).join("");
  initReveal();
}

/* ---- Contact page: FAQ preview ----------------------------------------- */
function renderFaqs() {
  const list = document.getElementById("faq-list");
  if (!list || typeof SITE_DATA === "undefined") return;
  list.innerHTML = SITE_DATA.faqs.map((f, i) => `
    <div class="accordion-item">
      <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-${i}">${f.q} ${ICONS.chevron}</button>
      <div class="accordion-panel" id="faq-${i}"><div class="accordion-panel-inner">${f.a}</div></div>
    </div>
  `).join("");
  initAccordion();
}

/* ---- Scholarship application: dropdown + submission --------------------- */
function initScholarshipForm() {
  const select = document.getElementById("scholarshipProgram");
  if (select && typeof SITE_DATA !== "undefined") {
    // Only events that actually charge a fee need a scholarship.
    SITE_DATA.events
      .filter(e => (e.costCents || 0) > 0)
      .forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.slug;
        opt.textContent = `${e.title} — ${e.date}`;
        select.appendChild(opt);
      });
  }

  const form = document.getElementById("scholarship-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("scholarship-submit");
    const errorEl = document.getElementById("scholarship-error");
    if (errorEl) errorEl.hidden = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    // Checkbox groups (publicAssistance, raceEthnicity) share a name, so
    // collect repeated keys into arrays rather than overwriting them.
    const payload = {};
    new FormData(form).forEach((value, key) => {
      if (payload[key] === undefined) {
        payload[key] = value;
      } else if (Array.isArray(payload[key])) {
        payload[key].push(value);
      } else {
        payload[key] = [payload[key], value];
      }
    });

    try {
      const res = await fetch("/.netlify/functions/submit-scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (res.ok && result.ok) {
        window.location.href = "scholarship-success.html";
      } else {
        throw new Error(result.error || "Something went wrong submitting your application.");
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent =
          "We couldn't submit your application (" + err.message + "). Please check your connection and try again, or contact us directly.";
        errorEl.hidden = false;
        errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

/* ---- Registration wizard ------------------------------------------------ */
function initWizard() {
  const wizard = document.querySelector(".wizard");
  if (!wizard) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("event");
  const event = (typeof SITE_DATA !== "undefined" && SITE_DATA.events.find(e => e.slug === slug)) || (typeof SITE_DATA !== "undefined" ? SITE_DATA.events[0] : null);
  // Only camps collect a parent/guardian, an emergency contact, and signed
  // waivers. Every other event type (tournaments, workshops, community
  // outreach) goes straight from participant info to payment. If the event
  // can't be determined for some reason, default to the fuller camp flow
  // rather than silently skip information that might be needed.
  const isCamp = event ? event.category === "Camps" : true;

  if (event) {
    document.querySelectorAll(".reg-event-name").forEach(el => el.textContent = event.title);
    document.querySelectorAll(".reg-event-cost").forEach(el => el.textContent = event.cost);
    document.querySelectorAll(".reg-event-date").forEach(el => el.textContent = event.date);
  }

  if (!isCamp) {
    // Hide the camp-only steps (Guardian, Emergency, Waivers) and their
    // progress dots, and disable their fields so they're skipped during
    // validation and excluded from the submitted form data entirely.
    wizard.querySelectorAll('[data-camp-only="true"]').forEach(el => {
      el.hidden = true;
      el.querySelectorAll("input, select, textarea").forEach(f => {
        f.disabled = true;
        f.required = false;
      });
    });
    // Camp-specific fields inside the Participant step (grade/school)
    // get the same treatment.
    wizard.querySelectorAll('[data-camp-field="true"]').forEach(el => {
      el.hidden = true;
      el.querySelectorAll("input, select, textarea").forEach(f => {
        f.disabled = true;
        f.required = false;
      });
    });
    // With no guardian step, the participant becomes the point of
    // contact — reveal an email/phone row on the Participant step.
    wizard.querySelectorAll('[data-noncamp-field="true"]').forEach(el => {
      el.hidden = false;
      el.querySelectorAll("input, select, textarea").forEach(f => {
        f.disabled = false;
        f.required = true;
      });
    });
    const legend = wizard.querySelector("#participant-legend");
    if (legend) legend.textContent = "Participant Information";
  }

  // Build the active list of panels/steps from whatever's left visible,
  // so indices stay in sync whether or not camp-only steps were hidden.
  const panels = Array.from(wizard.querySelectorAll(".wizard-panel")).filter(p => !p.hidden);
  const steps = Array.from(wizard.querySelectorAll(".wizard-step")).filter(s => !s.hidden);
  steps.forEach((s, i) => {
    const dot = s.querySelector(".dot");
    if (dot) dot.textContent = i + 1;
  });
  let current = 0;

  function show(index, scrollTo = true) {
    panels.forEach((p, i) => p.classList.toggle("active", i === index));
    steps.forEach((s, i) => {
      s.classList.toggle("active", i === index);
      s.classList.toggle("done", i < index);
    });
    if (scrollTo) wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function panelIsValid(panel) {
    const fields = panel.querySelectorAll("input, select, textarea");
    for (const f of fields) {
      if (f.disabled) continue;
      if (!f.checkValidity()) { f.reportValidity(); return false; }
    }
    return true;
  }

  wizard.querySelectorAll("[data-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!panelIsValid(panels[current])) return;
      if (current < panels.length - 1) {
        current++;
        show(current);
      }
    });
  });
  wizard.querySelectorAll("[data-prev]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (current > 0) { current--; show(current); }
    });
  });

  const form = document.getElementById("registration-form");
  if (form) {
    // An Enter keypress in any text field would otherwise submit the
    // whole multi-step form early — only allow it on the final step.
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && current < panels.length - 1) {
        e.preventDefault();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const finalPanel = panels[panels.length - 1];
      if (!panelIsValid(finalPanel)) {
        return;
      }

      const submitBtn = form.querySelector("button[type=submit]");
      const errorEl = document.getElementById("registration-error");
      if (errorEl) errorEl.hidden = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing…";

      const payload = {};
      // Disabled fields (camp-only steps, on a non-camp registration)
      // are automatically omitted from FormData — nothing else to do.
      new FormData(form).forEach((value, key) => { payload[key] = value; });
      // Checkboxes are omitted from FormData when unchecked — record
      // them explicitly, but only for camps, where the waiver fields
      // actually exist on the page and are enabled.
      if (isCamp) {
        payload.waiverLiability = form.waiverLiability.checked;
        payload.waiverPhoto = form.waiverPhoto.checked;
        payload.waiverMedical = form.waiverMedical.checked;
        payload.waiverTerms = form.waiverTerms.checked;
      }
      payload.eventSlug = event ? event.slug : "";
      payload.eventTitle = event ? event.title : "";
      payload.eventCategory = event ? event.category : "";
      payload.amountCents = event ? (event.costCents || 0) : 0;

      try {
        const res = await fetch("/.netlify/functions/submit-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (res.ok && result.url) {
          window.location.href = result.url;
        } else {
          throw new Error(result.error || "Something went wrong submitting your registration.");
        }
      } catch (err) {
        if (errorEl) {
          errorEl.textContent =
            "We couldn't submit your registration (" + err.message + "). Please check your connection and try again, or contact us directly.";
          errorEl.hidden = false;
          errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  show(0, false);
}

/* ---- Newsletter & contact forms (front-end only placeholders) ------------ */
function initForms() {
  document.querySelectorAll("form[data-static-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-success");
      if (note) {
        note.hidden = false;
        form.reset();
      }
    });
  });
}

/* ---- Donations: amount picker + Stripe Checkout -------------------------- */
function initDonationForm() {
  const wrap = document.getElementById("donation-amounts");
  const submitBtn = document.getElementById("donate-submit");
  if (!wrap || !submitBtn) return;

  const customInput = document.getElementById("donationCustomAmount");
  const errorEl = document.getElementById("donate-error");
  let selectedCents = 5000;

  wrap.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filter-pill").forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      selectedCents = parseInt(btn.dataset.amount, 10);
      if (customInput) customInput.value = "";
    });
  });

  if (customInput) {
    customInput.addEventListener("input", () => {
      wrap.querySelectorAll(".filter-pill").forEach(b => b.setAttribute("aria-pressed", "false"));
      selectedCents = Math.round(parseFloat(customInput.value || "0") * 100);
    });
  }

  submitBtn.addEventListener("click", async () => {
    const freqInput = document.querySelector("input[name=donateFrequency]:checked");
    const recurring = freqInput ? freqInput.value === "monthly" : false;

    if (!selectedCents || selectedCents < 100) {
      if (errorEl) {
        errorEl.textContent = "Please choose or enter a donation amount of at least $1.";
        errorEl.hidden = false;
      }
      return;
    }
    if (errorEl) errorEl.hidden = true;

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Redirecting to secure checkout…";

    try {
      const res = await fetch("/.netlify/functions/create-donation-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: selectedCents, recurring })
      });
      const result = await res.json();
      if (res.ok && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || "Something went wrong.");
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = "We couldn't start checkout (" + err.message + "). Please try again or contact us directly.";
        errorEl.hidden = false;
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
