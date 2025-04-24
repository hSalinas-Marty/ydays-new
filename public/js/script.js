// Chargement des articles
document.addEventListener('DOMContentLoaded', function() {
    // Simuler le chargement des articles (en production, ce serait une requête AJAX)
    loadArticles();
    loadCategories();
    setupMobileMenu();
});

function loadArticles() {
    // En production, cela serait une requête à votre API/backend
    const articles = [
        {
            id: 1,
            title: "Élections présidentielles : les derniers résultats",
            excerpt: "Les résultats préliminaires montrent une course serrée entre les deux principaux candidats...",
            image: "images/politics.jpg",
            category: "Politique",
            date: new Date(Date.now() - 3600000 * 3), // il y a 3 heures
            url: "articles/elections-presidentielles.html"
        },
        {
            id: 2,
            title: "Coupe du monde : la finale en direct",
            excerpt: "Notre équipe suit minute par minute le match tant attendu de cette finale historique...",
            image: "images/sport.jpg",
            category: "Sport",
            date: new Date(Date.now() - 3600000), // il y a 1 heure
            url: "articles/coupe-du-monde.html"
        },
        {
            id: 3,
            title: "Nouvelle révolution technologique annoncée",
            excerpt: "Une startup vient de dévoiler une innovation qui pourrait changer notre quotidien...",
            image: "images/tech.jpg",
            category: "Technologie",
            date: new Date(Date.now() - 3600000 * 5), // il y a 5 heures
            url: "articles/revolution-technologique.html"
        },
        {
            id: 4,
            title: "Crise économique : les mesures du gouvernement",
            excerpt: "Le premier ministre a annoncé ce matin un plan d'urgence pour soutenir l'économie...",
            image: "images/economy.jpg",
            category: "Politique",
            date: new Date(Date.now() - 3600000 * 2), // il y a 2 heures
            url: "articles/crise-economique.html"
        }
    ];

    // Charger le carrousel
    const carousel = document.getElementById('breaking-news-carousel');
    const grid = document.getElementById('articles-grid');
    
    // Trier les articles par date (du plus récent au plus ancien)
    articles.sort((a, b) => b.date - a.date);
    
    // Ajouter les 3 premiers articles au carrousel
    articles.slice(0, 3).forEach(article => {
        carousel.appendChild(createCarouselItem(article));
    });
    
    // Ajouter tous les articles à la grille
    articles.forEach(article => {
        grid.appendChild(createArticleCard(article));
    });
    
    // Initialiser le carrousel
    initCarousel();
}

function createCarouselItem(article) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    
    item.innerHTML = `
        <img src="${article.image}" alt="${article.title}">
        <div class="carousel-content">
            <span class="article-category">${article.category}</span>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <a href="${article.url}" class="read-more">Lire la suite</a>
            <div class="article-meta">
                <span class="time-ago" data-date="${article.date.toISOString()}">${timeAgo(article.date)}</span>
            </div>
        </div>
    `;
    
    return item;
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    card.innerHTML = `
        <div class="article-image">
            <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="article-content">
            <span class="article-category">${article.category}</span>
            <h3>${article.title}</h3>
            <div class="article-meta">
                <span class="time-ago" data-date="${article.date.toISOString()}">${timeAgo(article.date)}</span>
            </div>
            <p>${article.excerpt}</p>
            <a href="${article.url}" class="read-more">Lire la suite</a>
        </div>
    `;
    
    return card;
}

function loadCategories() {
    // En production, cela serait une requête à votre API/backend
    const categories = ['Politique', 'Sport', 'Technologie', 'Économie', 'Culture'];
    const dropdown = document.getElementById('categories-dropdown');
    
    categories.forEach(category => {
        const link = document.createElement('a');
        link.href = `categories/${category.toLowerCase()}.html`;
        link.textContent = category;
        dropdown.appendChild(link);
    });
}

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Fonction utilitaire pour afficher "il y a X heures"
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `il y a ${interval} an${interval > 1 ? 's' : ''}`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `il y a ${interval} mois`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `il y a ${interval} jour${interval > 1 ? 's' : ''}`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `il y a ${interval} heure${interval > 1 ? 's' : ''}`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `il y a ${interval} minute${interval > 1 ? 's' : ''}`;
    
    return 'à l\'instant';
}