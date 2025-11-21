// PWA Installation Debug Helper
// Add this script to your page temporarily to debug PWA installation issues

console.log('🔍 PWA Debug Helper Loaded');

// Detect environment
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/MoC-Request-Platform' : '';
console.log(`🌐 Environment: ${isGitHubPages ? 'GitHub Pages' : 'Development'}`);
console.log(`📂 Base Path: ${basePath || '/'}`);


// Check PWA Installation Readiness
function checkPWAReadiness() {
  const results = {
    serviceWorker: false,
    manifest: false,
    https: false,
    icons: false,
    installPrompt: false
  };

  console.log('🔍 Checking PWA Installation Readiness...');
  
  // Check Service Worker
  if ('serviceWorker' in navigator) {
    results.serviceWorker = true;
    console.log('✅ Service Worker API supported');
    
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log('✅ Service Worker registered:', registrations[0].scope);
      } else {
        console.log('❌ No Service Worker registered');
      }
    });
  } else {
    console.log('❌ Service Worker not supported');
  }

  // Check HTTPS
  if (location.protocol === 'https:' || location.hostname === 'localhost') {
    results.https = true;
    console.log('✅ Running on HTTPS or localhost');
  } else {
    console.log('❌ Not running on HTTPS');
  }

  // Check Manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    results.manifest = true;
    console.log('✅ Manifest link found:', manifestLink.href);
    
    // Fetch and validate manifest
    fetch(manifestLink.href)
      .then(response => response.json())
      .then(manifest => {
        console.log('📄 Manifest content:', manifest);
        
        // Check required manifest fields
        const required = ['name', 'start_url', 'display', 'icons'];
        const missing = required.filter(field => !manifest[field]);
        
        if (missing.length === 0) {
          console.log('✅ All required manifest fields present');
        } else {
          console.log('❌ Missing manifest fields:', missing);
        }
        
        // Check icons
        if (manifest.icons && manifest.icons.length > 0) {
          results.icons = true;
          console.log('✅ Manifest icons found:', manifest.icons.length);
          
          const sizes = manifest.icons.map(icon => icon.sizes);
          const has192 = sizes.some(size => size.includes('192'));
          const has512 = sizes.some(size => size.includes('512'));
          
          if (has192 && has512) {
            console.log('✅ Required icon sizes found (192x192, 512x512)');
          } else {
            console.log('⚠️ Missing recommended icon sizes:', {
              '192x192': has192,
              '512x512': has512
            });
          }
        } else {
          console.log('❌ No manifest icons found');
        }
      })
      .catch(error => {
        console.log('❌ Error loading manifest:', error);
      });
  } else {
    console.log('❌ No manifest link found');
  }

  // Check for install prompt capability
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('✅ beforeinstallprompt event fired - PWA is installable!');
    results.installPrompt = true;
    deferredPrompt = e;
    e.preventDefault();
  });

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ PWA is already installed and running in standalone mode');
  } else {
    console.log('ℹ️ PWA is running in browser mode');
  }

  // Summary after a short delay
  setTimeout(() => {
    console.log('\n📊 PWA Readiness Summary:');
    console.table(results);
    
    const readyCount = Object.values(results).filter(Boolean).length;
    const totalChecks = Object.keys(results).length;
    
    console.log(`🎯 Ready: ${readyCount}/${totalChecks} checks passed`);
    
    if (readyCount === totalChecks) {
      console.log('🎉 PWA should be installable!');
    } else {
      console.log('⚠️ PWA may not be installable yet. Check failed items above.');
    }
  }, 2000);
}

// Run check when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkPWAReadiness);
} else {
  checkPWAReadiness();
}
