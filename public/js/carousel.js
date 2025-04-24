function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const inner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    let currentIndex = 0;
    const itemCount = items.length;
    
    // Cloner le premier et dernier élément pour un défilement infini
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[itemCount - 1].cloneNode(true);
    
    inner.appendChild(firstClone);
    inner.insertBefore(lastClone, items[0]);
    
    // Mettre à jour la position initiale
    currentIndex = 1;
    inner.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Gestion des boutons précédent/suivant
    nextBtn.addEventListener('click', () => {
        if (currentIndex >= itemCount + 1) return;
        currentIndex++;
        inner.style.transition = 'transform 0.5s ease';
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Réinitialiser pour un défilement infini
        if (currentIndex === itemCount + 1) {
            setTimeout(() => {
                inner.style.transition = 'none';
                currentIndex = 1;
                inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 500);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex <= 0) return;
        currentIndex--;
        inner.style.transition = 'transform 0.5s ease';
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Réinitialiser pour un défilement infini
        if (currentIndex === 0) {
            setTimeout(() => {
                inner.style.transition = 'none';
                currentIndex = itemCount;
                inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }, 500);
        }
    });
    
    // Défilement automatique
    let autoScroll = setInterval(() => {
        nextBtn.click();
    }, 5000);
    
    // Arrêter le défilement automatique au survol
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoScroll);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
            nextBtn.click();
        }, 5000);
    });
    
    // Gestion du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    inner.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    inner.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextBtn.click();
        }
        if (touchEndX > touchStartX + 50) {
            prevBtn.click();
        }
    }
}