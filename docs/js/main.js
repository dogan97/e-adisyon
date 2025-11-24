// Main JavaScript file for E-Adisyon website

document.addEventListener('DOMContentLoaded', function() {
    console.log('E-Adisyon website loaded');
    initNavbar();
    initSmoothScroll();
    initAnimations();
    setupMenuSystem();
    initCarouselSwipe();
});

/**
 * Initialize Carousel Swipe Support for Desktop (Mouse Drag)
 */
function initCarouselSwipe() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    
    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'default';
    });

    carousel.addEventListener('mouseup', (e) => {
        if (!isDown) return;
        isDown = false;
        carousel.style.cursor = 'default';
        const endX = e.pageX - carousel.offsetLeft;
        const distance = endX - startX;
        
        // Threshold for swipe detection
        if (Math.abs(distance) > 50) {
            const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carousel);
            if (distance > 0) {
                bsCarousel.prev();
            } else {
                bsCarousel.next();
            }
        }
    });
    
    // Prevent default drag behavior on images
    carousel.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

/**
 * Tüm menü sistemini kuran ana fonksiyon
 * - Hamburger menü ve dropdown menü etkileşimlerini yönetir
 */
function setupMenuSystem() {
    const isMobile = window.innerWidth < 992;
    
    // Bootstrap menü davranışlarını kaldır ve kendi özel davranışlarımızı ekle
    disableDefaultMenuBehaviors();
    setupCustomHamburgerMenu();
    setupCustomDropdownMenus();
    
    // Pencere boyutu değiştiğinde yeniden kontrol et
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth < 992;
        if (newIsMobile !== isMobile) {
            // Sayfayı yenile
            window.location.reload();
        }
    });
}

/**
 * Bootstrap menü davranışlarını kaldır
 */
function disableDefaultMenuBehaviors() {
    // Bootstrap dropdown menü özelliklerini devre dışı bırak
    document.querySelectorAll('[data-bs-toggle]').forEach(element => {
        // Özellikleri kaldır, ancak elementlerin kendisini muhafaza et
        element.removeAttribute('data-bs-toggle');
        element.removeAttribute('data-bs-target');
    });
    
    // Dropdown menü linklerindeki varsayılan tıklama olayını önle
    document.querySelectorAll('.dropdown-toggle, .dropdown > a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    // Tüm menüleri gizle (mobil görünümdeki CSS sınıfları ekle)
    addMobileMenuStyles();
}

/**
 * Özel hamburger menü davranışı ekle
 */
function setupCustomHamburgerMenu() {
    const navbar = document.querySelector('.header');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Toggle butonuna event listener ekle (clone ve replace yöntemi ile)
    if (navbarToggler && navbarCollapse) {
        // Clone ve replace yaparak tüm event listener'ları temizle
        const newToggler = navbarToggler.cloneNode(true);
        navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
        
        // Yeni toggle olayı ekle
        newToggler.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Olayın yukarıya yayılmasını önle
            
            // Hamburger menüyü aç/kapat
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                newToggler.setAttribute('aria-expanded', 'false');
            } else {
                navbarCollapse.classList.add('show');
                newToggler.setAttribute('aria-expanded', 'true');
            }
        });
    }
    
    // Navbar dışı tıklamaları için event listener
    document.addEventListener('click', function(e) {
        // Eğer navbar dışına tıklandıysa ve dropdown içinde değilse hamburger menüyü kapat
        const isOutsideNavbar = !navbar.contains(e.target) && 
                               !e.target.closest('.navbar-toggler');
        
        if (isOutsideNavbar && navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
            if (navbarToggler) {
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * Özel dropdown menü davranışları ekle
 */
function setupCustomDropdownMenus() {
    console.log('Setting up custom dropdown menus');
    const isMobile = window.innerWidth < 992;
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    // Her dropdown için tıklama olayı oluştur
    dropdownItems.forEach((dropdown, index) => {
        console.log(`Setting up dropdown ${index+1}`);
        const toggleLink = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (toggleLink && dropdownMenu) {
            // Bootstrap'in varsayılan dropdown davranışını tamamen kaldır
            toggleLink.setAttribute('data-dropdown-state', 'closed');
            toggleLink.removeAttribute('data-bs-toggle');
            
            // Önceki event listener'ları kaldırmak için klonlama yöntemi
            const newToggleLink = toggleLink.cloneNode(true);
            toggleLink.parentNode.replaceChild(newToggleLink, toggleLink);
            
            // Yeni temiz event listener ekle
            newToggleLink.addEventListener('click', function(e) {
                console.log('Dropdown toggle clicked');
                e.preventDefault();
                e.stopPropagation();
                
                // Dropdown state'ini al
                const currentState = this.getAttribute('data-dropdown-state');
                console.log('Current dropdown state:', currentState);
                
                // Tüm diğer dropdown'ları kapat
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('show');
                        const parentDropdown = menu.closest('.dropdown');
                        if (parentDropdown) {
                            const parentLink = parentDropdown.querySelector('a');
                            if (parentLink) parentLink.setAttribute('data-dropdown-state', 'closed');
                        }
                    }
                });
                
                // Önce tüm diğer açık dropdown'ları kapat
                closeAllDropdowns(this);
                    
                // Bu dropdown'u aç/kapat
                if (currentState === 'closed') {
                    console.log('Opening dropdown');
                    dropdownMenu.classList.add('show');
                    this.setAttribute('data-dropdown-state', 'open');
                    this.classList.add('dropdown-open');
                    
                    // Menü açıldığında özel sınıf ekle
                    dropdown.classList.add('dropdown-active');
                    
                    // Ok simgesini döndür
                    const indicator = this.querySelector('.dropdown-indicator i');
                    if (indicator) {
                        indicator.style.transform = 'rotate(180deg)';
                    }
                } else {
                    console.log('Closing dropdown');
                    closeDropdown(this, dropdownMenu);
                }
                
                // Tüm dropdown'ları kapatma yardımcı fonksiyonu
                function closeAllDropdowns(currentToggle) {
                    document.querySelectorAll('.dropdown-toggle.dropdown-open').forEach(toggle => {
                        if (toggle !== currentToggle) {
                            const menu = document.querySelector(`[aria-labelledby="${toggle.id}"]`);
                            if (menu) {
                                closeDropdown(toggle, menu);
                            }
                        }
                    });
                }
                
                // Tek dropdown'u kapatma yardımcı fonksiyonu
                function closeDropdown(toggle, menu) {
                    menu.classList.remove('show');
                    toggle.setAttribute('data-dropdown-state', 'closed');
                    toggle.classList.remove('dropdown-open');
                    
                    // Menü kapandığında özel sınıfı kaldır
                    toggle.closest('.dropdown').classList.remove('dropdown-active');
                    
                    // Ok simgesini normal konuma getir
                    const indicator = toggle.querySelector('.dropdown-indicator i');
                    if (indicator) {
                        indicator.style.transform = 'rotate(0deg)';
                    }
                }
                
                return false;
            });
        }
    });
    
    // Mobil/desktop davranışları için ek kodlar
    if (isMobile) {
        // Mobil görünüm için sadece tıklama olayı yeterli, yukarıda ekledik
    } else {
        // Masaüstü görünüm için hover devre dışı olmalı ve CSS sınıfı ekle
        dropdownItems.forEach(dropdown => {
            // Hover ile açılma davranışı ekle (isteğe bağlı)
            dropdown.addEventListener('mouseenter', function() {
                const menu = this.querySelector('.dropdown-menu');
                const link = this.querySelector('a');
                if (menu && link) {
                    menu.classList.add('show');
                    link.setAttribute('data-dropdown-state', 'open');
                }
            });
            
            dropdown.addEventListener('mouseleave', function() {
                const menu = this.querySelector('.dropdown-menu');
                const link = this.querySelector('a');
                if (menu && link) {
                    menu.classList.remove('show');
                    link.setAttribute('data-dropdown-state', 'closed');
                }
            });
        });
    }
}

/**
 * Mobil menü için özel CSS ekle
 */

/**
 * Add special mobile menu styles dynamically
 */
function addMobileMenuStyles() {
    // Eğer stil zaten varsa çık
    if (document.getElementById('mobile-menu-styles')) {
        document.getElementById('mobile-menu-styles').remove();
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'mobile-menu-styles';
    styleElement.textContent = `
        /* Menüler için genel stil */
        .dropdown-menu {
            display: none !important;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        /* .show sınıfı olan menülerin görünümü */
        .dropdown-menu.show {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        /* Mobil cihazlar için özel stiller */
        @media (max-width: 991.98px) {
            /* Menü açılıp kapanma animasyonu */
            .dropdown-menu.show {
                position: static !important;
                transform: none !important;
                float: none;
                width: 100%;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                box-shadow: none;
                border: none;
                padding: 0.5rem;
                background-color: rgba(80, 123, 65, 0.05);
            }
            
            /* Dropdown toggle durumu için özel sınıf */
            .dropdown-active > a {
                background-color: rgba(80, 123, 65, 0.1);
                color: #507b41 !important;
            }
            
            .business-grid {
                display: grid;
                grid-template-columns: 1fr;
            }
            
            .dropdown-menu-large {
                width: 100% !important;
                max-width: 100% !important;
                padding: 0.5rem !important;
            }
            
            .navbar-nav .nav-link {
                padding: 0.75rem 1rem !important;
            }
            
            .navbar-collapse {
                max-height: 80vh;
                overflow-y: auto;
            }
            
            /* Dropdown içerik butonlarının görünümü */
            .dropdown-menu a {
                padding: 0.75rem 1rem;
                display: block;
                border-radius: 4px;
            }
            
            .dropdown-menu a:hover {
                background-color: rgba(80, 123, 65, 0.05);
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

/**
 * Setup desktop specific menu behavior (hover dropdowns)
 */
function setupDesktopMenus() {
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    dropdownItems.forEach(item => {
        const toggle = item.querySelector('.dropdown-toggle');
        
        // Hover açma/kapama özelliği
        item.addEventListener('mouseenter', function() {
            const content = this.querySelector('.dropdown-menu');
            if (content) {
                content.classList.add('show');
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const content = this.querySelector('.dropdown-menu');
            if (content) {
                content.classList.remove('show');
            }
        });
    });
}

/**
 * Initialize navbar functionality
 * - Navbar scroll effect (change background on scroll)
 * - Mobile menu handling
 */
function initNavbar() {
    const navbar = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link:not([data-toggle="dropdown"])');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // ÖNEMLİ: Bootstrap'in tüm varsayılan menü davranışını kaldır
    disableAllBootstrapMenuBehaviors();
    
    // Hamburger menü toggle davranışını manuel olarak ekle
    if (navbarToggler) {
        // Mevcut tüm click olaylarını kaldır
        const newToggler = navbarToggler.cloneNode(true);
        navbarToggler.parentNode.replaceChild(newToggler, navbarToggler);
        
        // Yeni toggle davranışı ekle
        newToggler.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Sadece normal sayfa linklerine tıklandığında hamburger menüyü kapat
    // Bu dropdown menüleri etkilemeyecek
    navLinks.forEach(link => {
        if (!link.classList.contains('dropdown-toggle') && 
            !link.hasAttribute('data-toggle') &&
            !link.closest('.dropdown')) {
            
            link.addEventListener('click', function(e) {
                // Sadece normal linkler için kapanma davranışı
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
                
                // Aktif link güncelleme
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });
    
    // Navbar dışına tıklandığında hamburger menüyü kapat
    document.addEventListener('click', function(e) {
        // Hamburger menü veya navbar içinde değilse kapat
        const isOutsideNavbar = !navbar.contains(e.target) && 
                              !e.target.closest('.navbar-toggler') &&
                              !e.target.closest('.navbar-collapse');
                              
        if (isOutsideNavbar && navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
}

/**
 * Bootstrap'in tüm menü davranışlarını devre dışı bırak
 */
function disableAllBootstrapMenuBehaviors() {
    // Bootstrap'in data attr'lerini kaldır
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(el => {
        el.removeAttribute('data-bs-toggle');
    });
    
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
        el.removeAttribute('data-bs-toggle');
    });
    
    // Navbar toggler'dan bootstrap özelliklerini kaldır
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        toggler.removeAttribute('data-bs-toggle');
        toggler.removeAttribute('data-bs-target');
        toggler.setAttribute('type', 'button');
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Ignore links with no real target
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-based animations 
 */
function initAnimations() {
    // Simple scroll-based animation for sections
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

/**
 * Initialize counters for statistics (currently placeholder)
 */
function initCounters() {
    const counterElements = document.querySelectorAll('.counter');
    
    counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps 
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}
