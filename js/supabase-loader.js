// Konfiguration
const SUPABASE_URL = 'https://hhlugwilqskwgkxojibg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhobHVnd2lscXNrd2dreG9qaWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODQ1ODMsImV4cCI6MjA4NjU2MDU4M30.SxO-x96JToGFj2vQVS6P5aAnvG7RVlJzZ7eMk-A9-WM';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadHomepageProjects() {
    const gridContainer = document.getElementById('homepage-project-grid');
    if (!gridContainer) return;

    // 1. Daten holen (Die neuesten 4 Projekte)
    const { data: projects, error } = await _supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false }) // Neueste zuerst
        .limit(4);

    if (error) {
        console.error('Error fetching projects:', error);
        gridContainer.innerHTML = '<div style="padding:1rem">SYSTEM ERROR: DATA FETCH FAILED</div>';
        return;
    }

    // 2. HTML generieren
    let htmlContent = '';

    projects.forEach((proj, index) => {
        // Tags generieren (Services als Liste)
        // Wir nehmen max 3 Tags, damit das Layout nicht bricht
        const tagsHtml = proj.services ? proj.services.slice(0, 3).map(tag => 
            `<li>${tag}</li>`
        ).join('') : '';

        // Nummerierung formatieren (01, 02...)
        const displayNum = (index + 1).toString().padStart(2, '0');

        htmlContent += `
        <a href="project-detail.html?slug=${proj.slug}" class="service-card project-card-link" style="text-decoration: none; display: block;">
            <div class="card-bg">
                <img src="${proj.thumbnail_url}" alt="${proj.title}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="card-top">
                    <span class="card-num">${proj.project_id || displayNum}</span>
                    <h3 class="card-title">${proj.title}</h3>
                </div>
                <div class="card-bottom">
                    <ul class="card-tags">
                        ${tagsHtml}
                    </ul>
                    <span class="card-arrow">↗</span>
                </div>
            </div>
        </a>
        `;
    });

    // 3. In den DOM einfügen
    gridContainer.innerHTML = htmlContent;

    // 4. WICHTIG: GSAP Refresh und Event Listener neu binden
    // Da die Elemente neu sind, funktionieren die Hover-Effekte aus main.js evtl. nicht sofort
    // wenn sie beim Load gebunden wurden. Wir müssen den Cursor-Hover neu initialisieren.
    
    setTimeout(() => {
        if(ScrollTrigger) ScrollTrigger.refresh();
        
        // Re-attach Cursor Hover Effects für die neuen Cards
        const cursorDot = document.querySelector('.cursor-dot');
        const newCards = document.querySelectorAll('.service-card');
        
        if(cursorDot) {
            newCards.forEach(el => {
                el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hovering'));
                el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hovering'));
            });
        }
    }, 100);
}

// Funktion aufrufen, wenn DOM bereit ist
document.addEventListener("DOMContentLoaded", () => {
    loadHomepageProjects();
});
