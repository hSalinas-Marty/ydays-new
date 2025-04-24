document.addEventListener('DOMContentLoaded', function() {
    updateAllTimeAgo();
    
    // Mettre à jour toutes les minutes
    setInterval(updateAllTimeAgo, 60000);
});

function updateAllTimeAgo() {
    const timeElements = document.querySelectorAll('.time-ago');
    
    timeElements.forEach(element => {
        const dateString = element.getAttribute('data-date');
        const date = new Date(dateString);
        element.textContent = timeAgo(date);
    });
}

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