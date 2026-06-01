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
