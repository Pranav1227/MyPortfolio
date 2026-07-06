/* ── SCROLL TO TOP ON REFRESH ── */
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── CODE EDITOR TYPING ── */
const codeLines = [
  { text: '// developer.js — Pranav Bandagle', cls: 'c-comment' },
  // { text: '// MERN Stack Developer @ Mytek Innovations', cls: 'c-comment' },
  // { text: '', cls: 'c-plain' },
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
  { text: '  experience: "1+ year",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'experience',c:'c-key'},{t:': ',c:'c-plain'},{t:'"1+ year"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  // { text: '  stack:      ["MongoDB","Express","React","Node"],', cls: 'c-plain', parts: [
  //   {t:'  ',c:'c-plain'},{t:'stack',c:'c-key'},{t:':      [',c:'c-plain'},{t:'"MongoDB"',c:'c-string'},{t:',',c:'c-plain'},{t:'"Express"',c:'c-string'},{t:',',c:'c-plain'},{t:'"React"',c:'c-string'},{t:',',c:'c-plain'},{t:'"Node"',c:'c-string'},{t:'],',c:'c-plain'}
  // ]},
  // { text: '  location:   "Mumbai, India",', cls: 'c-plain', parts: [
  //   {t:'  ',c:'c-plain'},{t:'location',c:'c-key'},{t:':   ',c:'c-plain'},{t:'"Mumbai, India"',c:'c-string'},{t:',',c:'c-plain'}
  // ]},
  { text: '  status:     "open to opportunities",', cls: 'c-plain', parts: [
    {t:'  ',c:'c-plain'},{t:'status',c:'c-key'},{t:':     ',c:'c-plain'},{t:'"open to opportunities"',c:'c-string'},{t:',',c:'c-plain'}
  ]},
  { text: '};', cls: 'c-plain' },
  { text: '', cls: 'c-plain' },
  { text: 'export default developer;', cls: 'c-plain', parts: [
    {t:'export ',c:'c-keyword'},{t:'default ',c:'c-keyword'},{t:'developer',c:'c-fn'},{t:';',c:'c-plain'}
  ]},
];

function buildLineHTML(line) {
  if (line.parts) {
    return line.parts.map(p => `<span class="${p.c}">${p.t}</span>`).join('');
  }
  return `<span class="${line.cls}">${line.text}</span>`;
}

function runCodeEditor() {
  const output   = document.getElementById('codeOutput');
  const lineNums = document.getElementById('lineNums');
  if (!output) return;

  output.innerHTML = '';
  lineNums.innerHTML = '';

  let lineIndex = 0;
  let charIndex = 0;
  let renderedLines = []; // fully rendered line HTML strings

  function updateLineNums(count) {
    lineNums.innerHTML = Array.from({length: count}, (_, i) =>
      `<span>${i + 1}</span>`
    ).join('');
  }

  function typeNextChar() {
    if (lineIndex >= codeLines.length) {
      // pause then restart
      setTimeout(() => { runCodeEditor(); }, 3000);
      return;
    }

    const line = codeLines[lineIndex];
    const fullText = line.text;

    if (charIndex <= fullText.length) {
      // Rebuild output: all completed lines + current partial line
      const partial = fullText.substring(0, charIndex);

      // For partial, highlight only plain text (no partial HTML injection)
      const partialSpan = `<span class="${line.cls}">${partial}</span>`;

      output.innerHTML = renderedLines.join('\n') +
        (renderedLines.length > 0 ? '\n' : '') +
        partialSpan;

      updateLineNums(renderedLines.length + 1);
      charIndex++;
      setTimeout(typeNextChar, charIndex === 1 ? 60 : 22);
    } else {
      // Line complete — store with full syntax highlighting
      renderedLines.push(buildLineHTML(line));
      output.innerHTML = renderedLines.join('\n');
      updateLineNums(renderedLines.length);
      lineIndex++;
      charIndex = 0;
      const pause = line.text === '' ? 80 : 40;
      setTimeout(typeNextChar, pause);
    }
  }

  typeNextChar();
}

// Start after loader finishes
setTimeout(runCodeEditor, 1600);

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

window.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
});

function animateRing() {
  // smooth lag behind cursor
  requestAnimationFrame(animateRing);
}
animateRing();

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
(function followRing() {
  rx += (mouseX - rx) * 0.12;
  ry += (mouseY - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(followRing);
})();

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h   = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / h) * 100;
  if (prog) prog.style.width = pct + '%';
});

/* ── TYPED TEXT ── */
const roles = ['Full Stack Developer', 'MERN Stack Developer', 'Java Spring Boot Dev', 'Problem Solver'];
let ri = 0, ci = 0, del = false;
const typedEl = document.getElementById('typedText');
function typeLoop() {
  if (!typedEl) return;
  const cur = roles[ri];
  typedEl.textContent = del ? cur.substring(0, --ci) : cur.substring(0, ++ci);
  let ms = del ? 55 : 100;
  if (!del && ci === cur.length)  { ms = 1800; del = true; }
  else if (del && ci === 0)        { del = false; ri = (ri + 1) % roles.length; ms = 350; }
  setTimeout(typeLoop, ms);
}
typeLoop();

/* ── SCROLL TO TOP ── */
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 500);
});
scrollBtn && scrollBtn.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── INTERSECTION OBSERVER (fade-up + skill bars + counters) ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // skill bars
    entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });

    // counters
    entry.target.querySelectorAll('.counter').forEach(el => {
      const target = +el.dataset.target;
      let n = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n + '+';
        if (n >= target) clearInterval(t);
      }, 40);
    });

    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .section').forEach(el => io.observe(el));

/* ── ALSO trigger bars when bento section comes in view ── */
const skillsIo = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
  skillsIo.disconnect();
}, { threshold: 0.1 });

const skillsSec = document.getElementById('skills');
if (skillsSec) skillsIo.observe(skillsSec);

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