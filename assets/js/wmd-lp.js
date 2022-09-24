jQuery.noConflict();

// masthead animation
var textPath = document.querySelector('#text-path')

function updateTextPathOffset(offset) {
  textPath.setAttribute ('startOffset', offset)
}

function onScroll() {
  requestAnimationFrame(function() {
    updateTextPathOffset(window.scrollY * 1.5)
  })
}

window.addEventListener ('scroll', onScroll);

const titles = document.querySelectorAll('.anim');

observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting == true) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  })
})

titles.forEach(title => {
  observer.observe(title);
})

let cursor = document.querySelector('.cursor');
let cursorScale = document.querySelectorAll('.cursor-scale'); 
let sideNavLink = document.querySelectorAll('.sidenav li'); 
let mouseX = 0;
let mouseY = 0;

gsap.to({}, 0.016, {
  repeat: -1,
  onRepeat: function(){
    gsap.set(cursor, {
      css: {
        left: mouseX,
        top: mouseY,
      }
    })
  }
});


window.addEventListener('mousemove', (e)=> {
  mouseX = e.clientX;
  mouseY = e.clientY;
})

  cursorScale.forEach(textlink => {
    textlink.addEventListener('mousemove', ()=> {
      cursor.classList.add('grow'); 
      if (textlink.classList.contains('small')){
        cursor.classList.remove('grow');
        cursor.classList.add('grow-small');
      }
    });

        
    textlink.addEventListener('mouseleave', ()=> {
      cursor.classList.remove('grow');
      cursor.classList.remove('grow-small');
    });
  });

  sideNavLink.forEach(links => {
      links.addEventListener('mousemove', ()=> {
      cursor.classList.add('grow'); 
      if (links.classList.contains('small')){
        cursor.classList.remove('grow');
        cursor.classList.add('grow-small');
      }
    });

    links.addEventListener('mouseleave', ()=> {
      cursor.classList.remove('grow');
      cursor.classList.remove('grow-small');
    });
  })


// Horizontal scroll trigger effect services section
gsap.registerPlugin(ScrollTrigger);

let duration = 10,
		sections = gsap.utils.toArray(".services"),
		sectionIncrement = duration / (sections.length - 1),
		tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".services-container",
				pin: true,
				scrub: 1,
        snap: 1 / (sections.length - 1),
				start: "center center",
				end: "+=4000"
			}
		});

tl.to(sections, {
  xPercent: -100 * (sections.length - 1),
  duration: duration,
  ease: "none"
});


// everything below this is just for the fading/scaling up which is NOT scrubbed - it's all dynamic, triggered when each section enters/leaves so that the fading/scaling occurs at a consistent rate no matter how fast you scroll!
sections.forEach((section, index) => {
  let tween = gsap.from(section, {
    opacity: 0, 
    scale: 0.6, 
    duration: 1, 
    force3D: true, 
    paused: true
  });
  
  addSectionCallbacks(tl, {
    start: sectionIncrement * (index - 0.99),
    end: sectionIncrement * (index + 0.99),
    onEnter: () => tween.play(),
    onLeave: () => tween.reverse(),
    onEnterBack: () => tween.play(),
    onLeaveBack: () => tween.reverse()
  });
  
  index || tween.progress(1); // the first tween should be at its end (already faded/scaled in)
});

// helper function that lets us define a section in a timeline that spans between two times (start/end) and lets us add onEnter/onLeave/onEnterBack/onLeaveBack callbacks
function addSectionCallbacks(timeline, {start, end, param, onEnter, onLeave, onEnterBack, onLeaveBack}) {
  let trackDirection = animation => { // just adds a "direction" property to the animation that tracks the moment-by-moment playback direction (1 = forward, -1 = backward)
    let onUpdate = animation.eventCallback("onUpdate"), // in case it already has an onUpdate
        prevTime = animation.time();
    animation.direction = animation.reversed() ? -1 : 1;
    animation.eventCallback("onUpdate", () => {
      let time = animation.time();
      if (prevTime !== time) {
        animation.direction = time < prevTime ? -1 : 1;
        prevTime = time;
      }
      onUpdate && onUpdate.call(animation);
    });
  },
  empty = v => v; // in case one of the callbacks isn't defined
  timeline.direction || trackDirection(timeline); // make sure direction tracking is enabled on the timeline
  start >= 0 && timeline.add(() => ((timeline.direction < 0 ? onLeaveBack : onEnter) || empty)(param), start);
  end <= timeline.duration() && timeline.add(() => ((timeline.direction < 0 ? onEnterBack : onLeave) || empty)(param), end);
}

// Team Section Animation
function animateFrom(elem, direction) {
  direction = direction || 1;
  var x = 0,
      y = direction * 100;

  if(elem.classList.contains("gs_reveal_fromLeft")) {
    x = -100;
    y = 0;

  } else if (elem.classList.contains("gs_reveal_fromRight")) {
    x = 100;
    y = 0;
  }

  elem.style.opacity = "0";
  gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
    duration: 1.25, 
    x: 0,
    y: 0, 
    autoAlpha: 1, 
    ease: "expo", 
    overwrite: "auto"
  });

  gsap.fromTo(".team-line", {scaleX: 0, transformOrigin: "right center"}, {
    scaleX: 1, 
  });

  gsap.fromTo(".name-upperPart", {duration: 0.75, y: 30 }, {
    y: 0,
  });

  gsap.fromTo(".name-lowerPart", {duration: 0.75, y: -30 }, {
    y: 0,
  });
}

function hide(elem) {
  gsap.set(elem, {autoAlpha: 0});
}

document.addEventListener("DOMContentLoaded", function() {  
  gsap.utils.toArray(".gs_reveal").forEach(function(elem) {
    hide(elem); // assure that the element is hidden when scrolled into view
    
    ScrollTrigger.create({
      trigger: elem,
      onEnter: function() { animateFrom(elem) }, 
      onEnterBack: function() { animateFrom(elem, -1) },
      onLeave: function() { hide(elem) } // assure that the element is hidden when scrolled into view
    });
  });
});


// Masking JS of services section
const svg = document.querySelector("#svg-mask");
const img = document.querySelector("#fixed-image");
const maskTitle = document.querySelector(".mask__title");
const chevron = document.querySelector("#inner-mask");

gsap.set(maskTitle, {
  y: chevron.getBoundingClientRect().height / 2
});
gsap.set(chevron, {
  transformOrigin: "center center"
});

const imageContainers = document.querySelectorAll(".content__image--animate");
imageContainers.forEach(imageContainer => {
  const imageAnim = gsap.to(imageContainer.querySelector('img'), {
    // ease: 'none',
    paused: true,
    yPercent: parseFloat(imageContainer.dataset.offsetY) || 0,
    duration: parseFloat(imageContainer.dataset.scrub) || 0.1
  });

  ScrollTrigger.create({
    animation: imageAnim,
    scrub: true,
    trigger: imageContainer,
    start: "top center",
    end: "bottom top"
  });
});

// Setup a timeline for the Mask and text
var timeL = gsap.timeline({
  scrollTrigger: {
    trigger: '.--mask',
    pin: true,
    start: "top top",
    end: '+=925',
    scrub: 0.2,
    pinSpacing: false
  },
  defaults: {
    duration: 2,
    ease: "power3"
  }
}).to(maskTitle, {
  opacity: 0,
  duration: 0.15
}, 0).to(chevron, {
  scale: 35,
  yPercent: -550,
  duration: 4
}, 0); 


// Fade in the text
gsap.set(".content__text", {
  y: 50
});

ScrollTrigger.batch(".content__text", {
  interval: 0.2,
  batchMax: 2,
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    overwrite: true
  }),
  onLeave: batch => gsap.set(batch, {
    opacity: 0,
    y: -50,
    overwrite: true
  }),
  onEnterBack: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    overwrite: true
  }),
  onLeaveBack: batch => gsap.set(batch, {
    opacity: 0,
    y: 50,
    overwrite: true
  }),
  start: "top bottom",
  end: "bottom top",
  // markers: true
}); 

window.addEventListener("load", init);
window.addEventListener("resize", resize);

function init() {
  resize();
}

function resize() {
  timeL.progress(0);
  timeL.invalidate();
  ScrollTrigger.refresh();
}

ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".content__text", {
  y: 0
}));

