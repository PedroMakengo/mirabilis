/* MAI – main.js */

/* THEME */
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

/* NAV SCROLL */
var nav = document.getElementById('mainNav')
window.addEventListener(
  'scroll',
  function () {
    nav.classList.toggle('scrolled', window.scrollY > 30)
  },
  { passive: true },
)

/* MOBILE MENU */
var mob = document.getElementById('mobileOverlay')
document.getElementById('hamburgerBtn').addEventListener('click', function () {
  mob.classList.add('open')
})
document
  .getElementById('mobileCloseBtn')
  .addEventListener('click', function () {
    mob.classList.remove('open')
  })
mob.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () {
    mob.classList.remove('open')
  })
})

/* HERO SLIDER */
var slides = document.querySelectorAll('.slide')
var dots = document.querySelectorAll('.s-dot')
var track = document.getElementById('slidesTrack')
var cur = 0,
  total = slides.length,
  timer = null,
  INTERVAL = 6000
function pad(n) {
  return n < 10 ? '0' + n : '' + n
}
function goTo(n) {
  slides[cur].classList.remove('active')
  slides[cur].querySelector('.slide-bg').style.transform = 'scale(1.06)'
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

/* COUNTERS */
;(function () {
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
})()

/* IMPACTO COUNTERS */
;(function () {
  var ctrs = document.querySelectorAll('.ctr2')
  if (!ctrs.length) return
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
    { threshold: 0.3 },
  ).observe(document.querySelector('.impacto') || document.body)
})()

/* SCROLL REVEAL */
;(function () {
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in')
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
  )
  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el)
  })
})()

/* CONTACT FORM */
;(function () {
  var btn = document.getElementById('formSubmit')
  if (!btn) return
  btn.addEventListener('click', function () {
    var n = document.getElementById('fName').value.trim()
    var em = document.getElementById('fEmail').value.trim()
    var priv = document.getElementById('fPrivacy').checked
    if (!n) {
      document.getElementById('fName').style.borderBottomColor =
        'rgba(200,50,50,.7)'
      return
    }
    if (!em) {
      document.getElementById('fEmail').style.borderBottomColor =
        'rgba(200,50,50,.7)'
      return
    }
    if (!priv) {
      document.getElementById('fPrivacy').style.outline =
        '2px solid rgba(200,50,50,.7)'
      return
    }
    document.getElementById('contactForm').style.display = 'none'
    document.getElementById('formSuccess').classList.add('show')
  })
  ;['fName', 'fEmail'].forEach(function (id) {
    var el = document.getElementById(id)
    if (el)
      el.addEventListener('input', function () {
        this.style.borderBottomColor = ''
      })
  })
})()

/* LANG SWITCHER */
function switchLang(code, label, e) {
  e.preventDefault()
  document.querySelectorAll('.lang-opt').forEach(function (o) {
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

/* SHEET */
var PROGRAMS = {
  banca: [
    {
      name: 'Supervisão Bancária',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '150.000 Kz',
      date: 'Jul 2025',
      desc: 'Enquadramento regulatório e funções de supervisão no sector bancário angolano.',
    },
    {
      name: 'Gestão de Risco',
      duration: '32h',
      mode: 'Presencial',
      price: '120.000 Kz',
      date: 'Ago 2025',
      desc: 'Identificação, avaliação e mitigação de riscos financeiros e operacionais.',
    },
    {
      name: 'Compliance e AML',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Jul 2025',
      desc: 'Prevenção de branqueamento de capitais e conformidade regulatória.',
    },
    {
      name: 'Governança Corporativa',
      duration: '32h',
      mode: 'Presencial',
      price: '130.000 Kz',
      date: 'Set 2025',
      desc: 'Estruturas de governança, boas práticas e responsabilidade corporativa.',
    },
    {
      name: 'Transformação Digital Bancária',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '160.000 Kz',
      date: 'Out 2025',
      desc: 'Tecnologias emergentes, fintechs e inovação digital no sector financeiro.',
    },
  ],
  energia: [
    {
      name: 'Energias Renováveis',
      duration: '40h',
      mode: 'Presencial',
      price: '140.000 Kz',
      date: 'Jul 2025',
      desc: 'Fontes renováveis de energia, tecnologias e mercado em Angola.',
    },
    {
      name: 'Energia Solar Fotovoltaica',
      duration: '32h',
      mode: 'Presencial / Prático',
      price: '130.000 Kz',
      date: 'Ago 2025',
      desc: 'Projecto, instalação e manutenção de sistemas solares fotovoltaicos.',
    },
    {
      name: 'ESG e Sustentabilidade',
      duration: '24h',
      mode: 'Online Live',
      price: '95.000 Kz',
      date: 'Set 2025',
      desc: 'Critérios ESG, relatórios de sustentabilidade e conformidade ambiental.',
    },
    {
      name: 'Indústria Petrolífera e Gás',
      duration: '80h',
      mode: 'Presencial',
      price: '280.000 Kz',
      date: 'Out 2025',
      desc: 'Operações upstream/downstream, regulação e gestão do sector petrolífero.',
    },
  ],
  industria: [
    {
      name: 'Lean Manufacturing',
      duration: '40h',
      mode: 'Presencial / Prático',
      price: '130.000 Kz',
      date: 'Jul 2025',
      desc: 'Princípios lean, eliminação de desperdícios e melhoria contínua.',
    },
    {
      name: 'Gestão da Qualidade',
      duration: '32h',
      mode: 'Presencial',
      price: '120.000 Kz',
      date: 'Ago 2025',
      desc: 'Sistemas de gestão da qualidade, ferramentas e indicadores.',
    },
    {
      name: 'Normas ISO',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Set 2025',
      desc: 'ISO 9001, ISO 14001, ISO 45001 — implementação e auditoria.',
    },
    {
      name: 'Automação Industrial',
      duration: '48h',
      mode: 'Presencial / Prático',
      price: '175.000 Kz',
      date: 'Out 2025',
      desc: 'Sistemas de automação, PLCs, SCADA e indústria 4.0.',
    },
  ],
  logistica: [
    {
      name: 'Gestão Logística Integrada',
      duration: '40h',
      mode: 'Presencial',
      price: '135.000 Kz',
      date: 'Jul 2025',
      desc: 'Planeamento, execução e controlo de operações logísticas integradas.',
    },
    {
      name: 'Supply Chain Management',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '160.000 Kz',
      date: 'Ago 2025',
      desc: 'Gestão estratégica da cadeia de abastecimento e optimização.',
    },
    {
      name: 'Gestão Portuária',
      duration: '40h',
      mode: 'Presencial',
      price: '145.000 Kz',
      date: 'Set 2025',
      desc: 'Operações portuárias, regulação marítima e gestão de terminais.',
    },
    {
      name: 'Logística Aduaneira',
      duration: '24h',
      mode: 'Online Live',
      price: '85.000 Kz',
      date: 'Out 2025',
      desc: 'Procedimentos aduaneiros, documentação e comércio internacional.',
    },
  ],
  ti: [
    {
      name: 'Cibersegurança',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '175.000 Kz',
      date: 'Jul 2025',
      desc: 'Ameaças cibernéticas, defesa de sistemas e resposta a incidentes.',
    },
    {
      name: 'Governança de TI',
      duration: '32h',
      mode: 'Presencial',
      price: '130.000 Kz',
      date: 'Ago 2025',
      desc: 'Frameworks COBIT e ITIL, alinhamento estratégico de TI.',
    },
    {
      name: 'Protecção de Dados',
      duration: '24h',
      mode: 'Online Live',
      price: '90.000 Kz',
      date: 'Set 2025',
      desc: 'RGPD, Lei angolana de protecção de dados e boas práticas.',
    },
    {
      name: 'IA Aplicada aos Negócios',
      duration: '40h',
      mode: 'Presencial / Online',
      price: '165.000 Kz',
      date: 'Out 2025',
      desc: 'Aplicações práticas de IA e Machine Learning no contexto empresarial.',
    },
  ],
  aviacao: [
    {
      name: 'Segurança Operacional (Safety)',
      duration: '40h',
      mode: 'Presencial',
      price: '155.000 Kz',
      date: 'Jul 2025',
      desc: 'SMS, gestão de riscos operacionais e cultura de segurança na aviação.',
    },
    {
      name: 'Segurança Aviação Civil (AVSEC)',
      duration: '32h',
      mode: 'Presencial',
      price: '140.000 Kz',
      date: 'Ago 2025',
      desc: 'Padrões ICAO/IATA de segurança aeroportuária e controlo de acesso.',
    },
    {
      name: 'Gestão Aeroportuária',
      duration: '48h',
      mode: 'Presencial / Online',
      price: '170.000 Kz',
      date: 'Set 2025',
      desc: 'Operações aeroportuárias, coordenação e gestão de infra-estruturas.',
    },
    {
      name: 'Ground Handling',
      duration: '40h',
      mode: 'Presencial / Prático',
      price: '145.000 Kz',
      date: 'Out 2025',
      desc: 'Serviços de solo, procedimentos de rampa e assistência em terra.',
    },
  ],
}

var curStep = 1,
  selProg = null

function onAreaChange() {
  var area = document.getElementById('sArea').value
  var pf = document.getElementById('programField')
  var sel = document.getElementById('sProgram')
  sel.innerHTML =
    '<option value="" disabled selected>Escolher programa…</option>'
  if (PROGRAMS[area]) {
    PROGRAMS[area].forEach(function (p, i) {
      var o = document.createElement('option')
      o.value = i
      o.textContent = p.name
      sel.appendChild(o)
    })
    pf.style.display = 'block'
  }
  document.getElementById('progInfoCard').style.display = 'none'
  selProg = null
  updNext()
}

function onProgramChange() {
  var area = document.getElementById('sArea').value
  var idx = document.getElementById('sProgram').value
  if (area && idx !== '') {
    selProg = PROGRAMS[area][idx]
    document.getElementById('progInfoName').textContent = selProg.name
    document.getElementById('progInfoPrice').textContent = selProg.price
    document.getElementById('progInfoDuration').textContent = selProg.duration
    document.getElementById('progInfoMode').textContent = selProg.mode
    document.getElementById('progInfoDate').textContent = selProg.date
    document.getElementById('progInfoDesc').textContent = selProg.desc
    document.getElementById('progInfoCard').style.display = 'block'
  }
  updNext()
}

function updNext() {
  var btn = document.getElementById('sheetNext')
  if (curStep === 1) btn.disabled = !selProg
  if (curStep === 2) {
    var n = document.getElementById('sName').value.trim()
    var em = document.getElementById('sEmail').value.trim()
    var ph = document.getElementById('sPhone').value.trim()
    btn.disabled = !(n && em && ph)
  }
  if (curStep === 3) btn.disabled = false
}

function goStep(s) {
  ;[1, 2, 3].forEach(function (x) {
    var el = document.getElementById('step' + x)
    if (el) el.style.display = x === s ? 'block' : 'none'
    var d = document.getElementById('dot' + x)
    if (d) {
      d.classList.toggle('active', x === s)
      d.classList.toggle('done', x < s)
    }
  })
  curStep = s
  var back = document.getElementById('sheetBack')
  var next = document.getElementById('sheetNext')
  if (back) back.style.display = s > 1 ? 'flex' : 'none'
  if (next) {
    if (s === 3)
      next.innerHTML =
        'Confirmar <span translate="no" class="mdi mdi-check"></span>'
    else
      next.innerHTML =
        'Continuar <span translate="no" class="mdi mdi-arrow-right"></span>'
  }
  updNext()
  if (s === 3) buildSummary()
}

function buildSummary() {
  if (!selProg) return
  var n = document.getElementById('sName').value.trim()
  var ln = document.getElementById('sLastname').value.trim()
  var em = document.getElementById('sEmail').value.trim()
  var ph = document.getElementById('sPhone').value.trim()
  var org = document.getElementById('sOrg').value.trim()
  document.getElementById('sheetSummary').innerHTML =
    '<strong>Programa:</strong> ' +
    selProg.name +
    '<br>' +
    '<strong>Duração:</strong> ' +
    selProg.duration +
    '<br>' +
    '<strong>Modalidade:</strong> ' +
    selProg.mode +
    '<br>' +
    '<strong>Início:</strong> ' +
    selProg.date +
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
    '<span class="s-price">' +
    selProg.price +
    '</span>'
}

function openSheet() {
  document.getElementById('enrollSheet').classList.add('open')
  document.getElementById('sheetBackdrop').classList.add('open')
  document.body.style.overflow = 'hidden'
  curStep = 1
  selProg = null
  ;[1, 2, 3].forEach(function (x) {
    var el = document.getElementById('step' + x)
    if (el) el.style.display = x === 1 ? 'block' : 'none'
  })
  document.getElementById('stepSuccess').style.display = 'none'
  document.getElementById('sheetBack').style.display = 'none'
  document.getElementById('sheetNext').style.display = 'flex'
  document.getElementById('sheetNext').innerHTML =
    'Continuar <span translate="no" class="mdi mdi-arrow-right"></span>'
  document.getElementById('sheetNext').disabled = true
  document.getElementById('sArea').value = ''
  document.getElementById('programField').style.display = 'none'
  document.getElementById('progInfoCard').style.display = 'none'
  ;[1, 2, 3].forEach(function (x) {
    var d = document.getElementById('dot' + x)
    if (d) {
      d.classList.toggle('active', x === 1)
      d.classList.remove('done')
    }
  })
}
function closeSheet() {
  document.getElementById('enrollSheet').classList.remove('open')
  document.getElementById('sheetBackdrop').classList.remove('open')
  document.body.style.overflow = ''
}

document.addEventListener('DOMContentLoaded', function () {
  var eb = document.getElementById('enrollBtn')
  if (eb)
    eb.addEventListener('click', function (e) {
      e.preventDefault()
      openSheet()
    })
  var eb2 = document.getElementById('enrollBtn2')
  if (eb2)
    eb2.addEventListener('click', function (e) {
      e.preventDefault()
      openSheet()
    })
  var sc = document.getElementById('sheetClose')
  if (sc) sc.addEventListener('click', closeSheet)
  var bd = document.getElementById('sheetBackdrop')
  if (bd) bd.addEventListener('click', closeSheet)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet()
  })

  var sn = document.getElementById('sheetNext')
  if (sn)
    sn.addEventListener('click', function () {
      if (curStep === 1 && selProg) goStep(2)
      else if (curStep === 2) {
        var n = document.getElementById('sName').value.trim()
        var em = document.getElementById('sEmail').value.trim()
        var ph = document.getElementById('sPhone').value.trim()
        if (!n) {
          document.getElementById('sName').style.borderBottomColor =
            'rgba(200,50,50,.7)'
          return
        }
        if (!em) {
          document.getElementById('sEmail').style.borderBottomColor =
            'rgba(200,50,50,.7)'
          return
        }
        if (!ph) {
          document.getElementById('sPhone').style.borderBottomColor =
            'rgba(200,50,50,.7)'
          return
        }
        goStep(3)
      } else if (curStep === 3) {
        var priv = document.getElementById('sPrivacy')
        if (!priv.checked) {
          priv.style.outline = '2px solid rgba(200,50,50,.7)'
          return
        }
        ;[1, 2, 3].forEach(function (x) {
          var el = document.getElementById('step' + x)
          if (el) el.style.display = 'none'
        })
        document.getElementById('stepSuccess').style.display = 'flex'
        document.getElementById('sheetBack').style.display = 'none'
        document.getElementById('sheetNext').style.display = 'none'
        ;[1, 2, 3].forEach(function (x) {
          var d = document.getElementById('dot' + x)
          if (d) {
            d.classList.remove('active')
            d.classList.add('done')
          }
        })
      }
    })

  var sb = document.getElementById('sheetBack')
  if (sb)
    sb.addEventListener('click', function () {
      if (curStep > 1) goStep(curStep - 1)
    })
  ;['sName', 'sEmail', 'sPhone'].forEach(function (id) {
    var el = document.getElementById(id)
    if (el)
      el.addEventListener('input', function () {
        this.style.borderBottomColor = ''
        updNext()
      })
  })

  /* Lang switcher */
  var lsw = document.getElementById('langSwitcher')
  var lbtn = document.getElementById('langBtn')
  var ldd = document.getElementById('langDropdown')
  if (lsw && lbtn && ldd) {
    lbtn.addEventListener('click', function (e) {
      e.stopPropagation()
      lsw.classList.toggle('open')
    })
    document.addEventListener('click', function (e) {
      if (!lsw.contains(e.target)) lsw.classList.remove('open')
    })
    ldd.addEventListener('click', function (e) {
      e.stopPropagation()
    })
  }
})
