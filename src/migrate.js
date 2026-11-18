// One-time move of this browser's saved data from the old My Sous names to Auntie Ceci.
// Runs before anything else reads storage, so guests keep their kitchen, cookbook and settings.
(() => {
  try {
    const s = window.localStorage;
    if (!s || s.getItem("auntiececi:migrated") === "1") return;
    const old = [];
    for (let i = 0; i < s.length; i++) { const k = s.key(i); if (k && k.startsWith("mysous:")) old.push(k); }
    for (const k of old) {
      const nk = "auntiececi:" + k.slice("mysous:".length);
      if (s.getItem(nk) == null) s.setItem(nk, s.getItem(k));
    }
    for (const k of old) s.removeItem(k);
    s.setItem("auntiececi:migrated", "1");
  } catch { /* storage blocked */ }
})();
