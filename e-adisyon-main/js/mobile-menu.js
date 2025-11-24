// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburgerButton = document.querySelector('.hamburger-button');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuToggles = document.querySelectorAll('.mobile-menu-toggle');
    
    // Open mobile menu
    hamburgerButton.addEventListener('click', function() {
        mobileMenuContainer.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close mobile menu function
    function closeMobileMenu() {
        mobileMenuContainer.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Enable scrolling
    }
    
    // Close mobile menu events
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
        // Function to toggle submenu
    function toggleSubmenu(parentLi) {
        const submenu = parentLi.querySelector('.mobile-submenu');
        const icon = parentLi.querySelector('.mobile-menu-toggle i');
        
        if (!submenu || !icon) return;
        
        if (submenu.classList.contains('open')) {
            submenu.classList.remove('open');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            // Close other open submenus
            document.querySelectorAll('.mobile-submenu.open').forEach(function(openSubmenu) {
                if (openSubmenu !== submenu) {
                    openSubmenu.classList.remove('open');
                    const openIcon = openSubmenu.closest('li').querySelector('.mobile-menu-toggle i');
                    if (openIcon) {
                        openIcon.classList.remove('fa-chevron-up');
                        openIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            submenu.classList.add('open');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
    
    // Toggle submenus when clicking on toggle buttons
    mobileMenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.closest('li');
            toggleSubmenu(parentLi);
        });
    });
    
    // Toggle submenus when clicking on menu links that have submenus
    document.querySelectorAll('.mobile-menu-item a.mobile-menu-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const parentLi = this.closest('li');
            const hasSubmenu = parentLi.querySelector('.mobile-submenu');
            
            // Only prevent default and toggle if there is a submenu
            if (hasSubmenu) {
                e.preventDefault();
                toggleSubmenu(parentLi);
            }
            // If no submenu, let the link work normally (navigation)
        });
    });
    
    // Close mobile menu when window resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }
    });
    
    // Handle all links in mobile menu including hash links (e.g. #demo)
    const allMobileLinks = document.querySelectorAll('.mobile-menu-container a');
    allMobileLinks.forEach(function(link) {
        // Skip toggle buttons or links that open submenus
        if (link.classList.contains('mobile-menu-toggle') || link.getAttribute('href') === '#') {
            return;
        }
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a hash link (internal page anchor)
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent default anchor behavior
                
                // First close the mobile menu
                closeMobileMenu();
                
                // Then scroll to the target element after a short delay
                setTimeout(() => {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300); // 300ms delay to allow menu closing animation to complete
            } else {
                // For regular links, just close the menu (navigation will happen normally)
                closeMobileMenu();
            }
        });
    });
    
    // Special handling for submenu links
    const submenuLinks = document.querySelectorAll('.mobile-submenu a');
    submenuLinks.forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });
});
