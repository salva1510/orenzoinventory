(() => {
  const installButton = document.getElementById("installAppBtn");
  let installPrompt = null;

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(error => {
        console.error("Orenzo PWA service worker registration failed:", error);
      });
    });
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  if (installButton) {
    if (isStandalone) {
      installButton.hidden = true;
    } else if (isIOS) {
      installButton.hidden = false;
      installButton.textContent = "How to Install";
      installButton.addEventListener("click", () => {
        alert('To install Orenzo Inventory on iPhone/iPad:\\n\\n1. Open this site in Safari.\\n2. Tap the Share button.\\n3. Choose "Add to Home Screen".\\n4. Tap Add.');
      });
    } else {
      window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        installPrompt = event;
        installButton.hidden = false;
      });
      window.addEventListener("appinstalled", () => {
        installPrompt = null;
        installButton.hidden = true;
      });
      installButton.addEventListener("click", async () => {
        if (!installPrompt) {
          alert("If Install App is not available yet, open the site in Chrome or Edge and use the browser menu > Install app.");
          return;
        }
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        installButton.hidden = true;
      });
    }
  }
})();
