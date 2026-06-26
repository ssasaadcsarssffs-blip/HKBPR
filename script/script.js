document.addEventListener('DOMContentLoaded', function() {
    
    var loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
        }
    }, 2000);

    var navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.forEach(function(item) {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    window.addEventListener('scroll', function() {
        var fromTop = window.scrollY + 100;
        
        navLinks.forEach(function(link) {
            var sectionId = link.getAttribute('href');
            if (sectionId.startsWith('#')) {
                var section = document.querySelector(sectionId);
                if (section) {
                    if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
                        navLinks.forEach(function(item) {
                            item.classList.remove('active');
                        });
                        link.classList.add('active');
                    }
                }
            }
        });
    });
});
