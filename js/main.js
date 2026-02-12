// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);


   // =================================================================
    // 2. HERO V3 ANIMATION (Cyber Industrial)
    // =================================================================
    
    // A. LOADING SEQUENCE
    const loadingCounter = document.querySelector('.loading-counter');
    let loadProgress = { val: 0 };
    
    // Timeline erstellen
    const heroTl = gsap.timeline();

    // 1. Zähler hochzählen
    if(loadingCounter) {
        heroTl.to(loadProgress, {
            val: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                loadingCounter.textContent = `SYSTEM: ${Math.round(loadProgress.val)}%`;
            }
        });
    }

    // 2. Scan Line läuft einmal durch
    heroTl.to(".hero-scan-line", {
        top: "100%",
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
    }, "<"); // Parallel zum Counter
    
    heroTl.to(".hero-scan-line", { opacity: 0, duration: 0.1 }); // Verstecken

    // 3. Text Reveal (von unten nach oben maskiert)
    heroTl.from(".hero-massive-text", {
        yPercent: 100,
        opacity: 0,
        skewY: 5,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
    }, "-=0.5");


    // 4. Portal Opening (Das Bild öffnet sich)
    heroTl.to(".portal-mask", {
        clipPath: "inset(0% 0 0% 0)", // Öffnet sich voll
        duration: 1.5,
        ease: "expo.out"
    }, "-=1.0");

    heroTl.to(".portal-inner", {
        scale: 1, // Leichter Zoom Out Effekt beim Öffnen
        duration: 1.5,
        ease: "expo.out"
    }, "<");

    heroTl.from(".hero-meta-top span, .hero-meta-bottom > *", {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: 0.8
    }, "-=1");


    // B. SCROLL PARALLAX (Kinetic Type)
    // Bewegt den Text beim Scrollen auseinander
    gsap.to(".row-top .hero-massive-text", {
        xPercent: 15, // Nach rechts
        scrollTrigger: {
            trigger: ".hero-industrial-v3",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(".row-bottom .hero-massive-text", {
        xPercent: -15, // Nach links
        scrollTrigger: {
            trigger: ".hero-industrial-v3",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
    
    // Bild bewegt sich leicht vertikal (Standard Parallax)
    gsap.to(".hero-visual-portal", {
        yPercent: 20,
        scrollTrigger: {
            trigger: ".hero-industrial-v3",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });


    // 3. TEXT REVEAL
    const revealText = document.querySelector('.reveal-paragraph');
    if(revealText) {
        const content = revealText.textContent.trim();
        revealText.innerHTML = content.split("").map(char => {
            if(char === " ") return " "; 
            return `<span class="char">${char}</span>`;
        }).join("");

        const chars = revealText.querySelectorAll('.char');
        gsap.fromTo(chars, 
            { opacity: 0.1, y: 20 },
            { 
                opacity: 1, y: 0, stagger: 0.02, duration: 0.8, ease: "power2.out",
                scrollTrigger: { trigger: revealText, start: "top 85%", end: "bottom 45%", scrub: 1 }
            }
        );
    }


    // 4. MARQUEE
    const marqueeInner = document.querySelector(".marquee-inner");
    if(marqueeInner) {
        const content = marqueeInner.innerHTML;
        marqueeInner.innerHTML = content + content + content + content;
        gsap.to(".marquee-inner", { xPercent: -25, repeat: -1, duration: 30, ease: "linear" });
    }


// 5. AXIS SCALE & REVEAL (Focus Effect)
const axisWrappers = document.querySelectorAll('.axis-wrapper');
    
axisWrappers.forEach((wrapper) => {
    const imgInner = wrapper.querySelector('.axis-img-inner');
    const leftContent = wrapper.querySelector('.axis-content-left');
    const rightContent = wrapper.querySelector('.axis-content-right');

    // Wir erstellen eine Timeline, die genau an die Scroll-Position gebunden ist
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: "top 60%",    // Startet, wenn das Element etwas über dem unteren Rand ist
            end: "bottom 40%",   // Endet, wenn das Element etwas über die Mitte hinaus ist
            scrub: 1,            // Weiches Mitbewegen beim Scrollen
            toggleActions: "play reverse play reverse"
        }
    });

    // Phase 1: Zur Mitte hin (Vergrößern & Einblenden)
    tl.to(imgInner, {
        scale: 1,
        opacity: 1,
        filter: "grayscale(0%) blur(0px)",
        duration: 1,
        ease: "power2.out"
    })
    .to([leftContent, rightContent], {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "<") // Gleichzeitig
    
    // Phase 2: Von der Mitte weg (Verkleinern & Ausblenden)
    .to(imgInner, {
        scale: 0.5,
        opacity: 0.3,
        filter: "grayscale(100%) blur(5px)",
        duration: 1,
        ease: "power2.in"
    }, ">0.2") // Kleines Delay, damit es kurz in der Mitte stehen bleibt
    .to([leftContent, rightContent], {
        x: (index) => index === 0 ? 30 : -30, // Bewegt sich wieder nach außen weg
        opacity: 0,
        duration: 1,
        ease: "power2.in"
    }, "<");
});


    // 6. INTERACTIONS (Cursor & Magnetic)
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
        document.body.classList.add('has-custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "none" });
        });
        
        const hoverTargets = document.querySelectorAll('a, button, .service-card, .footer-huge-link');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hovering'));
        });

        document.querySelectorAll('.js-magnetic').forEach((magnet) => {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            });
            magnet.addEventListener('mouseleave', () => {
                gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    });


    // 7. TIME
    function updateTime() {
        const timeDisplays = document.querySelectorAll('.time-display');
        if(timeDisplays.length > 0) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            timeDisplays.forEach(display => display.textContent = timeString);
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    window.addEventListener("load", () => ScrollTrigger.refresh());
});