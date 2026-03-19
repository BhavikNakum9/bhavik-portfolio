/* Intro Screen Sequence */
function initIntro() {
    const introScreen = document.querySelector('#intro-screen');
    const welcomePhase = document.querySelector('#welcome-phase');
    const loadingPhase = document.querySelector('#loading-phase');
    const introText = document.querySelector('#intro-text-animate');
    const loadingDots = document.querySelector('.loading-dots');
    const welcomeMsg = "Welcome to Bhavik Nakum";
    let charIndex = 0;

    function typeWelcome() {
        if (charIndex < welcomeMsg.length) {
            introText.textContent += welcomeMsg.charAt(charIndex);
            charIndex++;
            setTimeout(typeWelcome, 80);
        } else {
            setTimeout(transitionToLoading, 2000);
        }
    }

    function transitionToLoading() {
        welcomePhase.classList.remove('active');
        loadingPhase.classList.add('active');
        animateLoadingDots();
        setTimeout(finishIntro, 2500);
    }

    function animateLoadingDots() {
        let dotCount = 0;
        const dotInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            loadingDots.textContent = ".".repeat(dotCount).padEnd(3, ' ');
            if (!loadingPhase.classList.contains('active')) clearInterval(dotInterval);
        }, 400);
    }

    function finishIntro() {
        introScreen.classList.add('fade-out');
        document.body.style.overflowY = 'auto';
        setTimeout(() => {
            introScreen.style.display = 'none';
            startMainAnimations();
            document.body.style.overflowY = 'auto';
        }, 1000);
    }

    // Particles for intro
    particlesJS("intro-particles", {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#00f2ff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.2 },
            "size": { "value": 2 },
            "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.15, "width": 1 },
            "move": { "enable": true, "speed": 1.5 }
        }
    });

    typeWelcome();
}

function startMainAnimations() {
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power4.out' })
        .from('.hero-text > *', { opacity: 0, x: -50, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, "-=0.5")
        .from('.hero-image', { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)' }, "-=0.8");
}

/* Main Particles.js Config */
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#00f2ff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.15, "random": true },
        "size": { "value": 2, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.1, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } },
            "push": { "particles_nb": 4 }
        }
    },
    "retina_detect": true
});

initIntro();

/* Main Site Logic */
document.addEventListener('DOMContentLoaded', () => {

    // ─── Typing Animation ─────────────────────────────────────────────────────
    const typingEl = document.querySelector('#typing-text');
    if (typingEl) {
        const roles = [
            'Flutter Developer',
            'Frontend Developer',
            'Mobile App Developer',
            'UI/UX Enthusiast',
            'Computer Engineering Student'
        ];
        let roleIndex = 0, charIndex = 0, isDeleting = false;

        function typeRole() {
            const current = roles[roleIndex];
            if (isDeleting) {
                typingEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === current.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            setTimeout(typeRole, isDeleting ? 60 : 110);
        }
        typeRole();
    }

    // ─── Mobile Nav Toggle ────────────────────────────────────────────────────
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ─── Navbar Scroll Effect ─────────────────────────────────────────────────
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // ─── Resume Download ──────────────────────────────────────────────────────
    const resumeBtn = document.querySelector('.resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const filePath = this.getAttribute('href');
            const fileName = this.getAttribute('download') || 'Final-Resume.pdf';
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = filePath;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // ─── Contact Form (Formspree AJAX) ────────────────────────────────────────
    const contactForm = document.querySelector('#portfolio-contact-form');
    const formStatus = document.querySelector('#form-status');

    if (contactForm && formStatus) {
        const sendBtn = contactForm.querySelector('.send-btn');
        const btnText = sendBtn ? sendBtn.querySelector('.btn-text') : null;
        const btnIcon = sendBtn ? sendBtn.querySelector('.btn-icon') : null;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (sendBtn) {
                sendBtn.disabled = true;
                if (btnText) btnText.textContent = "Sending...";
                if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin btn-icon";
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://formspree.io/f/mqaeovqk", {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent Successfully!';
                    formStatus.className = 'form-status success active';
                    contactForm.reset();

                    setTimeout(() => {
                        if (sendBtn) {
                            sendBtn.disabled = false;
                            if (btnText) btnText.textContent = "Send Message";
                            if (btnIcon) btnIcon.className = "fas fa-paper-plane btn-icon";
                        }
                    }, 2000);

                    setTimeout(() => formStatus.classList.remove('active'), 5000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending. Please try again.';
                formStatus.className = 'form-status active';
                formStatus.style.color = '#ff4b2b';
                formStatus.style.background = 'rgba(255, 75, 43, 0.1)';
                formStatus.style.border = '1px solid rgba(255,75,43,0.3)';

                if (sendBtn) {
                    sendBtn.disabled = false;
                    if (btnText) btnText.textContent = "Try Again";
                    if (btnIcon) btnIcon.className = "fas fa-paper-plane btn-icon";
                }

                setTimeout(() => formStatus.classList.remove('active'), 5000);
            }
        });
    }

});
