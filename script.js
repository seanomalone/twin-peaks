// Twin Peaks Showcase - Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all location cards
    document.querySelectorAll('.location-card').forEach(card => {
        observer.observe(card);
    });

    // Parallax effect for hero
    let lastScrollY = window.scrollY;
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (hero && scrollY < window.innerHeight) {
            hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.6;
            hero.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
        lastScrollY = scrollY;
    }, { passive: true });

    // Add loading class removal for images
    const images = document.querySelectorAll('.image-container img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // Add click tracking for analytics (placeholder)
    document.querySelectorAll('.view-on-maps').forEach(link => {
        link.addEventListener('click', (e) => {
            const locationName = e.target.closest('.location-card')?.querySelector('.location-name')?.textContent;
            console.log(`Maps link clicked: ${locationName}`);
            // Add analytics tracking here if needed
        });
    });

    // Easter egg: Konami code for special effect
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateSpecialEffect();
        }
    });

    function activateSpecialEffect() {
        document.body.style.animation = 'rainbow 3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});
