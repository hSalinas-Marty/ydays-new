/**
 * Formatte la date en "il y a X temps"
 * @param {Date} date - La date à formatter
 * @returns {string} La date formatée
 */
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

/**
 * Valide et nettoie une entrée utilisateur
 * @param {string} input - L'entrée à nettoyer
 * @returns {string} L'entrée nettoyée
 */
function sanitizeInput(input) {
    return input.trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&#34;');
}

module.exports = {
    timeAgo,
    sanitizeInput
};