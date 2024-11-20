class KatexGPT {
    constructor() {
        console.log('🚀 KatexGPT Extension initialized');
        
        // Initialize properties
        this.dayMilestones = [7, 30, 90, 180, 365, 500, 730, 1000, 1500];
        this.copyMilestones = [10, 50, 100, 300, 500, 1000, 1250, 1500, 1750, 2000];
        this.totalCopies = 0;
        this.reachedDayMilestones = [];
        this.reachedCopyMilestones = [];


        // Initialize features
        this.initializeStats();
        this.createPopup();
        this.enableObserver();
    }

    createPopup() {
        console.log('Creating popup...');
        
        // Create main popup container
        const popup = document.createElement('div');
        popup.id = 'coffee-popup';
        popup.className = 'coffee-popup';

        // Create content
        const content = document.createElement('div');
        content.className = 'coffee-content';

        // Add title
        const title = document.createElement('h3');
        title.textContent = '🎉 Achievement Unlocked! ☕';
        content.appendChild(title);

        // Add milestone message container
        const milestoneMsg = document.createElement('p');
        milestoneMsg.id = 'milestone-message';
        content.appendChild(milestoneMsg);

        // Add description
        const desc = document.createElement('p');
        desc.textContent = 'If you find this tool helpful, consider buying me a coffee!';
        content.appendChild(desc);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'coffee-buttons';

        // Add Coffee button
        const coffeeBtn = document.createElement('a');
        coffeeBtn.href = 'https://www.buymeacoffee.com/xmrphede';
        coffeeBtn.target = '_blank';
        coffeeBtn.className = 'coffee-btn';
        coffeeBtn.textContent = 'Buy Me a Coffee';
        buttonsContainer.appendChild(coffeeBtn);

        // Add Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = 'Maybe Later';
        closeBtn.onclick = () => popup.style.display = 'none';
        buttonsContainer.appendChild(closeBtn);
        content.appendChild(buttonsContainer);

        // Add bug report link
        const bugReport = document.createElement('a');
        bugReport.href = 'mailto:info@federicogranata.it?subject=Bug%20Report%20for%20KatexGPT';
        bugReport.className = 'bug-report';
        bugReport.textContent = 'Report a bug';
        content.appendChild(bugReport);

        // Create social links
        const socialLinks = document.createElement('div');
        socialLinks.className = 'social-links';

        // Add social icons
        const socials = [
            { platform: 'twitter', url: 'https://twitter.com/holygranats', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>' },
            { platform: 'linkedin', url: 'https://www.linkedin.com/in/federico-granata/', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>' },
            { platform: 'github', url: 'https://github.com/xMrPhede', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>' }
        ];

        socials.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.target = '_blank';
            link.className = 'social-link';
            link.innerHTML = social.icon;
            socialLinks.appendChild(link);
        });

        content.appendChild(socialLinks);
        popup.appendChild(content);

        // Add popup to page
        document.body.appendChild(popup);
        console.log('Popup created successfully');
    }

    enableObserver() {
        const observer = new MutationObserver(() => {
            this.createCopyEquationButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('Observer enabled');
    }
  
    createCopyEquationButtons() {
        // Only select equations that haven't been processed yet
        const equations = Array.from(document.querySelectorAll(".katex:not(.copyable-equation)"));
        
        equations.forEach(equation => {
            equation.style.cursor = "pointer";
            equation.classList.add("copyable-equation");
            
            equation.addEventListener("click", () => {
                const mathML = equation.querySelector(".katex-mathml math");
                if (mathML) {
                    const mathMLString = new XMLSerializer().serializeToString(mathML)
                        .replaceAll("&nbsp;", " ")
                        .replaceAll("&amp;", "&");
                    
                    navigator.clipboard.writeText(mathMLString)
                        .then(() => {
                            console.log('✅ MathML copied to clipboard');
                            this.totalCopies++;
                            localStorage.setItem('totalCopies', this.totalCopies.toString());
                            this.checkCopyMilestones();

                            // Add visual feedback for copy
                            this.showCopyFeedback(equation);
                        })
                        .catch(err => {
                            console.error('❌ Failed to copy equation:', err);
                        });
                }
            }); // Removed { once: true }
        });
    }

    showCopyFeedback(equation) {
        // Add a brief visual feedback when copying
        equation.style.transition = 'transform 0.2s ease';
        equation.style.transform = 'scale(1.05)';
        
        // Create and show a temporary "Copied!" message
        const feedback = document.createElement('div');
        feedback.textContent = 'Copied!';
        feedback.style.cssText = `
            position: absolute;
            background: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            transform: translateY(-100%);
            margin-top: -4px;
            z-index: 1000;
        `;
        
        equation.style.position = 'relative';
        equation.appendChild(feedback);

        // Animate the feedback
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            
            setTimeout(() => {
                equation.style.transform = 'scale(1)';
                feedback.style.opacity = '0';
                
                // Clean up
                setTimeout(() => {
                    feedback.remove();
                }, 200);
            }, 500);
        });
    }
    initializeStats() {
        if (!localStorage.getItem('installDate')) {
            localStorage.setItem('installDate', new Date().toISOString());
        }
        
        this.totalCopies = parseInt(localStorage.getItem('totalCopies')) || 0;
        this.reachedDayMilestones = JSON.parse(localStorage.getItem('reachedDayMilestones')) || [];
        this.reachedCopyMilestones = JSON.parse(localStorage.getItem('reachedCopyMilestones')) || [];
        
        console.log('Stats initialized:', {
            copies: this.totalCopies,
            dayMilestones: this.reachedDayMilestones,
            copyMilestones: this.reachedCopyMilestones
        });

        this.checkDayMilestones();
    }

    showMilestonePopup(type, value) {
        const messageElement = document.getElementById('milestone-message');
        if (!messageElement) {
            console.error('Milestone message element not found');
            return;
        }

        let message = type === 'days' 
            ? `You've been using this extension for <span class="highlight">${value} days</span>!`
            : `You've converted <span class="highlight">${value} equations</span>!`;

        messageElement.innerHTML = message;
        this.showPopup();
    }

    showPopup() {
        const popup = document.getElementById('coffee-popup');
        if (popup) {
            popup.style.display = 'block';
            this.triggerConfetti();
            console.log('Popup shown');
        } else {
            console.error('Popup element not found');
        }
    }

    triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    checkDayMilestones() {
        const installDate = new Date(localStorage.getItem('installDate'));
        const daysSinceInstall = Math.floor((new Date() - installDate) / (1000 * 60 * 60 * 24));
        
        this.dayMilestones.forEach(days => {
            const milestoneId = `day-${days}`;
            if (daysSinceInstall >= days && !this.reachedDayMilestones.includes(milestoneId)) {
                this.reachedDayMilestones.push(milestoneId);
                localStorage.setItem('reachedDayMilestones', JSON.stringify(this.reachedDayMilestones));
                this.showMilestonePopup('days', days);
            }
        });
    }

    checkCopyMilestones() {
        this.copyMilestones.forEach(copies => {
            const milestoneId = `copy-${copies}`;
            if (this.totalCopies >= copies && !this.reachedCopyMilestones.includes(milestoneId)) {
                this.reachedCopyMilestones.push(milestoneId);
                localStorage.setItem('reachedCopyMilestones', JSON.stringify(this.reachedCopyMilestones));
                this.showMilestonePopup('copies', copies);
            }
        });
    }
}

// Initialize the extension
console.log('Starting KatexGPT Extension...');
const katexGPT = new KatexGPT();