/* ════════════════════════════
   MAI – main.js
   ════════════════════════════ */

/* ── THEME ── */
var htmlEl = document.documentElement
var themeIcon = document.getElementById('themeIcon')
var moonSVG = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
var sunSVG =
  '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
document.getElementById('themeToggle').addEventListener('click', function () {
  var dark = htmlEl.getAttribute('data-theme') === 'dark'
  htmlEl.setAttribute('data-theme', dark ? 'light' : 'dark')
  themeIcon.innerHTML = dark ? sunSVG : moonSVG
})

/* ── NAV SCROLL ── */
var nav = document.getElementById('mainNav')
window.addEventListener(
  'scroll',
  function () {
    nav.classList.toggle('scrolled', window.scrollY > 30)
  },
  { passive: true },
)

/* ── MOBILE MENU ── */
var overlay = document.getElementById('mobileOverlay')
document.getElementById('hamburgerBtn').addEventListener('click', function () {
  overlay.classList.add('open')
})
document
  .getElementById('mobileCloseBtn')
  .addEventListener('click', function () {
    overlay.classList.remove('open')
  })
overlay.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () {
    overlay.classList.remove('open')
  })
})

/* ── HERO SLIDER ── */
var slides = document.querySelectorAll('.slide')
var dots = document.querySelectorAll('.s-dot')
var track = document.getElementById('slidesTrack')
var cur = 0,
  total = slides.length
var timer = null,
  INTERVAL = 6000

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function goTo(n) {
  slides[cur].classList.remove('active')
  slides[cur].querySelector('.slide-bg').style.transform = 'scale(1.08)'
  dots[cur].classList.remove('active')
  cur = (n + total) % total
  slides[cur].classList.add('active')
  dots[cur].classList.add('active')
  track.style.transform = 'translateX(-' + cur * 100 + '%)'
  document.getElementById('cntCur').textContent = pad(cur + 1)
  resetBar()
}
function next() {
  goTo(cur + 1)
}
function prev() {
  goTo(cur - 1)
}

function startAuto() {
  clearInterval(timer)
  timer = setInterval(next, INTERVAL)
}
function resetBar() {
  var bar = document.getElementById('slideBar')
  bar.style.transition = 'none'
  bar.style.width = '0%'
  setTimeout(function () {
    bar.style.transition = 'width ' + INTERVAL / 1000 + 's linear'
    bar.style.width = '100%'
  }, 50)
}

document.getElementById('nextBtn').addEventListener('click', function () {
  clearInterval(timer)
  next()
  startAuto()
})
document.getElementById('prevBtn').addEventListener('click', function () {
  clearInterval(timer)
  prev()
  startAuto()
})
dots.forEach(function (d) {
  d.addEventListener('click', function () {
    clearInterval(timer)
    goTo(+this.getAttribute('data-i'))
    startAuto()
  })
})

var tx = 0
document.getElementById('heroSlider').addEventListener(
  'touchstart',
  function (e) {
    tx = e.touches[0].clientX
  },
  { passive: true },
)
document.getElementById('heroSlider').addEventListener(
  'touchend',
  function (e) {
    var dx = e.changedTouches[0].clientX - tx
    if (Math.abs(dx) > 50) {
      clearInterval(timer)
      dx < 0 ? next() : prev()
      startAuto()
    }
  },
  { passive: true },
)
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    clearInterval(timer)
    next()
    startAuto()
  }
  if (e.key === 'ArrowLeft') {
    clearInterval(timer)
    prev()
    startAuto()
  }
})

document.getElementById('cntTotal').textContent = pad(total)
startAuto()
resetBar()

/* ── COUNTERS ── */
var ctrs = document.querySelectorAll('.ctr')
new IntersectionObserver(
  function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return
      ctrs.forEach(function (el) {
        var t = +el.getAttribute('data-t'),
          dur = 1800,
          s = performance.now()
        ;(function step(now) {
          var p = Math.min((now - s) / dur, 1),
            ease = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.round(t * ease)
          if (p < 1) requestAnimationFrame(step)
        })(s)
      })
      obs.disconnect()
    })
  },
  { threshold: 0.4 },
).observe(document.querySelector('.stats-bar'))

/* ── SCROLL REVEAL ── */
new IntersectionObserver(
  function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('in')
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -36px 0px' },
).observe = (function (orig) {
  return orig
})(IntersectionObserver.prototype.observe)
;(function () {
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in')
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' },
  )
  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el)
  })
})()

/* ── AREAS TABS ── */
var areaTabs = document.querySelectorAll('.area-tab')
var areaPanels = document.querySelectorAll('.area-panel')
areaTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    areaTabs.forEach(function (t) {
      t.classList.remove('active')
    })
    areaPanels.forEach(function (p) {
      p.classList.remove('active')
    })
    this.classList.add('active')
    var idx = +this.getAttribute('data-area')
    areaPanels[idx].classList.add('active')
  })
})

/* ── IMPACTO COUNTERS (ctr2) ── */
new IntersectionObserver(
  function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return
      document.querySelectorAll('.ctr2').forEach(function (el) {
        var t = +el.getAttribute('data-t'),
          dur = 1800,
          s = performance.now()
        ;(function step(now) {
          var p = Math.min((now - s) / dur, 1),
            ease = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.round(t * ease)
          if (p < 1) requestAnimationFrame(step)
        })(s)
      })
      obs.disconnect()
    })
  },
  { threshold: 0.4 },
).observe(document.querySelector('.impacto-banner') || document.body)

/* ── CONTACT FORM MOCK SUBMIT ── */
var formSubmitBtn = document.getElementById('formSubmit')
if (formSubmitBtn) {
  formSubmitBtn.addEventListener('click', function () {
    var name = document.getElementById('fName').value.trim()
    var email = document.getElementById('fEmail').value.trim()
    var privacy = document.getElementById('fPrivacy').checked
    if (!name || !email) {
      document.getElementById('fName').style.borderColor = name
        ? ''
        : 'rgba(220,60,60,0.7)'
      document.getElementById('fEmail').style.borderColor = email
        ? ''
        : 'rgba(220,60,60,0.7)'
      return
    }
    if (!privacy) {
      document.getElementById('fPrivacy').style.outline =
        '2px solid rgba(220,60,60,0.7)'
      return
    }
    document.getElementById('contactForm').style.display = 'none'
    document.getElementById('formSuccess').classList.add('show')
  })
}

/* ══════════════════════════════════════
   LANGUAGE SWITCHER
══════════════════════════════════════ */

function switchLang(code, label, e) {
  e.preventDefault()
  document.querySelectorAll('.lang-option').forEach(function (o) {
    o.classList.remove('active')
  })
  e.currentTarget.classList.add('active')
  document.getElementById('langCurrent').textContent = label
  document.getElementById('langSwitcher').classList.remove('open')
  var sel = document.querySelector('.goog-te-combo')
  if (sel) {
    sel.value = code
    sel.dispatchEvent(new Event('change'))
  }
}

/* ══════════════════════════════════════
   GOOGLE TRANSLATE INIT
══════════════════════════════════════ */
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'pt',
      includedLanguages: 'pt,en,fr,es',
      autoDisplay: false,
    },
    'google_translate_element',
  )
}

/* ══════════════════════════════════════
   ENROLLMENT SHEET
══════════════════════════════════════ */
var PROGRAMS = {
  banca: [
    {
      name: 'Supervisão Bancária',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '150.000 Kz',
      date: 'Julho 2025',
      desc: 'Enquadramento regulatório, funções de supervisão e conformidade no sector bancário angolano.',
    },
    {
      name: 'Gestão de Risco',
      duration: '32h',
      mode: 'Presencial',
      price: '120.000 Kz',
      date: 'Agosto 2025',
      desc: 'Identificação, avaliação e mitigação de riscos financeiros e operacionais.',
    },
    {
      name: 'Compliance e AML',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Julho 2025',
      desc: 'Prevenção de branqueamento de capitais e conformidade regulatória.',
    },
    {
      name: 'Governança Corporativa',
      duration: '32h',
      mode: 'Presencial',
      price: '130.000 Kz',
      date: 'Setembro 2025',
      desc: 'Estruturas de governança, boas práticas e responsabilidade corporativa.',
    },
    {
      name: 'Transformação Digital Bancária',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '160.000 Kz',
      date: 'Outubro 2025',
      desc: 'Tecnologias emergentes, fintechs e inovação digital no sector financeiro.',
    },
  ],
  energia: [
    {
      name: 'Energias Renováveis',
      duration: '40h',
      mode: 'Presencial',
      price: '140.000 Kz',
      date: 'Julho 2025',
      desc: 'Fontes renováveis de energia, tecnologias e mercado em Angola.',
    },
    {
      name: 'Energia Solar Fotovoltaica',
      duration: '32h',
      mode: 'Presencial / Prático',
      price: '130.000 Kz',
      date: 'Agosto 2025',
      desc: 'Projecto, instalação e manutenção de sistemas solares fotovoltaicos.',
    },
    {
      name: 'ESG e Sustentabilidade',
      duration: '24h',
      mode: 'Online Live',
      price: '95.000 Kz',
      date: 'Setembro 2025',
      desc: 'Critérios ESG, relatórios de sustentabilidade e conformidade ambiental.',
    },
    {
      name: 'Indústria Petrolífera e Gás',
      duration: '80h',
      mode: 'Presencial',
      price: '280.000 Kz',
      date: 'Outubro 2025',
      desc: 'Operações upstream/downstream, regulação e gestão do sector petrolífero.',
    },
  ],
  industria: [
    {
      name: 'Lean Manufacturing',
      duration: '40h',
      mode: 'Presencial / Prático',
      price: '130.000 Kz',
      date: 'Julho 2025',
      desc: 'Princípios lean, eliminação de desperdícios e melhoria contínua.',
    },
    {
      name: 'Gestão da Qualidade',
      duration: '32h',
      mode: 'Presencial',
      price: '120.000 Kz',
      date: 'Agosto 2025',
      desc: 'Sistemas de gestão da qualidade, ferramentas e indicadores.',
    },
    {
      name: 'Normas ISO',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Setembro 2025',
      desc: 'ISO 9001, ISO 14001, ISO 45001 — implementação e auditoria.',
    },
    {
      name: 'Automação Industrial',
      duration: '48h',
      mode: 'Presencial / Prático',
      price: '175.000 Kz',
      date: 'Outubro 2025',
      desc: 'Sistemas de automação, PLCs, SCADA e industria 4.0.',
    },
  ],
  logistica: [
    {
      name: 'Gestão Logística Integrada',
      duration: '40h',
      mode: 'Presencial',
      price: '135.000 Kz',
      date: 'Julho 2025',
      desc: 'Planeamento, execução e controlo de operações logísticas integradas.',
    },
    {
      name: 'Supply Chain Management',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '160.000 Kz',
      date: 'Agosto 2025',
      desc: 'Gestão estratégica da cadeia de abastecimento e optimização.',
    },
    {
      name: 'Gestão Portuária',
      duration: '40h',
      mode: 'Presencial',
      price: '145.000 Kz',
      date: 'Setembro 2025',
      desc: 'Operações portuárias, regulação marítima e gestão de terminais.',
    },
    {
      name: 'Logística Aduaneira',
      duration: '24h',
      mode: 'Online Live',
      price: '85.000 Kz',
      date: 'Outubro 2025',
      desc: 'Procedimentos aduaneiros, documentação e comércio internacional.',
    },
  ],
  ti: [
    {
      name: 'Cibersegurança',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '175.000 Kz',
      date: 'Julho 2025',
      desc: 'Ameaças cibernéticas, defesa de sistemas e resposta a incidentes.',
    },
    {
      name: 'Governança de TI',
      duration: '32h',
      mode: 'Presencial',
      price: '130.000 Kz',
      date: 'Agosto 2025',
      desc: 'Frameworks COBIT e ITIL, alinhamento estratégico de TI.',
    },
    {
      name: 'Protecção de Dados',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Setembro 2025',
      desc: 'RGPD, Lei angolana de protecção de dados e boas práticas.',
    },
    {
      name: 'IA Aplicada aos Negócios',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '165.000 Kz',
      date: 'Outubro 2025',
      desc: 'Aplicações práticas de IA e Machine Learning no contexto empresarial.',
    },
  ],
  aviacao: [
    {
      name: 'Segurança Operacional (Safety)',
      duration: '40h',
      mode: 'Presencial',
      price: '155.000 Kz',
      date: 'Julho 2025',
      desc: 'SMS, gestão de riscos operacionais e cultura de segurança na aviação.',
    },
    {
      name: 'Segurança Aviação Civil (AVSEC)',
      duration: '32h',
      mode: 'Presencial',
      price: '140.000 Kz',
      date: 'Agosto 2025',
      desc: 'Padrões ICAO/IATA de segurança aeroportuária e controlo de acesso.',
    },
    {
      name: 'Gestão Aeroportuária',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '170.000 Kz',
      date: 'Setembro 2025',
      desc: 'Operações aeroportuárias, coordenação e gestão de infra-estruturas.',
    },
    {
      name: 'Ground Handling',
      duration: '40h',
      mode: 'Presencial / Prático',
      price: '145.000 Kz',
      date: 'Outubro 2025',
      desc: 'Serviços de solo, procedimentos de rampa e assistência em terra.',
    },
  ],
}

var curStep = 1
var selectedProg = null

function onAreaChange() {
  var area = document.getElementById('sArea').value
  var pf = document.getElementById('programField')
  var sel = document.getElementById('sProgram')
  var info = document.getElementById('progInfoCard')
  sel.innerHTML =
    '<option value="" disabled selected>Escolher programa…</option>'
  if (PROGRAMS[area]) {
    PROGRAMS[area].forEach(function (p, i) {
      var opt = document.createElement('option')
      opt.value = i
      opt.textContent = p.name
      sel.appendChild(opt)
    })
    pf.style.display = 'block'
  }
  info.style.display = 'none'
  selectedProg = null
  updateNextBtn()
}

function onProgramChange() {
  var area = document.getElementById('sArea').value
  var idx = document.getElementById('sProgram').value
  if (area && idx !== '') {
    var p = PROGRAMS[area][idx]
    selectedProg = p
    document.getElementById('progInfoName').textContent = p.name
    document.getElementById('progInfoPrice').textContent = p.price
    document.getElementById('progInfoDuration').textContent = p.duration
    document.getElementById('progInfoMode').textContent = p.mode
    document.getElementById('progInfoDate').textContent = p.date
    document.getElementById('progInfoDesc').textContent = p.desc
    document.getElementById('progInfoCard').style.display = 'block'
  }
  updateNextBtn()
}

function updateNextBtn() {
  var btn = document.getElementById('sheetNext')
  if (curStep === 1) btn.disabled = !selectedProg
  if (curStep === 2) {
    var n = document.getElementById('sName').value.trim()
    var e = document.getElementById('sEmail').value.trim()
    var ph = document.getElementById('sPhone').value.trim()
    btn.disabled = !(n && e && ph)
  }
  if (curStep === 3) btn.disabled = false
}

function goToStep(step) {
  ;[1, 2, 3].forEach(function (s) {
    var el = document.getElementById('step' + s)
    if (el) el.style.display = s === step ? 'block' : 'none'
    var dot = document.getElementById('dot' + s)
    if (dot) {
      dot.classList.toggle('active', s === step)
      dot.classList.toggle('done', s < step)
    }
  })
  curStep = step
  var back = document.getElementById('sheetBack')
  var next = document.getElementById('sheetNext')
  back.style.display = step > 1 ? 'flex' : 'none'
  if (step === 3) {
    next.innerHTML =
      'Confirmar Inscrição <span translate="no" class="mdi mdi-check"></span>'
  } else {
    next.innerHTML =
      'Continuar <span translate="no" class="mdi mdi-arrow-right"></span>'
  }
  updateNextBtn()
  buildSummary()
}

function buildSummary() {
  if (curStep !== 3 || !selectedProg) return
  var n = document.getElementById('sName').value.trim()
  var ln = document.getElementById('sLastname').value.trim()
  var em = document.getElementById('sEmail').value.trim()
  var ph = document.getElementById('sPhone').value.trim()
  var org = document.getElementById('sOrg').value.trim()
  document.getElementById('sheetSummary').innerHTML =
    '<strong>Programa:</strong> ' +
    selectedProg.name +
    '<br>' +
    '<strong>Duração:</strong> ' +
    selectedProg.duration +
    '<br>' +
    '<strong>Modalidade:</strong> ' +
    selectedProg.mode +
    '<br>' +
    '<strong>Início:</strong> ' +
    selectedProg.date +
    '<br>' +
    '<strong>Nome:</strong> ' +
    n +
    ' ' +
    ln +
    '<br>' +
    '<strong>E-mail:</strong> ' +
    em +
    '<br>' +
    '<strong>Telefone:</strong> ' +
    ph +
    (org ? '<br><strong>Organização:</strong> ' + org : '') +
    '<span class="summary-price">' +
    selectedProg.price +
    '</span>'
}

// Open/close sheet
function openSheet() {
  var sheet = document.getElementById('enrollSheet')
  var backdrop = document.getElementById('sheetBackdrop')
  if (!sheet || !backdrop) return
  sheet.classList.add('open')
  backdrop.classList.add('open')
  document.body.style.overflow = 'hidden'
  goToStep(1)
}
function closeSheet() {
  var sheet = document.getElementById('enrollSheet')
  var backdrop = document.getElementById('sheetBackdrop')
  if (!sheet || !backdrop) return
  sheet.classList.remove('open')
  backdrop.classList.remove('open')
  document.body.style.overflow = ''
}

// Boot everything once DOM is fully ready
document.addEventListener('DOMContentLoaded', function () {
  // ── Enroll button ──
  var enrollBtn = document.getElementById('enrollBtn')
  if (enrollBtn) {
    enrollBtn.addEventListener('click', function (e) {
      e.preventDefault()
      openSheet()
    })
  }

  // ── Sheet close / backdrop ──
  var sheetClose = document.getElementById('sheetClose')
  var sheetBackdrop = document.getElementById('sheetBackdrop')
  var sheetNext = document.getElementById('sheetNext')
  var sheetBack = document.getElementById('sheetBack')

  if (sheetClose) sheetClose.addEventListener('click', closeSheet)
  if (sheetBackdrop) sheetBackdrop.addEventListener('click', closeSheet)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet()
  })

  // ── Next button ──
  if (sheetNext) {
    sheetNext.addEventListener('click', function () {
      if (curStep === 1 && selectedProg) {
        goToStep(2)
      } else if (curStep === 2) {
        var n = document.getElementById('sName').value.trim()
        var em = document.getElementById('sEmail').value.trim()
        var ph = document.getElementById('sPhone').value.trim()
        if (!n || !em || !ph) {
          if (!n)
            document.getElementById('sName').style.borderColor =
              'rgba(220,60,60,.7)'
          if (!em)
            document.getElementById('sEmail').style.borderColor =
              'rgba(220,60,60,.7)'
          if (!ph)
            document.getElementById('sPhone').style.borderColor =
              'rgba(220,60,60,.7)'
          return
        }
        goToStep(3)
      } else if (curStep === 3) {
        var priv = document.getElementById('sPrivacy')
        if (!priv.checked) {
          priv.style.outline = '2px solid rgba(220,60,60,.7)'
          return
        }
        // Show success state
        ;[1, 2, 3].forEach(function (s) {
          var el = document.getElementById('step' + s)
          if (el) el.style.display = 'none'
        })
        var success = document.getElementById('stepSuccess')
        if (success) success.style.display = 'flex'
        if (sheetBack) sheetBack.style.display = 'none'
        sheetNext.style.display = 'none'
        ;[1, 2, 3].forEach(function (s) {
          var d = document.getElementById('dot' + s)
          if (d) {
            d.classList.remove('active')
            d.classList.add('done')
          }
        })
      }
    })
  }

  // ── Back button ──
  if (sheetBack) {
    sheetBack.addEventListener('click', function () {
      if (curStep > 1) goToStep(curStep - 1)
    })
  }

  // ── Live validation on step 2 fields ──
  ;['sName', 'sEmail', 'sPhone'].forEach(function (id) {
    var el = document.getElementById(id)
    if (el) {
      el.addEventListener('input', function () {
        this.style.borderColor = ''
        updateNextBtn()
      })
    }
  })

  // ── Lang switcher (also needs DOM) ──
  var sw = document.getElementById('langSwitcher')
  var btn = document.getElementById('langBtn')
  var dd = document.getElementById('langDropdown')
  if (sw && btn && dd) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation()
      sw.classList.toggle('open')
    })
    document.addEventListener('click', function (e) {
      if (!sw.contains(e.target)) sw.classList.remove('open')
    })
    dd.addEventListener('click', function (e) {
      e.stopPropagation()
    })
  }
})
