const imgs = document.querySelectorAll('.row image')
const tls = []

gsap.set('image', {
  attr: {
    preserveAspectRatio: "xMidYMid slice",
    width: "390",
    height: "300",
    'clip-path': "url(#cp1)"
  }
})

gsap.set('.row', {
  y: (i) => 160 + i * 320,
  rotate: -15,
  svgOrigin: '350 350'
})

imgs.forEach((img, i) => {
  const tl = gsap.timeline({
    defaults: { duration: 1, ease: 'none' },
    paused: true,
    repeat: -1
  })
    .fromTo(img, { x: -400 }, { x: 1600 })
    .progress(i % 5 / 5)

  tls.push(tl)
})

gsap.ticker.add(() => {
  tls.forEach((tl, i) => {
    const speed = i < 8 ? 0.0008 : 0.0005
    tl.progress(
      gsap.utils.wrap(0, 1, tl.progress() + speed)
    )
  })
})

Observer.create({
  target: window,
  type: "wheel,touch,drag",
  onRight: prev,
  onUp: prev,
  onLeft: next,
  onDown: next
})

function prev() {
  tls.forEach((tl, i) => {
    gsap.to(tl, {
      progress: () => (i < 8 ? '+=0.03' : '+=0.02'),
      modifiers: {
        progress: (p) => gsap.utils.wrap(0, 1, p)
      },
      ease: 'power2',
      duration: 0.4
    })
  })
}

function next() {
  tls.forEach((tl, i) => {
    gsap.to(tl, {
      progress: () => (i < 8 ? '-=0.03' : '-=0.02'),
      modifiers: {
        progress: (p) => gsap.utils.wrap(0, 1, p)
      },
      ease: 'power2',
      duration: 0.4
    })
  })
}

function logout() {
  localStorage.removeItem('audioTime');
  window.location.href = '/logout'
}

document.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById("bg-music");
  audio.volume = 0.9;

  var savedTime = localStorage.getItem('audioTime');
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  audio.addEventListener('timeupdate', function () {
    localStorage.setItem('audioTime', audio.currentTime);
  });

  var playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("Autoplay prevented. Waiting for user interaction.");
      document.body.addEventListener('click', function () {
        audio.play();
      }, { once: true });
    });
  }
});