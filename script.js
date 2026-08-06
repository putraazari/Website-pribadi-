document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- HERO GRAPH CANVAS --- //
    const heroCanvas = document.getElementById('heroGraphCanvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let width = heroCanvas.width = heroCanvas.parentElement.clientWidth;
        let height = heroCanvas.height = heroCanvas.parentElement.clientHeight;

        const heroNodes = [
            { x: width * 0.3, y: height * 0.3, label: 'Target_Domain', color: '#00f0ff' },
            { x: width * 0.7, y: height * 0.25, label: 'VPS_Server_IP', color: '#8b5cf6' },
            { x: width * 0.5, y: height * 0.65, label: 'Investigator_Azari', color: '#10b981' },
            { x: width * 0.2, y: height * 0.75, label: 'OSINT_Leak_Hash', color: '#f59e0b' },
            { x: width * 0.8, y: height * 0.7, label: 'SSL_Cert_Owner', color: '#00f0ff' }
        ];

        function drawHeroGraph() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connection lines
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
            for (let i = 0; i < heroNodes.length; i++) {
                for (let j = i + 1; j < heroNodes.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(heroNodes[i].x, heroNodes[i].y);
                    ctx.lineTo(heroNodes[j].x, heroNodes[j].y);
                    ctx.stroke();
                }
            }

            // Draw nodes
            heroNodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 10;

                ctx.font = '10px JetBrains Mono, monospace';
                ctx.fillStyle = '#cbd5e1';
                ctx.fillText(node.label, node.x + 12, node.y + 4);
            });
            ctx.shadowBlur = 0;
        }
        drawHeroGraph();

        window.addEventListener('resize', () => {
            if (heroCanvas.parentElement) {
                width = heroCanvas.width = heroCanvas.parentElement.clientWidth;
                height = heroCanvas.height = heroCanvas.parentElement.clientHeight;
                drawHeroGraph();
            }
        });
    }

    // --- MAIN MALTEGO INTERACTIVE DEMO --- //
    const maltegoCanvas = document.getElementById('mainMaltegoCanvas');
    if (maltegoCanvas) {
        const ctx = maltegoCanvas.getContext('2d');
        let width = maltegoCanvas.width = maltegoCanvas.parentElement.clientWidth;
        let height = maltegoCanvas.height = maltegoCanvas.parentElement.clientHeight || 400;

        const nodes = [
            { id: 1, x: width * 0.2, y: height * 0.3, label: 'target-domain.com', ip: '104.21.43.12', asn: 'AS13335 Cloudflare', threat: 'Low (12%)', type: 'Domain', color: '#00f0ff', scan: '2 mins ago' },
            { id: 2, x: width * 0.5, y: height * 0.2, label: 'PutraAzari_VPS_Node', ip: '194.163.150.88', asn: 'AS24940 Hetzner Online', threat: 'Clean (0%)', type: 'VPS', color: '#8b5cf6', scan: '10 mins ago' },
            { id: 3, x: width * 0.8, y: height * 0.35, label: 'Suspicious_Email', ip: 'N/A', asn: 'Google Workspace', threat: 'Medium (45%)', type: 'Email', color: '#f59e0b', scan: '1 hour ago' },
            { id: 4, x: width * 0.35, y: height * 0.7, label: 'Target_Person_Identity', ip: '180.252.12.9', asn: 'AS23693 Telkomnet', threat: 'High (78%)', type: 'Person', color: '#10b981', scan: '5 mins ago' },
            { id: 5, x: width * 0.65, y: height * 0.75, label: 'C2_Malware_Server', ip: '185.220.101.5', asn: 'AS208294 Tor Exit', threat: 'Critical (98%)', type: 'C2 Server', color: '#ef4444', scan: 'Just now' }
        ];

        const edges = [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 2, to: 4 },
            { from: 3, to: 5 },
            { from: 4, to: 5 }
        ];

        let selectedNode = nodes[0];
        updateInspector(selectedNode);

        function drawMaltegoGraph() {
            ctx.clearRect(0, 0, width, height);

            // Draw edges
            edges.forEach(edge => {
                const source = nodes.find(n => n.id === edge.from);
                const target = nodes.find(n => n.id === edge.to);
                if (source && target) {
                    ctx.beginPath();
                    ctx.moveTo(source.x, source.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            });

            // Draw nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node === selectedNode ? 14 : 10, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();

                if (node === selectedNode) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.shadowColor = node.color;
                    ctx.shadowBlur = 15;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.font = '11px JetBrains Mono, monospace';
                ctx.fillStyle = '#f8fafc';
                ctx.fillText(node.label, node.x - 30, node.y + 25);
            });
            ctx.shadowBlur = 0;
        }

        function updateInspector(node) {
            document.getElementById('node-title').textContent = node.label;
            document.getElementById('node-ip').textContent = node.ip;
            document.getElementById('node-asn').textContent = node.asn;
            document.getElementById('node-threat').textContent = node.threat;
            document.getElementById('node-scan').textContent = node.scan;
            document.getElementById('node-desc').textContent = `Entitas ini teridentifikasi sebagai ${node.type} dalam pemetaan graph Maltego Putra Azari. Hubungan terhubung secara langsung dengan infrastruktur investigasi.`;
        }

        maltegoCanvas.addEventListener('click', (e) => {
            const rect = maltegoCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            nodes.forEach(node => {
                const dist = Math.hypot(node.x - clickX, node.y - clickY);
                if (dist < 20) {
                    selectedNode = node;
                    updateInspector(node);
                    drawMaltegoGraph();
                }
            });
        });

        document.getElementById('btn-run-transform')?.addEventListener('click', () => {
            nodes.forEach(node => {
                node.x += (Math.random() - 0.5) * 30;
                node.y += (Math.random() - 0.5) * 30;
            });
            drawMaltegoGraph();
        });

        document.getElementById('btn-reset-graph')?.addEventListener('click', () => {
            nodes[0].x = width * 0.2; nodes[0].y = height * 0.3;
            nodes[1].x = width * 0.5; nodes[1].y = height * 0.2;
            nodes[2].x = width * 0.8; nodes[2].y = height * 0.35;
            nodes[3].x = width * 0.35; nodes[3].y = height * 0.7;
            nodes[4].x = width * 0.65; nodes[4].y = height * 0.75;
            drawMaltegoGraph();
        });

        drawMaltegoGraph();
    }

    // --- TERMINAL SIMULATOR --- //
    const termInput = document.getElementById('terminal-input');
    const termWindow = document.getElementById('terminal-window');

    const commands = {
        'help': 'Perintah yang tersedia: <br>- <span class="text-cyan-400">whoami</span>: Profil Putra Azari<br>- <span class="text-cyan-400">maltego</span>: Status OSINT Maltego<br>- <span class="text-cyan-400">forensics</span>: Alat forensik digital<br>- <span class="text-cyan-400">vps</span>: Status VPS Linux Server<br>- <span class="text-cyan-400">clear</span>: Bersihkan layar terminal',
        'whoami': '<span class="text-emerald-400">PUTRA AZARI</span> - Threat Intelligence Analyst &amp; Digital Forensics Specialist &amp; Linux SysAdmin.',
        'maltego': '<span class="text-cyan-400">MALTEGO OSINT STATUS:</span> Active. 350+ Entities mapped, TDS Custom Transforms configured for automated threat detection.',
        'forensics': '<span class="text-purple-400">DIGITAL FORENSICS SUITE:</span> Volatility 3, Autopsy, Wireshark PCAP triage, Memory Acquisition &amp; Timeline Analysis.',
        'vps': '<span class="text-amber-400">VPS CLUSTER METRICS:</span> Hardened Nginx Proxy, Fail2ban active, WireGuard VPN Mesh, 99.99% Uptime.',
    };

    if (termInput && termWindow) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = termInput.value.trim().toLowerCase();
                
                // Display user command
                const userCmdLine = document.createElement('div');
                userCmdLine.innerHTML = `<span class="text-cyan-400">guest@azari-sys:~$</span> ${termInput.value}`;
                termWindow.appendChild(userCmdLine);

                if (inputVal === 'clear') {
                    termWindow.innerHTML = '<div>Terminal cleared. Type <span class="text-cyan-400">"help"</span> for menu.</div>';
                } else if (commands[inputVal]) {
                    const respLine = document.createElement('div');
                    respLine.className = 'text-slate-300 ml-2';
                    respLine.innerHTML = commands[inputVal];
                    termWindow.appendChild(respLine);
                } else if (inputVal !== '') {
                    const errLine = document.createElement('div');
                    errLine.className = 'text-red-400 ml-2';
                    errLine.innerHTML = `Command not recognized: '${inputVal}'. Type <span class="text-cyan-400">'help'</span> for list.`;
                    termWindow.appendChild(errLine);
                }

                termInput.value = '';
                termWindow.scrollTop = termWindow.scrollHeight;
            }
        });
    }

    // Contact Form Submit Handler
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formSuccess.classList.remove('hidden');
            contactForm.reset();
        });
    }
});
