// ==UserScript==
// @name         Axiom USD1 Vamper
// @namespace    royalties.fun
// @version      1.0
// @description  Injects USD1 button on Axiom meme pages
// @match        https://axiom.trade/meme/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let buttonInjected = false;

    function extractTokenData() {
        const data = {
            ca: '',
            ticker: '',
            name: '',
            twitter: '',
            website: '',
            image: ''
        };

        // Extract CA from URL
        const urlMatch = window.location.pathname.match(/\/meme\/([A-Za-z0-9]+)/);
        if (urlMatch) {
            data.ca = urlMatch[1];
        }

        // Extract ticker - first text-textPrimary span with the token name
        const tickerEl = document.querySelector('.text-textPrimary.text-\\[16px\\] .truncate');
        if (tickerEl) {
            data.ticker = tickerEl.textContent.trim();
        }

        // Extract name - the secondary text (textTertiary) after ticker
        const nameButton = document.querySelector('button.text-textTertiary span.text-\\[14px\\] .truncate');
        if (nameButton) {
            data.name = nameButton.textContent.trim();
        }

        // Extract image
        const imgEl = document.querySelector('img[class*="rounded"][class*="object-cover"]');
        if (imgEl && imgEl.src) {
            data.image = imgEl.src;
        }

        // Extract links - look for anchor tags
        const links = document.querySelectorAll('a[target="_blank"][rel="noopener noreferrer"]');
        links.forEach(link => {
            const href = link.href || '';
            
            // Skip pump.fun links
            if (href.includes('pump.fun')) return;
            
            // Twitter/X links
            if (href.includes('x.com') || href.includes('twitter.com')) {
                // Skip search links
                if (!href.includes('/search?')) {
                    data.twitter = href;
                }
            }
            // Website - not twitter, not pump, not youtube, not search
            else if (!href.includes('youtube.com') && 
                     !href.includes('youtu.be') &&
                     !href.includes('axiom.trade') &&
                     href.startsWith('http')) {
                data.website = href;
            }
        });

        return data;
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = 'USD1';
        btn.style.cssText = `
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 8px;
            transition: all 0.15s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        btn.onmouseenter = () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 4px 8px rgba(255,215,0,0.4)';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        };

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const data = extractTokenData();
            console.log('Token Data:', data);
            
            // Copy to clipboard as JSON
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                btn.textContent = 'Copied!';
                btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                setTimeout(() => {
                    btn.textContent = 'USD1';
                    btn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                }, 1500);
            });

            // You can also send this data somewhere
            // fetch('YOUR_API_ENDPOINT', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        };

        return btn;
    }

    function injectButton() {
        if (buttonInjected) return;

        // Find the container with the token name and icons
        const container = document.querySelector('#pair-name-tooltip');
        if (!container) return;

        // Check if already injected
        if (container.querySelector('.usd1-btn')) return;

        const btn = createButton();
        btn.classList.add('usd1-btn');
        container.appendChild(btn);
        buttonInjected = true;
        console.log('[Vamper] USD1 button injected');
    }

    function init() {
        // Try to inject immediately
        injectButton();

        // Also observe for dynamic content
        const observer = new MutationObserver(() => {
            if (!buttonInjected) {
                injectButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Retry a few times in case of slow load
        let attempts = 0;
        const interval = setInterval(() => {
            if (buttonInjected || attempts > 20) {
                clearInterval(interval);
                return;
            }
            injectButton();
            attempts++;
        }, 500);
    }

    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


