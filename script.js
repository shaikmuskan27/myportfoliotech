document.addEventListener('DOMContentLoaded', () => {
    // --- 1. NETWORK CONNECTIVITY CANVAS ANIMATION ---
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

                // Mouse interaction (push away slightly)
                if (mouse.x != null && mouse.y != null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        this.x += directionX * force * 2;
                        this.y += directionY * force * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Particle count based on screen size
            const count = Math.floor((canvas.width * canvas.height) / 15000);
            const finalCount = Math.min(Math.max(count, 30), 120); // range between 30 and 120
            for (let i = 0; i < finalCount; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        };

        const connectParticles = () => {
            let maxDist = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDist) {
                        // Fade line based on distance
                        let opacity = (maxDist - distance) / maxDist * 0.15;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
    }

    // --- 2. MOBILE NAVIGATION CONTROLLER ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const header = document.querySelector('.glass-header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 3. HERO DIAGNOSTIC INTERACTIVE TERMINAL ---
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-user-input');
    const typedCursor = document.getElementById('typed-cursor');

    // Terminal Commands Dataset
    const commands = {
        help: () => `Available diagnostics operations:
  <span class="text-highlight">help</span>        - Display active command protocols.
  <span class="text-highlight">whoami</span>      - Display current operator profile information.
  <span class="text-highlight">skills</span>      - Print structured technical capability nodes.
  <span class="text-highlight">projects</span>    - Query active containerization and engine configurations.
  <span class="text-highlight">experience</span>  - View timeline logs of historical deployments.
  <span class="text-highlight">ping &lt;host&gt;</span> - Run network diagnostic response check.
  <span class="text-highlight">clear</span>       - Wipe diagnostic terminal log data.`,
        whoami: () => `OPERATOR PROFILE:
  Name:       Shaik Muskan
  Core Focus: Zero Trust Security, Network Protection, & Container Isolation systems
  Degree:     B.Tech in CSE (Internet of Things) - May 2026 graduation
  Cisco Cert: Network Support & Security (VLANs, Infrastructure routing)`,
        skills: () => `SYSTEMS & SECURITY MATRIX:
  Languages:  Go (Golang), Python, C/C++, Java
  Networks:   TCP/IP, SSL/TLS, DNS audits, mTLS verification
  Isolation:  Linux Namespaces, Cgroups v2, Chroot sandboxing, Docker
  Cloud/Ops:  AWS (EC2, S3), Terraform, CI/CD pipelines, Kafka`,
        projects: () => `ACTIVE PROJECTS SUMMARY:
  1. GOCKER:
     - Goal: Custom Linux container runtime in Go.
     - Tech: Namespaces isolation, Cgroups control loops, Chroot jail rootFS.
  2. AI-DRIVEN NETWORK SECURITY ENGINE:
     - Goal: Native network scanning tool parsed using low-overhead JSON streams.
     - Tech: DNS security audits, HTTP responses tracking, SSL handshakes validation.`,
        experience: () => `EXPERIENCE TRACK RECORD:
  - SLASH MARK IT SOLUTIONS (Data Analytics Intern: Dec 2025 - Apr 2026)
    * Built robust telemetry ingestion pipelines.
    * 25% decrease in processing latency.
    * 40% reduction in sysadmin operational cost.
  - BLACKBUCK ENGINEERS (Android Dev Intern: May 2025 - Jul 2025)
    * Flutter Clean Architecture migration.
    * Optimized application local query caching.`,
        clear: null // Handled dynamically in interpreter loop
    };

    // Auto-typing placeholder commands initially
    const introPhrases = ["whoami", "help"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isTypingIntro = true;

    const typeIntroCommands = () => {
        if (!typedCursor) return;
        
        if (phraseIndex < introPhrases.length) {
            const currentPhrase = introPhrases[phraseIndex];
            if (charIndex < currentPhrase.length) {
                typedCursor.textContent += currentPhrase.charAt(charIndex);
                charIndex++;
                setTimeout(typeIntroCommands, 100);
            } else {
                // Done typing phrase, execute it
                setTimeout(() => {
                    executeCommand(currentPhrase);
                    typedCursor.textContent = '';
                    charIndex = 0;
                    phraseIndex++;
                    setTimeout(typeIntroCommands, 600);
                }, 400);
            }
        } else {
            isTypingIntro = false;
            // Remove cursor container styling but leave static elements
            document.querySelector('.dynamic-prompt').style.display = 'none';
        }
    };

    // Start auto typing
    setTimeout(typeIntroCommands, 1000);

    const executeCommand = (cmdText) => {
        const cleanedCmd = cmdText.trim();
        if (!cleanedCmd) return;

        // Append user input line to logs
        const userLine = document.createElement('div');
        userLine.className = 'terminal-line';
        userLine.innerHTML = `<span class="term-prompt">guest@sm-os:~$</span> ${cleanedCmd}`;
        terminalBody.appendChild(userLine);

        const parts = cleanedCmd.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-output';

        if (mainCmd === 'clear') {
            terminalBody.innerHTML = '';
            return;
        } else if (mainCmd === 'ping') {
            if (!arg) {
                outputDiv.innerHTML = `usage: ping &lt;destination_address&gt; (e.g. ping google.com)`;
            } else {
                outputDiv.innerHTML = `PING ${arg} (56(84) bytes of data):
[SYS] DNS lookup: ${arg} -> mapped successfully
64 bytes from ${arg}: icmp_seq=1 ttl=64 time=12.4 ms
64 bytes from ${arg}: icmp_seq=2 ttl=64 time=11.8 ms
64 bytes from ${arg}: icmp_seq=3 ttl=64 time=13.1 ms
--- ${arg} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 11.8/12.43/13.1/0.53 ms`;
            }
        } else if (commands[mainCmd]) {
            outputDiv.innerHTML = commands[mainCmd]();
        } else {
            outputDiv.innerHTML = `sh: command not found: ${mainCmd}. Type <span class="text-highlight">help</span> for a list of security diagnostics tools.`;
        }

        terminalBody.appendChild(outputDiv);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (isTypingIntro) {
                e.preventDefault();
                return;
            }
            
            if (e.key === 'Enter') {
                const cmd = terminalInput.value;
                executeCommand(cmd);
                terminalInput.value = '';
            }
        });
    }

    // --- 4. SECURE TRANSMISSION CONTACT FORM & LOGS ---
    const contactForm = document.getElementById('secure-contact-form');
    const contactLogs = document.getElementById('contact-log-body');

    if (contactForm && contactLogs) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear placeholder text if present
            const placeholder = contactLogs.querySelector('.placeholder-entry');
            if (placeholder) placeholder.remove();

            const name = document.getElementById('name-input').value;
            const email = document.getElementById('email-input').value;
            const message = document.getElementById('message-input').value;

            // Simulated transmission packets sequence
            const logsSequence = [
                { type: 'sys', text: `Initiating handshake request from ${name} (${email})...` },
                { type: 'sys', text: 'Negotiating cipher suite: ECDHE-ECDSA-AES256-GCM-SHA384...' },
                { type: 'sys', text: 'mTLS Client identity verification: PASSED.' },
                { type: 'sys', text: 'Encrypting transaction payload with ephemeral Diffie-Hellman keys...' },
                { type: 'sys', text: `Routing encrypted packets through port 443 gateway...` },
                { type: 'done', text: 'PACKET TRANSMISSION: SUCCESS. Response code 202 [UPLINK ACCEPTED].' }
            ];

            let logIndex = 0;
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Encrypting...`;

            const printNextLog = () => {
                if (logIndex < logsSequence.length) {
                    const step = logsSequence[logIndex];
                    const entry = document.createElement('div');
                    entry.className = 'log-entry';
                    
                    const time = new Date().toLocaleTimeString();
                    const statusClass = step.type === 'done' ? 'log-pass' : 'log-info';
                    
                    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="${statusClass}">[${step.type.toUpperCase()}]</span> ${step.text}`;
                    contactLogs.appendChild(entry);
                    contactLogs.scrollTop = contactLogs.scrollHeight;
                    
                    logIndex++;
                    setTimeout(printNextLog, 600);
                } else {
                    // Handshake completed successfully
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Uplink Secure`;
                    
                    // Reset Form
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Transmit Packet`;
                    }, 3000);
                }
            };

            printNextLog();
        });
    }
});
