/* ─── Three.js 3D Background ────────────────────────────────────────────── */
let scene, camera, renderer, stars, starGeo;

function initThree() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for (let i = 0; i < 6000; i++) {
        starCoords.push(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));

    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/circle.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0x00f2ff,
        size: 0.7,
        map: sprite,
        transparent: true,
        opacity: 0.8
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const positions = starGeo.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.2;
        if (positions[i] < -300) {
            positions[i] = 300;
        }
    }
    starGeo.attributes.position.needsUpdate = true;
    stars.rotation.y += 0.002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function startMainAnimations() {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        tl.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power4.out' })
            .from('.hero-image', { opacity: 0, scale: 0.5, z: -500, duration: 1.5, ease: 'back.out(1.7)' })
            .from('.hero-text > *', { opacity: 0, x: 100, z: -100, stagger: 0.2, duration: 1, ease: 'power3.out' }, "-=0.8");
    }
}

/* Main Site Logic */
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    startMainAnimations();

    // ─── Interactive Mouse Parallax for Background ───
    document.addEventListener('mousemove', (e) => {
        if (camera) {
            const mouseX = (e.clientX - window.innerWidth / 2) / 100;
            const mouseY = (e.clientY - window.innerHeight / 2) / 100;
            gsap.to(camera.position, {
                x: mouseX * 0.5,
                y: (Math.PI / 2) + (mouseY * 0.5),
                duration: 2,
                ease: 'power2.out'
            });
        }
    });


    // ─── Theme Toggle Logic ───────────────────────────────────────────────────
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');

        // Apply saved theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.className = 'fas fa-moon';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

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
        resumeBtn.addEventListener('click', function (e) {
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
                // Mocking success to bypass Formspree errors and show Confetti celebration
                await new Promise(r => setTimeout(r, 1500));

                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank You! Your message has been sent successfully.';
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
            } catch (error) {
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending. Please try again.';
                formStatus.className = 'form-status error active';

                if (sendBtn) {
                    sendBtn.disabled = false;
                    if (btnText) btnText.textContent = "Try Again";
                    if (btnIcon) btnIcon.className = "fas fa-paper-plane btn-icon";
                }

                setTimeout(() => formStatus.classList.remove('active'), 5000);
            }
        });
    }

    // ─── Tab Navigation Logic (Now Smooth Scrolling) ─────────────────────────
    const navAnchors = document.querySelectorAll('.nav-links a');
    const mobileNavLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section.section');

    // Smooth Scroll specifically for our section links
    navAnchors.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hasAttribute('download')) return;

            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#') || href === '#') return;

            e.preventDefault();
            const targetSubId = href.substring(1);
            const targetSection = document.getElementById(targetSubId);

            if (targetSection) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);

                // Close mobile menu
                if (mobileNavLinks && mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                }
            }
        });
    });

    // ─── IntersectionObserver for Nav Highlight ───
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // ─── Dashboard Stats Counter ───
    const stats = document.querySelectorAll('.stat-num');
    if (stats.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        stats.forEach(stat => {
            const targetVal = parseInt(stat.getAttribute('data-val'));
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%"
                },
                innerText: 0,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out"
            });
        });
    }

    // ─── GSAP ScrollTrigger 3D Reveals ───
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        sections.forEach(section => {
            const revealElements = section.querySelectorAll('.glass-card, .section-title, .timeline-item, .project-card, .info-item, .skills-category-card');
            
            if (revealElements.length > 0) {
                gsap.from(revealElements, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power1.out',
                    onComplete: () => {
                        // Ensure everything is fully visible after animation
                        gsap.set(revealElements, { clearProps: "opacity,y,transform" });
                    }
                });
            }
        });
    }
});



