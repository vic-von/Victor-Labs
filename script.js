/* =========================================================
   VICTOR LABS — INTERACTIVE SYSTEM
========================================================= */


/* =========================================================
   LOADER
========================================================= */

const loader = document.getElementById("loader");
const loaderLine = document.querySelector(".loader-line span");
const loaderPercent = document.getElementById("loader-percent");

let loadProgress = 0;

const loaderInterval = setInterval(() => {

    loadProgress += Math.floor(Math.random() * 8) + 2;

    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loaderInterval);

        setTimeout(() => {
            loader.classList.add("hidden");
        }, 350);
    }

    loaderLine.style.width = `${loadProgress}%`;
    loaderPercent.textContent =
        `${String(loadProgress).padStart(2, "0")}%`;

}, 55);


/* =========================================================
   CURSOR
========================================================= */

const cursorDot = document.querySelector(".cursor-dot");
const cursorGlow = document.querySelector(".cursor-glow");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let glowX = mouseX;
let glowY = mouseY;

document.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }

});

function animateCursor() {

    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    if (cursorGlow) {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

const magneticElements =
    document.querySelectorAll(".magnetic");

magneticElements.forEach((element) => {

    element.addEventListener("mousemove", (event) => {

        if (window.innerWidth <= 750) return;

        const rect =
            element.getBoundingClientRect();

        const x =
            event.clientX - rect.left - rect.width / 2;

        const y =
            event.clientY - rect.top - rect.height / 2;

        element.style.transform =
            `translate(${x * 0.12}px, ${y * 0.12}px)`;

    });

    element.addEventListener("mouseleave", () => {

        element.style.transform = "";

    });

});


/* =========================================================
   HERO 3D RESPONSE
========================================================= */

const heroSystem =
    document.querySelector(".hero-system");

if (heroSystem) {

    document.addEventListener("mousemove", (event) => {

        if (window.innerWidth <= 750) return;

        const x =
            (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
            (event.clientY / window.innerHeight - 0.5) * 2;

        const rotateY = x * 7;
        const rotateX = y * -7;

        heroSystem.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    });

}


/* =========================================================
   PARTICLE SYSTEM
========================================================= */

const canvas =
    document.getElementById("particle-canvas");

const ctx =
    canvas ? canvas.getContext("2d") : null;

let particles = [];

let particleMouse = {
    x: null,
    y: null,
    radius: 150
};

function resizeCanvas() {

    if (!canvas || !ctx) return;

    const pixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        window.innerWidth * pixelRatio;

    canvas.height =
        window.innerHeight * pixelRatio;

    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

document.addEventListener(
    "mousemove",
    (event) => {

        particleMouse.x =
            event.clientX;

        particleMouse.y =
            event.clientY;

    }
);

document.addEventListener(
    "mouseleave",
    () => {

        particleMouse.x = null;
        particleMouse.y = null;

    }
);


class Particle {

    constructor() {

        this.x =
            Math.random() *
            window.innerWidth;

        this.y =
            Math.random() *
            window.innerHeight;

        this.size =
            Math.random() * 1.2 + 0.25;

        this.speedX =
            (Math.random() - 0.5) * 0.25;

        this.speedY =
            (Math.random() - 0.5) * 0.25;

        this.alpha =
            Math.random() * 0.35 + 0.08;

    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -20)
            this.x = window.innerWidth + 20;

        if (this.x > window.innerWidth + 20)
            this.x = -20;

        if (this.y < -20)
            this.y = window.innerHeight + 20;

        if (this.y > window.innerHeight + 20)
            this.y = -20;


        /* Mouse interaction */

        if (
            particleMouse.x !== null &&
            particleMouse.y !== null
        ) {

            const dx =
                this.x - particleMouse.x;

            const dy =
                this.y - particleMouse.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (
                distance <
                particleMouse.radius
            ) {

                const force =
                    (particleMouse.radius - distance) /
                    particleMouse.radius;

                const angle =
                    Math.atan2(dy, dx);

                this.x +=
                    Math.cos(angle) *
                    force *
                    1.8;

                this.y +=
                    Math.sin(angle) *
                    force *
                    1.8;

            }

        }

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(150, 145, 255, ${this.alpha})`;

        ctx.fill();

    }

}


function createParticles() {

    particles = [];

    const density =
        window.innerWidth < 700
            ? 45
            : 85;

    for (let i = 0; i < density; i++) {
        particles.push(new Particle());
    }

}

createParticles();


function connectParticles() {

    const maxDistance = 115;

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const dx =
                particles[i].x -
                particles[j].x;

            const dy =
                particles[i].y -
                particles[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {

                const opacity =
                    (1 - distance / maxDistance)
                    * 0.045;

                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                ctx.strokeStyle =
                    `rgba(129, 120, 255, ${opacity})`;

                ctx.lineWidth = 1;

                ctx.stroke();

            }

        }

    }

}


function particleAnimation() {

    if (!canvas || !ctx) return;

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    particles.forEach((particle) => {

        particle.update();
        particle.draw();

    });

    connectParticles();

    requestAnimationFrame(
        particleAnimation
    );

}

particleAnimation();


/* =========================================================
   NAVBAR
========================================================= */

const navbar =
    document.querySelector(".navbar");

window.addEventListener(
    "scroll",
    () => {

        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    },
    { passive: true }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById("menu-button");

const mobileMenu =
    document.getElementById("mobile-menu");

const mobileLinks =
    mobileMenu
        ? mobileMenu.querySelectorAll("a")
        : [];

function closeMobileMenu() {

    if (!menuButton || !mobileMenu)
        return;

    menuButton.classList.remove("open");
    mobileMenu.classList.remove("open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "menu-open"
    );

}

if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            const open =
                mobileMenu.classList.toggle(
                    "open"
                );

            menuButton.classList.toggle(
                "open",
                open
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );

            document.body.classList.toggle(
                "menu-open",
                open
            );

        }
    );

}

mobileLinks.forEach((link) => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );

const sectionObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const id =
                        entry.target.id;

                    navLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            `#${id}`
                        );

                    });

                }

            });

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );

sections.forEach((section) => {

    sectionObserver.observe(section);

});


/* =========================================================
   SCROLL REVEALS
========================================================= */

const revealTargets =
    document.querySelectorAll(
        ".section-top, " +
        ".about-intro, " +
        ".about-card, " +
        ".section-heading-row, " +
        ".stack-item, " +
        ".terminal-window, " +
        ".project, " +
        ".lab-panel, " +
        ".contact-wrap"
    );

revealTargets.forEach((element) => {

    element.classList.add(
        "scroll-reveal"
    );

});

const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );

revealTargets.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================================
   STACK ITEM MOUSE EFFECT
========================================================= */

const stackItems =
    document.querySelectorAll(
        ".stack-item"
    );

stackItems.forEach((item) => {

    item.addEventListener(
        "mousemove",
        (event) => {

            if (window.innerWidth <= 750)
                return;

            const rect =
                item.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const percentage =
                (x / rect.width) * 100;

            item.style.background =
                `linear-gradient(
                    90deg,
                    rgba(129,120,255,.055)
                    ${percentage}%,
                    rgba(255,255,255,.018)
                    100%
                )`;

        }
    );

    item.addEventListener(
        "mouseleave",
        () => {

            item.style.background = "";

        }
    );

});


/* =========================================================
   TERMINAL
========================================================= */

const terminalInput =
    document.getElementById(
        "terminal-input"
    );

const terminalContent =
    document.getElementById(
        "terminal-content"
    );

const terminalCommands = {

    help: `
        <div class="terminal-response">
            Available commands:
        </div>

        <div class="terminal-command-list">

            <span>
                <b>about</b>
                — learn about the lab
            </span>

            <span>
                <b>projects</b>
                — inspect experiments
            </span>

            <span>
                <b>stack</b>
                — view technologies
            </span>

            <span>
                <b>contact</b>
                — start a conversation
            </span>

            <span>
                <b>status</b>
                — system information
            </span>

            <span>
                <b>clear</b>
                — clear terminal
            </span>

        </div>
    `,

    about: `
        <div class="terminal-response">
            Victor Labs is an independent technology
            lab focused on software, AI, automation,
            experiments and digital systems.
        </div>
    `,

    projects: `
        <div class="terminal-response">
            03 active experiments found:
            Future Systems / Automation / Digital Space
        </div>
    `,

    stack: `
        <div class="terminal-response">
            Current stack:
            JavaScript / C++ / AI / Web / Automation
        </div>
    `,

    contact: `
        <div class="terminal-response">
            Email:
            victorchaloh802j@gmail.com
        </div>
    `,

    status: `
        <div class="terminal-response">
            SYSTEM ............ ONLINE<br>
            CORE .............. ACTIVE<br>
            BUILD ............. 72%<br>
            EXPERIMENTS ....... 03<br>
            LAB ................ OPERATIONAL
        </div>
    `

};


function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function addTerminalLine(command) {

    const line =
        document.createElement("div");

    line.className =
        "terminal-line";

    line.innerHTML = `
        <span class="terminal-green">
            victor@labs
        </span>:<span class="terminal-blue">~</span>$
        <span>${escapeHTML(command)}</span>
    `;

    terminalContent.insertBefore(
        line,
        terminalContent.querySelector(
            ".terminal-input-row"
        )
    );

}


function addTerminalResponse(html) {

    const response =
        document.createElement("div");

    response.innerHTML = html;

    terminalContent.insertBefore(
        response,
        terminalContent.querySelector(
            ".terminal-input-row"
        )
    );

}


function clearTerminal() {

    const inputRow =
        terminalContent.querySelector(
            ".terminal-input-row"
        );

    terminalContent.innerHTML = "";

    terminalContent.appendChild(
        inputRow
    );

}


function runTerminalCommand(command) {

    const clean =
        command.trim().toLowerCase();

    if (!clean) return;

    addTerminalLine(clean);

    if (clean === "clear") {

        clearTerminal();
        return;

    }

    if (
        terminalCommands[clean]
    ) {

        addTerminalResponse(
            terminalCommands[clean]
        );

        return;

    }

    addTerminalResponse(`
        <div class="terminal-response">
            Command not found:
            <span style="color:#a19aff">
                ${escapeHTML(clean)}
            </span>.
            Type <b>help</b> for available commands.
        </div>
    `);

}


if (terminalInput) {

    terminalInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                runTerminalCommand(
                    terminalInput.value
                );

                terminalInput.value = "";

                terminalContent.scrollTop =
                    terminalContent.scrollHeight;

            }

        }
    );

    terminalInput.addEventListener(
        "click",
        () => {
            terminalInput.focus();
        }
    );

}


/* =========================================================
   PROJECT MODAL
========================================================= */

const projectModal =
    document.getElementById(
        "project-modal"
    );

const modalClose =
    document.getElementById(
        "modal-close"
    );

const modalTitle =
    document.getElementById(
        "modal-title"
    );

const modalDescription =
    document.getElementById(
        "modal-description"
    );

const modalTech =
    document.getElementById(
        "modal-tech"
    );

const modalStatus =
    document.getElementById(
        "modal-status"
    );


const projectData = {

    future: {

        title: "Future Systems",

        description:
            "An experimental environment for exploring the intersection of software, intelligence and digital systems. The project is focused on turning abstract ideas into interfaces that can actually be interacted with.",

        technologies: [
            "AI",
            "JavaScript",
            "WEB",
            "SYSTEM DESIGN"
        ],

        status: "ACTIVE EXPERIMENT"

    },


    automation: {

        title: "Automation",

        description:
            "A collection of small automation systems designed to remove repetitive work, connect different tools and make everyday digital processes more efficient.",

        technologies: [
            "JAVASCRIPT",
            "AUTOMATION",
            "APIs",
            "WORKFLOWS"
        ],

        status: "BUILDING"

    },


    digital: {

        title: "Digital Space",

        description:
            "An interface experiment focused on atmosphere, motion and interaction. The goal is to explore how a website can feel more like a digital environment than a collection of pages.",

        technologies: [
            "HTML",
            "CSS",
            "JAVASCRIPT",
            "UX"
        ],

        status: "CONCEPT"

    }

};


function openProject(projectKey) {

    const project =
        projectData[projectKey];

    if (!project || !projectModal)
        return;

    modalTitle.textContent =
        project.title;

    modalDescription.textContent =
        project.description;

    modalStatus.textContent =
        project.status;

    modalTech.innerHTML =
        project.technologies
            .map(
                (technology) =>
                    `<span>${technology}</span>`
            )
            .join("");

    projectModal.classList.add(
        "open"
    );

    projectModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "menu-open"
    );

}


function closeProject() {

    if (!projectModal) return;

    projectModal.classList.remove(
        "open"
    );

    projectModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


document
    .querySelectorAll(
        ".project-button"
    )
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                openProject(
                    button.dataset.project
                );

            }
        );

    });


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeProject
    );

}


if (projectModal) {

    projectModal
        .querySelector(".modal-backdrop")
        .addEventListener(
            "click",
            closeProject
        );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeProject();

        }

    }
);


/* =========================================================
   COPY EMAIL
========================================================= */

const copyEmail =
    document.getElementById(
        "copy-email"
    );

if (copyEmail) {

    copyEmail.addEventListener(
        "click",
        async () => {

            const email =
                "victorchaloh802j@gmail.com";

            try {

                await navigator.clipboard.writeText(
                    email
                );

                const original =
                    copyEmail.textContent;

                copyEmail.textContent =
                    "Copied ✓";

                copyEmail.style.color =
                    "#6dffac";

                setTimeout(() => {

                    copyEmail.textContent =
                        original;

                    copyEmail.style.color =
                        "";

                }, 1800);

            } catch (error) {

                window.location.href =
                    `mailto:${email}`;

            }

        }
    );

}


/* =========================================================
   PROJECT VISUAL PARALLAX
========================================================= */

const projectVisuals =
    document.querySelectorAll(
        ".project-visual"
    );

projectVisuals.forEach((visual) => {

    visual.addEventListener(
        "mousemove",
        (event) => {

            if (window.innerWidth <= 750)
                return;

            const rect =
                visual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                .5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                .5;

            const visualElements =
                visual.querySelectorAll(
                    ".visual-orb, " +
                    ".visual-code, " +
                    ".automation-core, " +
                    ".interface-window"
                );

            visualElements.forEach(
                (element) => {

                    element.style.transform =
                        `translate(
                            ${x * 12}px,
                            ${y * 12}px
                        )`;

                }
            );

        }
    );

    visual.addEventListener(
        "mouseleave",
        () => {

            const visualElements =
                visual.querySelectorAll(
                    ".visual-orb, " +
                    ".visual-code, " +
                    ".automation-core, " +
                    ".interface-window"
                );

            visualElements.forEach(
                (element) => {

                    element.style.transform = "";

                }
            );

        }
    );

});


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /* Focus terminal with "/" */

        if (
            event.key === "/" &&
            document.activeElement.tagName !== "INPUT"
        ) {

            event.preventDefault();

            if (terminalInput) {
                terminalInput.focus();
            }

        }

    }
);


/* =========================================================
   SMOOTH ANCHOR HANDLING
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) return;

                event.preventDefault();

                const navbarHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                closeMobileMenu();

            }
        );

    });


/* =========================================================
   RANDOM SYSTEM STATUS
========================================================= */

const systemCore =
    document.querySelector(
        ".system-core"
    );

if (systemCore) {

    setInterval(() => {

        systemCore.style.filter =
            "brightness(1.15)";

        setTimeout(() => {

            systemCore.style.filter =
                "";

        }, 180);

    }, 5000);

}


/* =========================================================
   INITIALIZE
========================================================= */

console.log(
    "%c Victor Labs ",
    "background:#8178ff;color:white;padding:8px 12px;font-weight:bold;"
);

console.log(
    "%c System online. Welcome to the lab.",
    "color:#858b99;"
);