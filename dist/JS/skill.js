/* ── SCROLL TO TOP ON REFRESH ── */
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── DYNAMIC EXPERIENCE TENURE CALCULATION ── */
function calculateDynamicExperience() {
  const startDate = new Date('2025-06-01'); // Career start at Mytek Innovations in June 2025
  const now = new Date();
  let totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  if (now.getDate() >= startDate.getDate()) {
    totalMonths += 1;
  }
  totalMonths = Math.max(1, totalMonths);

  if (totalMonths < 12) {
    return `${totalMonths} months`;
  }
  const years = (totalMonths / 12).toFixed(1);
  const wholeYears = Math.floor(totalMonths / 12);
  const remainder = totalMonths % 12;
  if (remainder === 0) {
    return `${wholeYears}+ year${wholeYears > 1 ? 's' : ''}`;
  }
  return `${years}+ years`;
}

const dynamicExpTenure = calculateDynamicExperience();

/* ── SCROLL-DRIVEN HERO ROLE & CODE EDITOR ── */
const codeLines = [
  { text: '// developer.js — Pranav Bandagle', cls: 'c-comment' },
  { text: 'import { passion, coffee } from "life";', cls: 'c-plain', parts: [
    {t:'import ',c:'c-keyword'},{t:'{ passion, coffee }',c:'c-plain'},{t:' from ',c:'c-keyword'},{t:'"life"',c:'c-string'},{t:';',c:'c-plain'}
  ]},
  { text: '', cls: 'c-plain' },
  { text: 'const developer = {', cls: 'c-plain', parts: [
    {t:'const ',c:'c-keyword'},{t:'developer',c:'c-fn'},{t:' = {',c:'c-plain'}
  ]},
  { text: '  name:       "Pranav Bandagle",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'name',c:'c-key'},{t:':       ',c:'c-plain'},{t:'"Pranav Bandagle"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: '  role:       "MERN Stack Developer",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'role',c:'c-key'},{t:':       ',c:'c-plain'},{t:'"MERN Stack Developer"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: '  company:    "Mytek Innovations",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'company',c:'c-key'},{t:':    ',c:'c-plain'},{t:'"Mytek Innovations"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: `  experience: "${dynamicExpTenure}",`, cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'experience',c:'c-key'},{t:': ',c:'c-plain'},{t:`"${dynamicExpTenure}"`,c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: '  status:     "open to opportunities",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'status',c:'c-key'},{t:':     ',c:'c-plain'},{t:'"open to opportunities"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: '};', cls: 'c-plain' },
  { text: '', cls: 'c-plain' },
  { text: 'export default developer;', cls: 'c-plain', parts: [
    {t:'export ',c:'c-keyword'},{t:'default ',c:'c-keyword'},{t:'developer',c:'c-fn'},{t:';',c:'c-plain'}
  ]},
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildLineHTML(line) {
  if (line.parts) {
    return line.parts.map(p => `<span class="${p.c}">${escapeHtml(p.t)}</span>`).join('');
  }
  return `<span class="${line.cls}">${escapeHtml(line.text)}</span>`;
}

function renderPartialLine(line, charLimit) {
  if (charLimit <= 0) return '';
  if (!line.parts) {
    const raw = line.text.substring(0, charLimit);
    return `<span class="${line.cls}">${escapeHtml(raw)}</span>`;
  }
  let result = '';
  let charsLeft = charLimit;
  for (const part of line.parts) {
    if (charsLeft <= 0) break;
    const take = Math.min(part.t.length, charsLeft);
    result += `<span class="${part.c}">${escapeHtml(part.t.substring(0, take))}</span>`;
    charsLeft -= take;
  }
  return result;
}

// Character offsets calculation for smooth character-by-character typing
let totalCodeChars = 0;
let codeLineOffsets = [];
function recomputeCodeOffsets() {
  totalCodeChars = 0;
  codeLineOffsets = codeLines.map(line => {
    const len = Math.max(1, line.text.length + 1); // +1 for newline pause
    const start = totalCodeChars;
    totalCodeChars += len;
    return { start, end: totalCodeChars, len };
  });
}
recomputeCodeOffsets();

// Smooth code editor typing animation engine
let currentTypedChars = 0;
let targetTypedChars = 0;
let isEditorAnimating = false;

function renderEditorAt(chars) {
  const codeOutput = document.getElementById('codeOutput');
  const lineNums = document.getElementById('lineNums');
  if (!codeOutput || !lineNums) return;

  const clamped = Math.max(0, Math.min(totalCodeChars, chars));
  const renderedLines = [];

  for (let i = 0; i < codeLines.length; i++) {
    const meta = codeLineOffsets[i];
    if (clamped >= meta.end) {
      // Completed line with full syntax highlighting
      renderedLines.push(buildLineHTML(codeLines[i]));
    } else if (clamped > meta.start) {
      // Actively typing line character by character
      const charsInLine = Math.floor(clamped - meta.start);
      renderedLines.push(renderPartialLine(codeLines[i], charsInLine));
      break;
    } else {
      break;
    }
  }

  if (renderedLines.length === 0) {
    renderedLines.push(renderPartialLine(codeLines[0], Math.max(1, clamped)));
  }

  codeOutput.innerHTML = renderedLines.join('\n');
  const count = renderedLines.length;
  lineNums.innerHTML = Array.from({ length: count }, (_, i) => `<span>${i + 1}</span>`).join('');
}

function animateCodeEditor() {
  const diff = targetTypedChars - currentTypedChars;
  if (Math.abs(diff) > 0.15) {
    currentTypedChars += diff * 0.22; // smooth 60fps easing
    renderEditorAt(currentTypedChars);
    requestAnimationFrame(animateCodeEditor);
  } else {
    currentTypedChars = targetTypedChars;
    renderEditorAt(currentTypedChars);
    isEditorAnimating = false;
  }
}

function requestEditorRender(newTarget) {
  targetTypedChars = newTarget;
  if (!isEditorAnimating) {
    isEditorAnimating = true;
    requestAnimationFrame(animateCodeEditor);
  }
}

/* ── SMOOTH TYPEWRITER FOR HERO ROLE (#typedText) ── */
const scrollRoles = [
  'MERN Stack Developer',
  'Full Stack Software Engineer',
  'Java Spring Boot Architect',
  'Scalable Cloud & REST APIs',
  'Open for High-Impact Roles'
];

let currentRoleText = '';
let targetRoleText = scrollRoles[0];
let typewriterTimeout = null;
let isTypingRole = false;

function typeHeroRoleTo(target) {
  targetRoleText = target;
  if (isTypingRole) return;

  function stepTypewriter() {
    isTypingRole = true;
    const typedEl = document.getElementById('typedText');
    if (!typedEl) { isTypingRole = false; return; }

    if (currentRoleText === targetRoleText) {
      isTypingRole = false;
      return;
    }

    if (!targetRoleText.startsWith(currentRoleText)) {
      currentRoleText = currentRoleText.slice(0, -1);
      typedEl.textContent = currentRoleText;
      typewriterTimeout = setTimeout(stepTypewriter, 15);
    } else {
      currentRoleText = targetRoleText.slice(0, currentRoleText.length + 1);
      typedEl.textContent = currentRoleText;
      typewriterTimeout = setTimeout(stepTypewriter, 28);
    }
  }

  stepTypewriter();
}

let mobileRoleTimer = null;
let mobileRoleIdx = 0;
function startMobileRoleRotation() {
  if (!mobileRoleTimer) {
    mobileRoleTimer = setInterval(() => {
      if (window.innerWidth > 768) {
        clearInterval(mobileRoleTimer);
        mobileRoleTimer = null;
        return;
      }
      mobileRoleIdx = (mobileRoleIdx + 1) % scrollRoles.length;
      typeHeroRoleTo(scrollRoles[mobileRoleIdx]);
    }, 2800);
  }
}

function updateScrollDrivenHero() {
  const heroContainer = document.getElementById('home');
  if (!heroContainer) return;

  // Mobile viewport optimization: auto-compile code snippet and rotate roles
  if (window.innerWidth <= 768) {
    requestEditorRender(totalCodeChars);
    startMobileRoleRotation();
    return;
  }

  // Clear mobile timer if resized back to desktop
  if (mobileRoleTimer) {
    clearInterval(mobileRoleTimer);
    mobileRoleTimer = null;
  }

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const containerTop = heroContainer.offsetTop;
  const containerHeight = heroContainer.offsetHeight - window.innerHeight;
  
  // Smooth progress through the pinned hero runway (0.0 to 1.0)
  let progress = 0;
  if (containerHeight > 60) {
    progress = Math.min(1, Math.max(0, (scrollY - containerTop) / containerHeight));
  } else {
    progress = Math.min(1, Math.max(0, scrollY / 420));
  }

  // 1. Line 87: Hero Role typing animation
  const targetIdx = Math.min(scrollRoles.length - 1, Math.floor(progress * scrollRoles.length));
  typeHeroRoleTo(scrollRoles[targetIdx]);

  // 2. Code Editor: character-by-character smooth typing as user scrolls
  const initialMinChars = codeLineOffsets[1] ? codeLineOffsets[1].end : 50;
  const newTarget = initialMinChars + (totalCodeChars - initialMinChars) * Math.min(1, progress / 0.94);
  requestEditorRender(newTarget);
}

// RequestAnimationFrame scroll throttling for silky 60fps performance
let isScrollScheduled = false;
window.addEventListener('scroll', () => {
  if (!isScrollScheduled) {
    window.requestAnimationFrame(() => {
      updateScrollDrivenHero();
      isScrollScheduled = false;
    });
    isScrollScheduled = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  updateScrollDrivenHero();
}, { passive: true });

// Initial render
updateScrollDrivenHero();
setTimeout(updateScrollDrivenHero, 800);
setTimeout(updateScrollDrivenHero, 1600);

/* ── LOADER ── */

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); }
  }, 1400);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0;
let mouseX = -100, mouseY = -100;
let cursorInitialized = false;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  if (!cursorInitialized) {
    rx = mouseX;
    ry = mouseY;
    cursorInitialized = true;
    document.body.classList.add('has-custom-cursor');
  }
});

document.addEventListener('mouseenter', () => {
  if (cursorInitialized) document.body.classList.add('has-custom-cursor');
});

document.addEventListener('mouseleave', () => {
  document.body.classList.remove('has-custom-cursor');
});

(function followRing() {
  if (cursorInitialized) {
    rx += (mouseX - rx) * 0.16;
    ry += (mouseY - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(followRing);
})();

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h   = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / h) * 100;
  if (prog) prog.style.width = pct + '%';
});

/* ── SCROLL TO TOP ── */
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 500);
});
scrollBtn && scrollBtn.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── REVERSIBLE TWO-WAY SCROLL OBSERVER (TRIGGERS ABOVE MID-SCREEN) ── */
// rootMargin: '0px 0px -52% 0px' sets the trigger line at 48% from top (strictly above mid-screen)
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Scrolling down: element passes above mid-screen -> animate IN
      entry.target.classList.add('visible');

      // Stagger child chips
      entry.target.querySelectorAll('.anim-chip').forEach((chip, idx) => {
        chip.style.transitionDelay = `${idx * 0.05}s`;
        chip.classList.add('visible');
      });

      // Animate skill bar graphs
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = (bar.dataset.width || 80) + '%';
      });

      // Animated counters
      entry.target.querySelectorAll('.counter').forEach(el => {
        const target = +el.dataset.target || 0;
        if (!target) return;
        let n = 0;
        const step = Math.ceil(target / 40);
        const t = setInterval(() => {
          n = Math.min(n + step, target);
          el.textContent = n + '+';
          if (n >= target) clearInterval(t);
        }, 35);
      });
    } else {
      // Reverse scrolling up: element sinks below mid-screen -> animate OUT smoothly
      entry.target.classList.remove('visible');

      entry.target.querySelectorAll('.anim-chip').forEach(chip => {
        chip.classList.remove('visible');
        chip.style.transitionDelay = '0s';
      });

      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = '0%';
      });
    }
  });
}, {
  // Trigger line strictly above mid-screen
  rootMargin: '0px 0px -52% 0px',
  threshold: 0.02
});

// Observe all section elements for distinct reversible entrance animations
document.querySelectorAll(
  '.anim-exp-card, .anim-project-left, .anim-project-right, .anim-bento-scale, ' +
  '.anim-cert-card, .anim-contact-left, .anim-contact-form, ' +
  '.anim-from-top, .anim-from-bottom, .anim-from-left, .anim-from-right, ' +
  '.anim-chip, .fade-up, .bento-card, .exp-item, .proj-item'
).forEach(el => io.observe(el));

/* ── 3D TILT on project items ── */
document.querySelectorAll('.proj-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    card.style.transform = `translateX(6px) perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-fill, .btn-ghost, .btn-resume, .btn-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── ACTIVE NAV ── */
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${cur}` ? '#c9a96e' : '';
  });
});

/* ── NAVBAR SHADOW ON SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (nav) nav.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
});

/* ── AUTO-CLOSE MOBILE MENU ON CLICK ── */
const navMenuItems = document.querySelectorAll('#navbarNav .nav-link, #navbarNav .btn-resume');
const navbarCollapse = document.getElementById('navbarNav');
navMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
      bsCollapse.hide();
    }
  });
});

/* ── CUSTOM CURSOR ── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let customMouseX = 0, customMouseY = 0;
let ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  window.addEventListener('mousemove', (e) => {
    customMouseX = e.clientX;
    customMouseY = e.clientY;
    cursorDot.style.left = customMouseX + 'px';
    cursorDot.style.top = customMouseY + 'px';
  });

  const render = () => {
    ringX += (customMouseX - ringX) * 0.2;
    ringY += (customMouseY - ringY) * 0.2;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  const interactives = document.querySelectorAll('a, button, input, textarea, .proj-item, .bento-card, .cert-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

/* ── CONFETTI ON RESUME ── */
const resumeBtns = document.querySelectorAll('.btn-resume');
resumeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c9a96e', '#ffffff', '#111111']
      });
    }
  });
});

/* ── INTERACTIVE TERMINAL ── */
const termInput = document.getElementById('terminalInput');
const termOutput = document.getElementById('terminalOutput');
const termBody = document.getElementById('terminalBody');

if (termInput && termOutput) {
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value.trim().toLowerCase();
      termInput.value = '';
      
      if (cmd !== 'clear') {
        const cmdElement = document.createElement('p');
        cmdElement.style.color = '#79c0ff';
        cmdElement.style.marginTop = '10px';
        cmdElement.innerHTML = `pranav@portfolio:~$ <span style="color:#c9a96e;">${cmd}</span>`;
        termOutput.appendChild(cmdElement);
      }

      if (cmd === 'clear') {
        termOutput.innerHTML = '';
        termBody.scrollTop = termBody.scrollHeight;
        return;
      }
      
      const resElement = document.createElement('p');
      resElement.style.color = '#c9d1d9';
      resElement.innerHTML = `<span style="opacity:0.6; font-style:italic;">Processing command...</span>`;
      termOutput.appendChild(resElement);
      termBody.scrollTop = termBody.scrollHeight;

      setTimeout(() => {
        let finalHtml = '';
        if (cmd === 'help') {
          finalHtml = `System commands:<br>
          <span style="color:var(--accent);">whoami</span>  - Print user payload<br>
          <span style="color:var(--accent);">skills</span>  - Scan system dependencies<br>
          <span style="color:var(--accent);">hobbies</span> - Access personal interests<br>
          <span style="color:var(--accent);">contact</span> - Establish secure connection<br>
          <span style="color:var(--accent);">clear</span>   - Wipe terminal history<br>
          <span style="color:#7a7a7a;">???</span>     - Some commands are hidden...`;
        } else if (cmd === 'whoami') {
          finalHtml = `<span style="color:#79c0ff;">{</span><br>  <span style="color:#ff7b72;">"name"</span>: <span style="color:#a5d6ff;">"Pranav Bandagle"</span>,<br>  <span style="color:#ff7b72;">"role"</span>: <span style="color:#a5d6ff;">"Full-Stack MERN & Java Developer"</span>,<br>  <span style="color:#ff7b72;">"location"</span>: <span style="color:#a5d6ff;">"Mumbai, India"</span>,<br>  <span style="color:#ff7b72;">"mission"</span>: <span style="color:#a5d6ff;">"Writing clean code and building scalable architecture."</span><br><span style="color:#79c0ff;">}</span>`;
        } else if (cmd === 'skills') {
          finalHtml = `Scanning system dependencies... <span style="color:#27c93f;">[OK]</span><br><br>
          <span style="color:#27c93f;">[Frontend Module]</span>: React, HTML5, CSS3, Tailwind CSS<br>
          <span style="color:#ffbd2e;">[Backend Core]</span>: Node.js, Express, Java, Spring Boot<br>
          <span style="color:#ff5f56;">[Database Cluster]</span>: MongoDB, MySQL`;
        } else if (cmd === 'hobbies') {
          finalHtml = `Loading profile/hobbies.json... <span style="color:#27c93f;">100%</span><br><br>
          <span style="color:#ffbd2e;">> 🏏 Cricket</span> : Hitting boundaries on and off the field.<br>
          <span style="color:#27c93f;">> ⛰️ Trekking</span> : Scaling mountains and exploring new heights.<br><br>
          <span style="color:#79c0ff; font-style:italic;">"Writing clean code by day, exploring the outdoors by weekend."</span>`;
        } else if (cmd === 'contact') {
          finalHtml = `Establishing secure handshake... <span style="color:#27c93f;">[OK]</span><br>
          <span style="color:var(--accent);">-></span> Routing to primary inbox...<br>
          <span style="color:var(--accent);">-></span> Alternative routes: <a href="#contact" style="color:#79c0ff;text-decoration:underline;">Scroll to Form</a> or Connect on LinkedIn.`;
        } else if (cmd === 'sudo' || cmd.startsWith('sudo ')) {
          finalHtml = `<span style="color:#ff5f56;">Visitor is not in the sudoers file. This incident will be reported.</span> 🚨`;
        } else if (cmd === 'matrix') {
          termBody.style.color = '#00ff41';
          termInput.style.color = '#00ff41';
          resElement.style.color = '#00ff41';
          finalHtml = `Wake up, Neo...<br>The Matrix has you...<br>Follow the white rabbit. 🐇`;
        } else if (cmd !== '') {
          finalHtml = `<span style="color:#ff5f56;">bash: ${cmd}: command not found. Type 'help' for available commands.</span>`;
        }

        if (finalHtml !== '') {
          resElement.innerHTML = finalHtml;
        } else {
          resElement.remove();
        }
        termBody.scrollTop = termBody.scrollHeight;
      }, 700);
    }
  });
  
  termBody.addEventListener('click', () => termInput.focus());
}


/* ── DYNAMIC EXPERIENCE TENURE CALCULATION ── */
function initDynamicTenure() {
  const durationText = document.getElementById('mytekDurationText');
  if (durationText) {
    durationText.textContent = dynamicExpTenure;
  }
}
document.addEventListener('DOMContentLoaded', initDynamicTenure);
initDynamicTenure();

/* ── CONTACT FORM WITH 5-MINUTE ANTI-SPAM COOLDOWN TIMER ── */
(function initContactWithCooldown() {
  const form = document.getElementById('contactForm');
  const btnSubmit = document.getElementById('btnSendMessage');
  const cooldownNotice = document.getElementById('contactCooldownNotice');
  const cooldownCountdown = document.getElementById('cooldownCountdown');
  const successAlert = document.getElementById('contactSuccessAlert');
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const msgInput = document.getElementById('senderMessage');

  if (!form || !btnSubmit) return;

  const COOLDOWN_KEY = 'pranav_portfolio_cooldown_expiry';
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
  let timerInterval = null;

  function updateTimer() {
    const expiry = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    const remaining = expiry - Date.now();

    if (remaining > 0) {
      const totalSeconds = Math.ceil(remaining / 1000);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i class="fas fa-lock me-2"></i>Cooldown Active (${formatted})`;
      btnSubmit.style.opacity = '0.65';
      btnSubmit.style.cursor = 'not-allowed';

      if (nameInput) nameInput.disabled = true;
      if (emailInput) emailInput.disabled = true;
      if (msgInput) msgInput.disabled = true;

      if (cooldownNotice) cooldownNotice.style.display = 'flex';
      if (cooldownCountdown) cooldownCountdown.textContent = formatted;
    } else {
      clearInterval(timerInterval);
      localStorage.removeItem(COOLDOWN_KEY);

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      btnSubmit.style.opacity = '1';
      btnSubmit.style.cursor = 'pointer';

      if (nameInput) nameInput.disabled = false;
      if (emailInput) emailInput.disabled = false;
      if (msgInput) msgInput.disabled = false;

      if (cooldownNotice) cooldownNotice.style.display = 'none';
    }
  }

  // Check on load if cooldown is active
  const initialExpiry = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  if (initialExpiry > Date.now()) {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    const currentExpiry = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (currentExpiry > Date.now()) {
      alert('Anti-spam cooldown is active. Please wait before sending another message.');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Message...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '05c779de-ca16-4370-9678-44d12a2af8b4',
          name,
          email,
          message,
          subject: `Portfolio Inquiry from ${name}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#c9a96e', '#27c93f', '#ffffff']
          });
        }

        form.reset();
        if (successAlert) {
          successAlert.style.display = 'flex';
          setTimeout(() => { successAlert.style.display = 'none'; }, 9000);
        }

        // Set 5-minute persistent cooldown
        localStorage.setItem(COOLDOWN_KEY, Date.now() + COOLDOWN_MS);
        updateTimer();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
      } else {
        alert(result.message || 'Error sending message. Please try again.');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Unable to send message. Please try again.');
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
    }
  });
})();
