// Preview control script for Mac Wayne site
// This script helps with controlling preview settings

(function() {
  if (typeof window !== 'undefined') {
    // Listen for messages from the preview control panel
    window.addEventListener('message', function(event) {
      // Handle the message
      if (event.data && event.data.action) {
        switch (event.data.action) {
          case 'toggleContrast':
            document.body.classList.toggle('high-contrast');
            break;
          
          case 'toggleCursor':
            // Re-enable custom cursor
            const cursorStyle = document.createElement('style');
            cursorStyle.textContent = `
              * { cursor: ${document.body.classList.toggle('custom-cursor') ? 'none' : 'auto'}; }
              .cursor { display: ${document.body.classList.contains('custom-cursor') ? 'block' : 'none'}; }
            `;
            document.head.appendChild(cursorStyle);
            
            // Initialize cursor position tracking if enabled
            if (document.body.classList.contains('custom-cursor')) {
              initCustomCursor();
            }
            break;
            
          case 'toggleDarkMode':
            document.body.classList.toggle('ultra-dark-mode');
            if (document.body.classList.contains('ultra-dark-mode')) {
              const darkStyle = document.createElement('style');
              darkStyle.id = 'ultra-dark-mode-style';
              darkStyle.textContent = `
                .strange-section {
                  background: rgba(10, 10, 10, 0.97) !important;
                  box-shadow: 0 0 30px rgba(204, 0, 0, 0.4) !important;
                }
                .strange-theme::after {
                  opacity: 0.7 !important;
                }
                .strange-header {
                  text-shadow: 0 0 15px var(--prison-red) !important;
                }
                .album-card, .event-item, .newsletter-form, .strange-audio-player {
                  background: rgba(5, 5, 5, 0.98) !important;
                }
              `;
              document.head.appendChild(darkStyle);
            } else {
              const darkStyle = document.getElementById('ultra-dark-mode-style');
              if (darkStyle) darkStyle.remove();
            }
            break;
            
          case 'toggleSmokeEffect':
            document.body.classList.toggle('intense-smoke');
            if (document.body.classList.contains('intense-smoke')) {
              const smokeStyle = document.createElement('style');
              smokeStyle.id = 'intense-smoke-style';              smokeStyle.textContent = `
                .strange-theme::after {
                  opacity: 0.7 !important;
                  animation: smokeDrift 30s infinite alternate ease-in-out !important;
                }
                .header-background img {
                  filter: drop-shadow(0 0 25px var(--prison-red)) !important;
                }
                @keyframes smokeDrift {
                  0% { background-position: 0% 0%; }
                  100% { background-position: 100% 100%; }
                }
              `;
              document.head.appendChild(smokeStyle);
            } else {
              const smokeStyle = document.getElementById('intense-smoke-style');
              if (smokeStyle) smokeStyle.remove();
            }
            break;
        }
      }
    });
    
    // Function to initialize the custom cursor
    function initCustomCursor() {
      const cursor = document.querySelector('.cursor');
      
      if (!cursor) return;
      
      document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    }
    
    // Add controls to the page for easier testing
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'preview-controls';
    controlsContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(10, 10, 10, 0.8);
      border: 1px solid #cc0000;
      border-radius: 5px;
      padding: 10px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `;
    
    // Create controls
    const controls = [
      { label: 'Ultra Dark Mode', action: 'toggleDarkMode' },
      { label: 'Intense Smoke Effect', action: 'toggleSmokeEffect' },
      { label: 'High Contrast', action: 'toggleContrast' },
      { label: 'Custom Cursor', action: 'toggleCursor' }
    ];
    
    controls.forEach(control => {
      const button = document.createElement('button');
      button.textContent = control.label;
      button.style.cssText = `
        background: #222;
        border: 1px solid #444;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      button.addEventListener('mouseenter', () => {
        button.style.background = '#333';
        button.style.borderColor = '#cc0000';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = '#222';
        button.style.borderColor = '#444';
      });
      button.addEventListener('click', () => {
        window.postMessage({ action: control.action }, '*');
      });
      controlsContainer.appendChild(button);
    });
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      color: #cc0000;
      font-size: 14px;
      cursor: pointer;
    `;
    closeButton.addEventListener('click', () => {
      controlsContainer.style.display = 'none';
    });
    controlsContainer.appendChild(closeButton);
    
    // Add container to page after a delay
    setTimeout(() => {
      document.body.appendChild(controlsContainer);
    }, 1000);
  }
})();
