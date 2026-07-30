/*=========================================================
                PORTFOLIO JAVASCRIPT
                Srinjoy Chakraborty
                (fixed: null-safety + no-GSAP fallback)
=========================================================*/

"use strict";

/*=========================================================
                GSAP AVAILABILITY CHECK

    Everything gated behind GSAP now checks this flag first.
    If the CDN is blocked or fails, content stays visible
    (CSS already defaults .fade-up/.fade-left/etc. to
    opacity:1) instead of being stuck invisible forever.
=========================================================*/

const hasGSAP = typeof gsap !== "undefined";
const hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== "undefined";

if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

/*=========================================================
                DOM ELEMENTS
=========================================================*/

const loader = document.querySelector(".loader");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelector(".nav-links");
const menuBtn = document.querySelector(".menu-btn");
const cursorLight = document.getElementById("cursor-light");
const backToTop = document.getElementById("backToTop");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

/*=========================================================
                LOADER
=========================================================*/

window.addEventListener("load", () => {
    if (!loader) return;

    if (hasGSAP) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => loader.classList.add("hidden"),
        });
    } else {
        loader.classList.add("hidden");
    }
});

/*=========================================================
                NAVBAR SCROLL
=========================================================*/

if (navbar) {
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
}

/*=========================================================
                MOBILE MENU
=========================================================*/

function setMenuIcon(isOpen) {
    if (!menuBtn) return;
    const icon = menuBtn.querySelector("i");
    if (!icon) return;
    icon.classList.toggle("fa-bars", !isOpen);
    icon.classList.toggle("fa-xmark", isOpen);
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        setMenuIcon(navLinks.classList.contains("active"));
    });
}

/*=========================================================
            CLOSE MENU AFTER CLICK
=========================================================*/

if (navLinks) {
    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            setMenuIcon(false);
        });
    });
}

/*=========================================================
            SMOOTH SCROLL
=========================================================*/

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.offsetTop - 90,
            behavior: "smooth",
        });
    });
});

/*=========================================================
            ACTIVE NAVIGATION
=========================================================*/

function updateActiveNav() {
    let current = "";

    sections.forEach((section) => {
        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (window.pageYOffset >= top && window.pageYOffset < top + height) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
}

if (sections.length && navItems.length) {
    window.addEventListener("scroll", updateActiveNav);
}

/*=========================================================
            CURSOR SPOTLIGHT
=========================================================*/

if (cursorLight) {
    document.addEventListener("mousemove", (e) => {
        if (hasGSAP) {
            gsap.to(cursorLight, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.25,
                ease: "power2.out",
            });
        } else {
            cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    });
}

/*=========================================================
                BACK TO TOP
=========================================================*/

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/*=========================================================
                HELPERS
=========================================================*/

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/*=========================================================
                GSAP-DEPENDENT ANIMATIONS

    Everything below only runs if GSAP (and ScrollTrigger,
    where needed) is actually loaded. CSS already guarantees
    all of this content is visible without it.
=========================================================*/

if (hasGSAP) {

    /* Hero intro (badge, title, subtitle, buttons, tech pills, profile
       card) used to be animated in by a single chained GSAP timeline.
       If any one tween in that chain stalled, everything after it in
       the chain never played — which is exactly what happened to
       .pfp-card here. It's now a pure CSS entrance (see styles.css),
       so nothing in the hero depends on this script running at all. */

    /* ---------------- FLOATING PROFILE ---------------- */

    gsap.to(".pfp-card", {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
    });

    /* ---------------- BUTTON HOVER ---------------- */

    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, { scale: 1.05, duration: 0.25 });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, { scale: 1, duration: 0.25 });
        });
    });

    /* ---------------- CARD HOVER ---------------- */

    document.querySelectorAll(".project-card, .research-card, .contact-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            gsap.to(card, { y: -10, duration: 0.3 });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, { y: 0, duration: 0.3 });
        });
    });

    /* ---------------- SCROLL-DEPENDENT (needs ScrollTrigger) ---------------- */

    if (hasScrollTrigger) {

        gsap.utils.toArray(".fade-up").forEach((item) => {
            gsap.from(item, {
                y: 60, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 82%" },
            });
        });

        gsap.utils.toArray(".fade-left").forEach((item) => {
            gsap.from(item, {
                x: -80, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 82%" },
            });
        });

        gsap.utils.toArray(".fade-right").forEach((item) => {
            gsap.from(item, {
                x: 80, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 82%" },
            });
        });

        gsap.utils.toArray(".fade-scale").forEach((item) => {
            gsap.from(item, {
                scale: 0.92, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 82%" },
            });
        });

        gsap.utils.toArray(".timeline-item").forEach((item, index) => {
            gsap.from(item, {
                x: index % 2 === 0 ? -60 : 60, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 85%" },
            });
        });

        if (document.querySelector(".research-grid")) {
            gsap.from(".research-card", {
                y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: "power3.out",
                scrollTrigger: { trigger: ".research-grid", start: "top 75%" },
            });
        }

        if (document.querySelector(".project-grid")) {
            gsap.from(".project-card", {
                y: 80, opacity: 0, stagger: 0.18, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".project-grid", start: "top 78%" },
            });
        }

        if (document.querySelector(".featured-project")) {
            gsap.from(".featured-project", {
                y: 70, opacity: 0, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: ".featured-project", start: "top 80%" },
            });
        }

        if (document.querySelector(".contact-grid")) {
            gsap.from(".contact-card", {
                y: 50, opacity: 0, stagger: 0.15, duration: 0.9,
                scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
            });
        }

        if (document.querySelector(".skills")) {
            gsap.from(".skill", {
                scale: 0.5, opacity: 0, stagger: 0.03, duration: 0.45, ease: "back.out(1.7)",
                scrollTrigger: { trigger: ".skills", start: "top 80%" },
            });
        }

        /* ---------------- COUNTERS ---------------- */

        document.querySelectorAll(".highlight h2").forEach((counter) => {
            const number = parseInt(counter.textContent, 10);
            if (isNaN(number)) return;

            gsap.fromTo(
                counter,
                { innerText: 0 },
                {
                    innerText: number,
                    duration: 2,
                    ease: "power1.out",
                    snap: { innerText: 1 },
                    scrollTrigger: { trigger: counter, start: "top 90%" },
                    onUpdate: function () {
                        counter.innerHTML = Math.floor(counter.innerText) + "+";
                    },
                }
            );
        });

        /* ---------------- PARALLAX ---------------- */

        if (document.querySelector(".aurora")) {
            gsap.to(".aurora", {
                yPercent: 20,
                ease: "none",
                scrollTrigger: { scrub: true },
            });
        }

        ScrollTrigger.config({ ignoreMobileResize: true });

        /* Refresh once on load, again once web fonts finish swapping
           (font swap changes text height -> shifts every trigger's
           position), and once more a beat later to catch the canvas
           and any late image layout. Belt-and-braces: CSS already
           guarantees visibility even if every one of these misses. */
        const refreshST = () => ScrollTrigger.refresh();

        window.addEventListener("load", () => {
            refreshST();
            setTimeout(refreshST, 300);
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(refreshST);
        }
    }

    gsap.defaults({ overwrite: "auto" });

    /* ---------------- INITIAL FADE ---------------- */

    document.body.style.opacity = "0";
    gsap.to(document.body, { opacity: 1, duration: 0.8, ease: "power2.out" });
}

/*=========================================================
                NEURAL NETWORK (vanilla canvas — no GSAP needed)
=========================================================*/

const canvas = document.getElementById("networkCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const mouse = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = random(-0.35, 0.35);
            this.vy = random(-0.35, 0.35);
            this.size = random(1.2, 2.5);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(120,220,255,.75)";
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    createParticles();

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(120,220,255,${1 - dist / 120})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function mouseConnections() {
        if (mouse.x === null) return;
        particles.forEach((p) => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(103,232,249,${1 - dist / mouse.radius})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connectParticles();
        mouseConnections();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });
    window.addEventListener("resize", () => {
        resizeCanvas();
        createParticles();
        if (hasScrollTrigger) ScrollTrigger.refresh();
    });
}

/*=========================================================
            YEAR / FOOTER TEXT
=========================================================*/

const yearEl = document.querySelector(".footer-copy");
if (yearEl) {
    yearEl.innerHTML = `© ${new Date().getFullYear()} Srinjoy Chakraborty<br>Designed & Developed with HTML, CSS, JavaScript & GSAP`;
}

/*=========================================================
                END
=========================================================*/

console.log("%cPortfolio Ready", "color:#22d3ee;font-size:16px;font-weight:bold");