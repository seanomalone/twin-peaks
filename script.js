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

    // --- Interactive Map Logic ---
    const locations = [
        { id: 1, name: "Pacific Heights", coords: [37.7926, -122.4377] },
        { id: 2, name: "Embarcadero", coords: [37.7945, -122.3915] },
        { id: 3, name: "Mission Bay", coords: [37.7705, -122.3895] },
        { id: 4, name: "Bayview", coords: [37.7297, -122.3892] },
        { id: 5, name: "Excelsior", coords: [37.7246, -122.4277] },
        { id: 6, name: "Ocean Beach (South)", coords: [37.7246, -122.5082] },
        { id: 7, name: "Ocean Beach (North)", coords: [37.7593, -122.5107] },
        { id: 8, name: "Outer Richmond", coords: [37.7794, -122.5094] }
    ];

    // Route sequence based on "Best Time"
    const routeSequence = [2, 4, 7, 6, 8, 1, 5, 3];
    const routeCoords = routeSequence.map(id => locations.find(loc => loc.id === id).coords);

    // Initialize Map
    if (document.getElementById('map')) {
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([37.76, -122.45], 12);

        // Add Dark Mode Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const markers = {};

        // Add Markers
        locations.forEach(loc => {
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<span>${loc.id}</span>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker(loc.coords, { icon: customIcon })
                .bindPopup(`<strong>${loc.name}</strong>`)
                .addTo(map);

            markers[loc.id] = marker;
        });

        // Draw Route Line
        const routeLine = L.polyline(routeCoords, {
            color: '#667eea',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);

        // Fit map to route
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

        // Itinerary Interactions
        const itineraryItems = document.querySelectorAll('.itinerary-item');
        itineraryItems.forEach(item => {
            item.addEventListener('click', () => {
                const locId = parseInt(item.getAttribute('data-location'));
                const location = locations.find(loc => loc.id === locId);

                // Highlight active item
                itineraryItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Zoom to marker
                map.flyTo(location.coords, 14, {
                    duration: 1.5
                });
                markers[locId].openPopup();

                // Scroll to gallery card
                const galleryCard = document.querySelector(`.location-card[data-location="${locId}"]`);
                if (galleryCard) {
                    galleryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        // Gallery card click to map sync
        document.querySelectorAll('.location-card').forEach(card => {
            card.addEventListener('click', () => {
                const locId = parseInt(card.getAttribute('data-location'));
                const location = locations.find(loc => loc.id === locId);
                const itineraryItem = document.querySelector(`.itinerary-item[data-location="${locId}"]`);

                if (itineraryItem) {
                    itineraryItems.forEach(i => i.classList.remove('active'));
                    itineraryItem.classList.add('active');
                    itineraryItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                map.flyTo(location.coords, 14);
                markers[locId].openPopup();
            });
        });
    }
});
