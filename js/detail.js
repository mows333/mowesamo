// js/detail.js

document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. SMOOTH SCROLL
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. HERO PARALLAX
    // Titel bewegt sich langsamer als Bild
    gsap.to(".hero-bg-img img", {
        yPercent: 30, // Bild wandert nach unten
        ease: "none",
        scrollTrigger: {
            trigger: ".detail-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".detail-title", {
        yPercent: 50, // Text wandert schneller nach unten (Parallax)
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".detail-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. IMAGE REVEAL ON SCROLL
    // Bilder fahren sanft von unten rein
    const images = document.querySelectorAll(".detail-img img");
    images.forEach(img => {
        gsap.from(img, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: img,
                start: "top 85%", // Startet wenn Bild fast sichtbar ist
                toggleActions: "play none none reverse"
            }
        });
    });

    // 4. NEXT PROJECT MOUSE FOLLOWER (Optional)
    const nextSection = document.querySelector('.next-project');
    const revealImg = document.querySelector('.next-img-reveal');

    if(window.innerWidth > 900) {
        nextSection.addEventListener('mousemove', (e) => {
            // Bild folgt der Maus leicht versetzt
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            
            gsap.to(revealImg, {
                x: x * 0.3, // Bewegt sich 30% der Mausdistanz
                y: y * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

});