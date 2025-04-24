document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Simuler des données d'articles (en production, ce serait une requête AJAX)
    const articles = [
        {
            id: 1,
            title: "Élections présidentielles : les derniers résultats",
            excerpt: "Les résultats préliminaires montrent une course serrée entre les deux principaux candidats...",
            keywords: ["élections", "présidentielles", "politique", "résultats"],
            url: "articles/elections-presidentielles.html"
        },
        {
            id: 2,
            title: "Coupe du monde : la finale en direct",
            excerpt: "Notre équipe suit minute par minute le match tant attendu de cette finale historique...",
            keywords: ["football", "coupe du monde", "sport", "finale"],
            url: "articles/coupe-du-monde.html"
        },
        {
            id: 3,
            title: "Nouvelle révolution technologique annoncée",
            excerpt: "Une startup vient de dévoiler une innovation qui pourrait changer notre quotidien...",
            keywords: ["technologie", "innovation", "startup", "révolution"],
            url: "articles/revolution-technologique.html"
        }
    ];
    
    // Recherche en temps réel
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = performSearch(query);
        displayResults(results);
    });
    
    // Recherche au clic sur le bouton
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length === 0) return;
        
        const results = performSearch(query);
        displayResults(results);
    });
    
    // Recherche avec la touche Entrée
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim().toLowerCase();
            
            if (query.length === 0) return;
            
            const results = performSearch(query);
            displayResults(results);
        }
    });
    
    function performSearch(query) {
        return articles.filter(article => {
            // Recherche dans le titre
            if (article.title.toLowerCase().includes(query)) return true;
            
            // Recherche dans les mots-clés
            if (article.keywords.some(keyword => keyword.toLowerCase().includes(query))) return true;
            
            // Recherche dans l'extrait
            if (article.excerpt.toLowerCase().includes(query)) return true;
            
            return false;
        });
    }
    
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.url;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h4>${result.title}</h4>
                <p>${result.excerpt}</p>
            `;
            searchResults.appendChild(resultItem);
        });
        
        searchResults.style.display = 'block';
    }
    
    // Cacher les résultats quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
});