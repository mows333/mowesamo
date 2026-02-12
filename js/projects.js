// js/projects.js

document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // --- VARIABLES ---
    const previewContainer = document.querySelector('.project-preview-fixed');
    const previewImg = document.querySelector('#preview-img');
    const rowsContainer = document.querySelector('#project-container');
    const rows = document.querySelectorAll('.project-row');
    const listHeader = document.querySelector('.list-header');
    
    let isGridView = false;

    // --- 0. HERO ANIMATION (NEW) ---
    // Loading Counter
    const counter = document.querySelector('.loading-counter');
    let loadObj = { val: 0 };
    
    const heroTl = gsap.timeline();
    
    // 1. Counter up
    if(counter) {
        heroTl.to(loadObj, {
            val: 100, duration: 1, ease: "power2.inOut",
            onUpdate: () => counter.textContent = `LOAD: ${Math.round(loadObj.val)}%`
        });
    }

    // 2. Scanline & Grid Intro
    heroTl.to('.hero-scan-line', { top: '100%', opacity: 1, duration: 1 }, "<");
    heroTl.to('.hero-scan-line', { opacity: 0, duration: 0.1 });

    // 3. Text Reveal (Slide up)
    heroTl.from('.hero-massive-text', {
        y: 100, opacity: 0, skewY: 5, duration: 1, stagger: 0.1, ease: "power4.out"
    }, "-=0.5");
    
    // 4. Show Toolbar & List
    heroTl.from('.archive-toolbar, .list-header', {
        y: 20, opacity: 0, duration: 0.8, ease: "power2.out"
    }, "-=0.5");
    
    heroTl.from('.project-row', {
        y: 30, opacity: 0, stagger: 0.05, duration: 0.8, ease: "power2.out"
    }, "-=0.6");

    // Scroll Parallax for Hero Text
    gsap.to('.row-left', { xPercent: 10, scrollTrigger: { trigger: '.hero-archive', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.row-right', { xPercent: -10, scrollTrigger: { trigger: '.hero-archive', start: 'top top', end: 'bottom top', scrub: 1 } });


    // --- 1. MOUSE FOLLOWER ---
    gsap.set(previewContainer, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => {
        if(isGridView) return;
        gsap.to(previewContainer, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
    });


    // --- 2. VIEW SWITCHER ---
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.classList.contains('active')) return;
            const viewType = btn.getAttribute('data-view');
            
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            gsap.to(rowsContainer, { opacity: 0, duration: 0.2, onComplete: () => {
                if (viewType === 'grid') {
                    isGridView = true;
                    rowsContainer.classList.add('is-grid');
                    listHeader.style.display = 'none';
                    gsap.set(previewContainer, { autoAlpha: 0 }); // Preview killen
                } else {
                    isGridView = false;
                    rowsContainer.classList.remove('is-grid');
                    listHeader.style.display = 'grid';
                    gsap.set(rows, { opacity: 1 });
                }
                gsap.to(rowsContainer, { opacity: 1, duration: 0.3 });
                ScrollTrigger.refresh();
            }});
        });
    });


    // --- 3. HOVER LOGIC ---
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            if (isGridView) return;
            const imgSrc = row.getAttribute('data-img');
            previewImg.src = imgSrc;

            gsap.killTweensOf(previewContainer);
            gsap.to(previewContainer, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
            
            rows.forEach(r => {
                if(r !== row) gsap.to(r, { opacity: 0.3, duration: 0.2 });
                else gsap.to(r, { opacity: 1, duration: 0.2 });
            });
        });

        row.addEventListener('mouseleave', () => {
            if (isGridView) return;
            gsap.to(previewContainer, { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: "power2.in", overwrite: "auto" });
            gsap.to(rows, { opacity: 1, duration: 0.2 });
        });
    });


    // --- 4. FILTER LOGIC ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.classList.contains('active')) return;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            const targets = document.querySelectorAll('.project-row');
            
            gsap.to(targets, { opacity: 0, y: 15, duration: 0.2, onComplete: () => {
                targets.forEach(row => {
                    const category = row.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        row.style.display = isGridView ? "block" : "grid"; 
                    } else {
                        row.style.display = "none";
                    }
                });
                gsap.to(targets, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
                ScrollTrigger.refresh();
            }});
        });
    });
});