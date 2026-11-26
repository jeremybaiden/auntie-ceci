/*! Auntie Ceci © 2026 Jeremy Baiden. All rights reserved. */
// "Add to home screen": works out which phone/browser the cook is using and
// shows the matching steps. On Android/desktop Chrome and Edge, when the browser
// offers it, a one-tap Install button appears too.
import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Device detection
// ---------------------------------------------------------------------------
const ua = () => (typeof navigator !== "undefined" ? navigator.userAgent || "" : "");

export function isStandalone() {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || window.matchMedia("(display-mode: minimal-ui)").matches)) return true;
  } catch { /* old browser */ }
  return window.navigator && window.navigator.standalone === true;
}

export function detectDevice() {
  const u = ua();
  const ios = /iPhone|iPad|iPod/i.test(u) || (/Macintosh/i.test(u) && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(u);
  // Instagram, Facebook, TikTok, Snapchat, LinkedIn, the Google app… can't add to the home screen.
  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Snapchat|TikTok|musical_ly|LinkedInApp|Twitter|Line\/|MicroMessenger|GSA\//i.test(u);
  let browser = "other";
  if (ios) browser = /CriOS/i.test(u) ? "chrome" : /FxiOS/i.test(u) ? "firefox" : /EdgiOS/i.test(u) ? "edge" : "safari";
  else if (/SamsungBrowser/i.test(u)) browser = "samsung";
  else if (/Edg\//i.test(u)) browser = "edge";
  else if (/Firefox\//i.test(u)) browser = "firefox";
  else if (/OPR\//i.test(u)) browser = "opera";
  else if (/Chrome\//i.test(u)) browser = "chrome";
  else if (/Safari\//i.test(u)) browser = "safari";
  const platform = ios ? "ios" : android ? "android" : "desktop";
  return { platform, browser, inApp, phone: ios || android };
}

// The browser's own install prompt (Chrome/Edge/Samsung on Android and desktop).
// It can fire before the app has drawn anything, so main.jsx calls this at startup.
let deferredPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());
export function captureInstallPrompt() {
  if (typeof window === "undefined" || window.__auntieInstallHooked) return;
  window.__auntieInstallHooked = true;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; notify(); });
  window.addEventListener("appinstalled", () => { deferredPrompt = null; notify(); });
}
function useInstallPrompt() {
  const [, force] = useState(0);
  useEffect(() => { const fn = () => force((n) => n + 1); listeners.add(fn); return () => listeners.delete(fn); }, []);
  return deferredPrompt;
}

const DISMISS_KEY = "auntiececi:installHintDismissed";
export function installHintDismissed() { try { return localStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; } }
function dismissInstallHint() { try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* storage blocked */ } }

// ---------------------------------------------------------------------------
// Text (7 languages)
// ---------------------------------------------------------------------------
const TX = {
  en: {
    navLabel: "Add to home screen", navSub: "Open Auntie Ceci like an app, in one tap",
    title: "Add Auntie Ceci to your home screen",
    intro: "Get an Auntie Ceci icon next to your other apps. It opens full screen, with no browser bars in the way. Nothing to download from an app store.",
    already: "You're already using Auntie Ceci from your home screen. You're all set!",
    install: "Install Auntie Ceci", installing: "Opening…",
    yourDevice: "Steps for your device", otherDevices: "Using a different device?",
    iphone: "iPhone / iPad", android: "Android", computer: "Computer",
    inApp: "You've opened this inside another app (like Instagram or TikTok), which can't add it to your home screen. Tap ••• or the share menu, choose Open in browser (Safari on iPhone, Chrome on Android), then follow the steps below.",
    iosSafari: ["Tap the Share button (a square with an arrow pointing up). It's at the bottom of the screen, or at the top on iPad. If you don't see it, tap ••• first.", "Scroll down and tap Add to Home Screen. If it's not in the list, tap Edit Actions… and add it.", "Leave Open as Web App switched on (if you see it), then tap Add."],
    iosChrome: ["Tap the Share button in the address bar (top right, a square with an arrow pointing up).", "Tap Add to Home Screen. You may need to scroll or tap More first.", "Tap Add."],
    iosOther: ["Tap the Share button (a square with an arrow pointing up). You may find it in the browser's menu.", "Tap Add to Home Screen.", "Tap Add. If you don't see the option, open this page in Safari and try there."],
    androidChrome: ["Tap the ⋮ menu at the top right.", "Tap Add to home screen (it may say Install app).", "Tap Install or Add. The icon appears on your home screen."],
    androidSamsung: ["Tap the ≡ menu at the bottom right.", "Tap Add page to, then Home screen.", "Tap Add."],
    androidOther: ["Open your browser's menu (often ⋮ at the top right).", "Tap Add to home screen or Install.", "Tap Add. If you don't see the option, open this page in Chrome and try there."],
    desktopChrome: ["Look for the install icon (a screen with a down arrow) at the right end of the address bar, and click it.", "No icon? Open the ⋮ menu and choose Cast, save and share, then Install page as app (in Edge: ••• then Apps, then Install this site as an app).", "Click Install. Auntie Ceci opens in its own window and can be pinned to your taskbar or Dock."],
    desktopSafari: ["In the menu bar, click File.", "Click Add to Dock.", "Click Add. Auntie Ceci appears in your Dock."],
    desktopOther: ["Firefox can't install web apps yet. Open this page in Chrome, Edge or Safari (Mac).", "Use the install icon in the address bar, or File, then Add to Dock in Safari.", "Click Install or Add."],
    tip: "Your kitchen, cookbook and history stay the same whether you open Auntie Ceci from the icon or the browser. Sign in to keep them in sync across devices.",
    hintTitle: "Add Auntie Ceci to your home screen", hintBody: "Open it like an app, with one tap.", hintShow: "Show me how", hintClose: "Not now", back: "Back",
  },
  es: {
    navLabel: "Añadir a la pantalla de inicio", navSub: "Abre Auntie Ceci como una app, con un toque",
    title: "Añade Auntie Ceci a tu pantalla de inicio",
    intro: "Ten un icono de Auntie Ceci junto a tus otras apps. Se abre a pantalla completa, sin las barras del navegador. No hace falta descargar nada de una tienda de apps.",
    already: "Ya estás usando Auntie Ceci desde tu pantalla de inicio. ¡Todo listo!",
    install: "Instalar Auntie Ceci", installing: "Abriendo…",
    yourDevice: "Pasos para tu dispositivo", otherDevices: "¿Usas otro dispositivo?",
    iphone: "iPhone / iPad", android: "Android", computer: "Computadora",
    inApp: "Abriste esto dentro de otra app (como Instagram o TikTok), que no puede añadirlo a tu pantalla de inicio. Toca ••• o el menú de compartir, elige Abrir en el navegador (Safari en iPhone, Chrome en Android) y sigue los pasos de abajo.",
    iosSafari: ["Toca el botón Compartir (un cuadrado con una flecha hacia arriba). Está abajo en la pantalla, o arriba en iPad. Si no lo ves, toca ••• primero.", "Desliza hacia abajo y toca Agregar a pantalla de inicio. Si no aparece, toca Editar acciones… y agrégalo.", "Deja activado Abrir como app web (si lo ves) y toca Agregar."],
    iosChrome: ["Toca el botón Compartir en la barra de direcciones (arriba a la derecha, un cuadrado con una flecha hacia arriba).", "Toca Agregar a pantalla de inicio. Quizás tengas que deslizar o tocar Más primero.", "Toca Agregar."],
    iosOther: ["Toca el botón Compartir (un cuadrado con una flecha hacia arriba). Puede estar en el menú del navegador.", "Toca Agregar a pantalla de inicio.", "Toca Agregar. Si no ves la opción, abre esta página en Safari e inténtalo ahí."],
    androidChrome: ["Toca el menú ⋮ arriba a la derecha.", "Toca Añadir a pantalla de inicio (puede decir Instalar app).", "Toca Instalar o Añadir. El icono aparecerá en tu pantalla de inicio."],
    androidSamsung: ["Toca el menú ≡ abajo a la derecha.", "Toca Añadir página a y luego Pantalla de inicio.", "Toca Añadir."],
    androidOther: ["Abre el menú del navegador (a menudo ⋮ arriba a la derecha).", "Toca Añadir a pantalla de inicio o Instalar.", "Toca Añadir. Si no ves la opción, abre esta página en Chrome e inténtalo ahí."],
    desktopChrome: ["Busca el icono de instalar (una pantalla con una flecha hacia abajo) al final de la barra de direcciones y haz clic.", "¿No hay icono? Abre el menú ⋮ y elige Enviar, guardar y compartir, luego Instalar página como app (en Edge: ••• luego Aplicaciones, luego Instalar este sitio como aplicación).", "Haz clic en Instalar. Auntie Ceci se abre en su propia ventana y puedes fijarla en la barra de tareas o el Dock."],
    desktopSafari: ["En la barra de menús, haz clic en Archivo.", "Haz clic en Añadir al Dock.", "Haz clic en Añadir. Auntie Ceci aparecerá en tu Dock."],
    desktopOther: ["Firefox todavía no puede instalar apps web. Abre esta página en Chrome, Edge o Safari (Mac).", "Usa el icono de instalar en la barra de direcciones, o Archivo y luego Añadir al Dock en Safari.", "Haz clic en Instalar o Añadir."],
    tip: "Tu cocina, recetario e historial son los mismos si abres Auntie Ceci desde el icono o desde el navegador. Inicia sesión para mantenerlos sincronizados entre dispositivos.",
    hintTitle: "Añade Auntie Ceci a tu pantalla de inicio", hintBody: "Ábrela como una app, con un toque.", hintShow: "Muéstrame cómo", hintClose: "Ahora no", back: "Atrás",
  },
  fr: {
    navLabel: "Ajouter à l'écran d'accueil", navSub: "Ouvrez Auntie Ceci comme une appli, en un geste",
    title: "Ajoutez Auntie Ceci à votre écran d'accueil",
    intro: "Ayez une icône Auntie Ceci à côté de vos autres applis. Elle s'ouvre en plein écran, sans les barres du navigateur. Rien à télécharger sur un store.",
    already: "Vous utilisez déjà Auntie Ceci depuis votre écran d'accueil. Tout est prêt !",
    install: "Installer Auntie Ceci", installing: "Ouverture…",
    yourDevice: "Étapes pour votre appareil", otherDevices: "Un autre appareil ?",
    iphone: "iPhone / iPad", android: "Android", computer: "Ordinateur",
    inApp: "Vous avez ouvert ceci dans une autre appli (comme Instagram ou TikTok), qui ne peut pas l'ajouter à l'écran d'accueil. Touchez ••• ou le menu de partage, choisissez Ouvrir dans le navigateur (Safari sur iPhone, Chrome sur Android), puis suivez les étapes ci-dessous.",
    iosSafari: ["Touchez le bouton Partager (un carré avec une flèche vers le haut). Il est en bas de l'écran, ou en haut sur iPad. Si vous ne le voyez pas, touchez d'abord •••.", "Faites défiler et touchez Sur l'écran d'accueil. S'il n'apparaît pas, touchez Modifier les actions… et ajoutez-le.", "Laissez Ouvrir comme app web activé (si vous le voyez), puis touchez Ajouter."],
    iosChrome: ["Touchez le bouton Partager dans la barre d'adresse (en haut à droite, un carré avec une flèche vers le haut).", "Touchez Sur l'écran d'accueil. Il faudra peut-être faire défiler ou toucher Plus d'abord.", "Touchez Ajouter."],
    iosOther: ["Touchez le bouton Partager (un carré avec une flèche vers le haut). Il peut se trouver dans le menu du navigateur.", "Touchez Sur l'écran d'accueil.", "Touchez Ajouter. Si l'option n'apparaît pas, ouvrez cette page dans Safari et réessayez."],
    androidChrome: ["Touchez le menu ⋮ en haut à droite.", "Touchez Ajouter à l'écran d'accueil (ou Installer l'appli).", "Touchez Installer ou Ajouter. L'icône apparaît sur votre écran d'accueil."],
    androidSamsung: ["Touchez le menu ≡ en bas à droite.", "Touchez Ajouter la page à, puis Écran d'accueil.", "Touchez Ajouter."],
    androidOther: ["Ouvrez le menu du navigateur (souvent ⋮ en haut à droite).", "Touchez Ajouter à l'écran d'accueil ou Installer.", "Touchez Ajouter. Si l'option n'apparaît pas, ouvrez cette page dans Chrome et réessayez."],
    desktopChrome: ["Cherchez l'icône d'installation (un écran avec une flèche vers le bas) au bout de la barre d'adresse, et cliquez dessus.", "Pas d'icône ? Ouvrez le menu ⋮ et choisissez Caster, enregistrer et partager, puis Installer la page en tant qu'appli (dans Edge : ••• puis Applications, puis Installer ce site en tant qu'application).", "Cliquez sur Installer. Auntie Ceci s'ouvre dans sa propre fenêtre, que vous pouvez épingler à la barre des tâches ou au Dock."],
    desktopSafari: ["Dans la barre des menus, cliquez sur Fichier.", "Cliquez sur Ajouter au Dock.", "Cliquez sur Ajouter. Auntie Ceci apparaît dans votre Dock."],
    desktopOther: ["Firefox ne peut pas encore installer d'applis web. Ouvrez cette page dans Chrome, Edge ou Safari (Mac).", "Utilisez l'icône d'installation dans la barre d'adresse, ou Fichier puis Ajouter au Dock dans Safari.", "Cliquez sur Installer ou Ajouter."],
    tip: "Votre cuisine, votre livre de recettes et votre historique sont les mêmes depuis l'icône ou le navigateur. Connectez-vous pour les synchroniser entre vos appareils.",
    hintTitle: "Ajoutez Auntie Ceci à votre écran d'accueil", hintBody: "Ouvrez-la comme une appli, en un geste.", hintShow: "Montrez-moi", hintClose: "Plus tard", back: "Retour",
  },
  pt: {
    navLabel: "Adicionar à tela de início", navSub: "Abra a Auntie Ceci como um app, com um toque",
    title: "Adicione a Auntie Ceci à sua tela de início",
    intro: "Tenha um ícone da Auntie Ceci ao lado dos seus outros apps. Ele abre em tela cheia, sem as barras do navegador. Não precisa baixar nada de uma loja de apps.",
    already: "Você já está usando a Auntie Ceci pela tela de início. Tudo pronto!",
    install: "Instalar Auntie Ceci", installing: "Abrindo…",
    yourDevice: "Passos para o seu aparelho", otherDevices: "Usando outro aparelho?",
    iphone: "iPhone / iPad", android: "Android", computer: "Computador",
    inApp: "Você abriu isto dentro de outro app (como Instagram ou TikTok), que não consegue adicionar à tela de início. Toque em ••• ou no menu de compartilhar, escolha Abrir no navegador (Safari no iPhone, Chrome no Android) e siga os passos abaixo.",
    iosSafari: ["Toque no botão Compartilhar (um quadrado com uma seta para cima). Fica na parte de baixo da tela, ou no topo no iPad. Se não aparecer, toque em ••• primeiro.", "Role para baixo e toque em Adicionar à Tela de Início. Se não estiver na lista, toque em Editar Ações… e adicione.", "Deixe Abrir como App Web ativado (se aparecer) e toque em Adicionar."],
    iosChrome: ["Toque no botão Compartilhar na barra de endereço (no canto superior direito, um quadrado com uma seta para cima).", "Toque em Adicionar à Tela de Início. Talvez seja preciso rolar ou tocar em Mais antes.", "Toque em Adicionar."],
    iosOther: ["Toque no botão Compartilhar (um quadrado com uma seta para cima). Ele pode estar no menu do navegador.", "Toque em Adicionar à Tela de Início.", "Toque em Adicionar. Se a opção não aparecer, abra esta página no Safari e tente lá."],
    androidChrome: ["Toque no menu ⋮ no canto superior direito.", "Toque em Adicionar à tela inicial (pode aparecer Instalar app).", "Toque em Instalar ou Adicionar. O ícone aparece na sua tela inicial."],
    androidSamsung: ["Toque no menu ≡ no canto inferior direito.", "Toque em Adicionar página a e depois em Tela inicial.", "Toque em Adicionar."],
    androidOther: ["Abra o menu do navegador (geralmente ⋮ no canto superior direito).", "Toque em Adicionar à tela inicial ou Instalar.", "Toque em Adicionar. Se a opção não aparecer, abra esta página no Chrome e tente lá."],
    desktopChrome: ["Procure o ícone de instalar (uma tela com uma seta para baixo) no fim da barra de endereço e clique nele.", "Sem ícone? Abra o menu ⋮ e escolha Transmitir, salvar e compartilhar, depois Instalar página como app (no Edge: ••• depois Aplicativos, depois Instalar este site como um aplicativo).", "Clique em Instalar. A Auntie Ceci abre na própria janela e pode ser fixada na barra de tarefas ou no Dock."],
    desktopSafari: ["Na barra de menus, clique em Arquivo.", "Clique em Adicionar ao Dock.", "Clique em Adicionar. A Auntie Ceci aparece no seu Dock."],
    desktopOther: ["O Firefox ainda não instala apps web. Abra esta página no Chrome, Edge ou Safari (Mac).", "Use o ícone de instalar na barra de endereço, ou Arquivo e depois Adicionar ao Dock no Safari.", "Clique em Instalar ou Adicionar."],
    tip: "Sua cozinha, livro de receitas e histórico são os mesmos abrindo pelo ícone ou pelo navegador. Entre na sua conta para sincronizá-los entre aparelhos.",
    hintTitle: "Adicione a Auntie Ceci à sua tela de início", hintBody: "Abra como um app, com um toque.", hintShow: "Mostrar como", hintClose: "Agora não", back: "Voltar",
  },
  hi: {
    navLabel: "होम स्क्रीन पर जोड़ें", navSub: "Auntie Ceci को एक टैप में ऐप की तरह खोलें",
    title: "Auntie Ceci को अपनी होम स्क्रीन पर जोड़ें",
    intro: "अपने दूसरे ऐप्स के पास Auntie Ceci का आइकन पाएँ। यह पूरी स्क्रीन पर खुलता है, ब्राउज़र की पट्टियों के बिना। ऐप स्टोर से कुछ डाउनलोड नहीं करना है।",
    already: "आप पहले से ही Auntie Ceci को अपनी होम स्क्रीन से इस्तेमाल कर रहे हैं। सब तैयार है!",
    install: "Auntie Ceci इंस्टॉल करें", installing: "खुल रहा है…",
    yourDevice: "आपके डिवाइस के लिए चरण", otherDevices: "कोई दूसरा डिवाइस इस्तेमाल कर रहे हैं?",
    iphone: "iPhone / iPad", android: "Android", computer: "कंप्यूटर",
    inApp: "आपने इसे किसी दूसरे ऐप (जैसे Instagram या TikTok) के अंदर खोला है, जो इसे होम स्क्रीन पर नहीं जोड़ सकता। ••• या शेयर मेनू पर टैप करें, ब्राउज़र में खोलें चुनें (iPhone पर Safari, Android पर Chrome), फिर नीचे दिए चरण अपनाएँ।",
    iosSafari: ["शेयर बटन पर टैप करें (ऊपर की ओर तीर वाला चौकोर)। यह स्क्रीन के नीचे होता है, या iPad पर ऊपर। न दिखे तो पहले ••• पर टैप करें।", "नीचे स्क्रॉल करें और होम स्क्रीन में जोड़ें पर टैप करें। सूची में न हो तो कार्रवाइयाँ संपादित करें… पर टैप करके इसे जोड़ें।", "वेब ऐप की तरह खोलें चालू रहने दें (अगर दिखे), फिर जोड़ें पर टैप करें।"],
    iosChrome: ["एड्रेस बार में शेयर बटन पर टैप करें (ऊपर दाईं ओर, ऊपर की ओर तीर वाला चौकोर)।", "होम स्क्रीन में जोड़ें पर टैप करें। शायद पहले स्क्रॉल करना या और पर टैप करना पड़े।", "जोड़ें पर टैप करें।"],
    iosOther: ["शेयर बटन पर टैप करें (ऊपर की ओर तीर वाला चौकोर)। यह ब्राउज़र के मेनू में हो सकता है।", "होम स्क्रीन में जोड़ें पर टैप करें।", "जोड़ें पर टैप करें। विकल्प न दिखे तो यह पेज Safari में खोलकर वहाँ कोशिश करें।"],
    androidChrome: ["ऊपर दाईं ओर ⋮ मेनू पर टैप करें।", "होम स्क्रीन पर जोड़ें पर टैप करें (यह ऐप इंस्टॉल करें भी लिखा हो सकता है)।", "इंस्टॉल करें या जोड़ें पर टैप करें। आइकन आपकी होम स्क्रीन पर आ जाएगा।"],
    androidSamsung: ["नीचे दाईं ओर ≡ मेनू पर टैप करें।", "पेज यहाँ जोड़ें पर, फिर होम स्क्रीन पर टैप करें।", "जोड़ें पर टैप करें।"],
    androidOther: ["अपने ब्राउज़र का मेनू खोलें (अक्सर ऊपर दाईं ओर ⋮)।", "होम स्क्रीन पर जोड़ें या इंस्टॉल करें पर टैप करें।", "जोड़ें पर टैप करें। विकल्प न दिखे तो यह पेज Chrome में खोलकर वहाँ कोशिश करें।"],
    desktopChrome: ["एड्रेस बार के दाएँ सिरे पर इंस्टॉल आइकन (नीचे तीर वाली स्क्रीन) देखें और उस पर क्लिक करें।", "आइकन नहीं है? ⋮ मेनू खोलें और कास्ट करें, सेव करें और शेयर करें, फिर पेज को ऐप के रूप में इंस्टॉल करें चुनें (Edge में: ••• फिर ऐप्स, फिर इस साइट को ऐप के रूप में इंस्टॉल करें)।", "इंस्टॉल करें पर क्लिक करें। Auntie Ceci अपनी अलग विंडो में खुलेगा और इसे टास्कबार या Dock में पिन कर सकते हैं।"],
    desktopSafari: ["मेनू बार में फ़ाइल पर क्लिक करें।", "Dock में जोड़ें पर क्लिक करें।", "जोड़ें पर क्लिक करें। Auntie Ceci आपके Dock में दिखेगा।"],
    desktopOther: ["Firefox अभी वेब ऐप इंस्टॉल नहीं कर सकता। यह पेज Chrome, Edge या Safari (Mac) में खोलें।", "एड्रेस बार में इंस्टॉल आइकन, या Safari में फ़ाइल फिर Dock में जोड़ें इस्तेमाल करें।", "इंस्टॉल करें या जोड़ें पर क्लिक करें।"],
    tip: "आइकन से खोलें या ब्राउज़र से, आपकी रसोई, कुकबुक और इतिहास वही रहते हैं। उन्हें सभी डिवाइस पर एक जैसा रखने के लिए साइन इन करें।",
    hintTitle: "Auntie Ceci को होम स्क्रीन पर जोड़ें", hintBody: "एक टैप में ऐप की तरह खोलें।", hintShow: "तरीका दिखाएँ", hintClose: "अभी नहीं", back: "वापस",
  },
  zh: {
    navLabel: "添加到主屏幕", navSub: "一键像应用一样打开 Auntie Ceci",
    title: "把 Auntie Ceci 添加到主屏幕",
    intro: "在其他应用旁边放一个 Auntie Ceci 图标。它会全屏打开，没有浏览器栏挡着。不需要从应用商店下载。",
    already: "你已经在用主屏幕上的 Auntie Ceci 了。一切就绪！",
    install: "安装 Auntie Ceci", installing: "正在打开…",
    yourDevice: "你的设备的步骤", otherDevices: "用的是其他设备？",
    iphone: "iPhone / iPad", android: "Android", computer: "电脑",
    inApp: "你是在另一个应用（如 Instagram 或抖音）里打开的，它无法添加到主屏幕。请点按 ••• 或分享菜单，选择“在浏览器中打开”（iPhone 用 Safari，Android 用 Chrome），然后按下面的步骤操作。",
    iosSafari: ["点按“分享”按钮（一个带向上箭头的方框）。它在屏幕底部，iPad 上在顶部。如果看不到，请先点按 •••。", "向下滚动，点按“添加到主屏幕”。如果列表里没有，点按“编辑操作…”把它加上。", "保持“作为网页 App 打开”开启（如果有这个选项），然后点按“添加”。"],
    iosChrome: ["点按地址栏里的“分享”按钮（右上角，一个带向上箭头的方框）。", "点按“添加到主屏幕”。可能需要先滚动或点按“更多”。", "点按“添加”。"],
    iosOther: ["点按“分享”按钮（一个带向上箭头的方框），它可能在浏览器的菜单里。", "点按“添加到主屏幕”。", "点按“添加”。如果没有这个选项，请在 Safari 中打开本页再试。"],
    androidChrome: ["点按右上角的 ⋮ 菜单。", "点按“添加到主屏幕”（也可能显示为“安装应用”）。", "点按“安装”或“添加”。图标会出现在你的主屏幕上。"],
    androidSamsung: ["点按右下角的 ≡ 菜单。", "点按“添加页面到”，再点按“主屏幕”。", "点按“添加”。"],
    androidOther: ["打开浏览器菜单（通常是右上角的 ⋮）。", "点按“添加到主屏幕”或“安装”。", "点按“添加”。如果没有这个选项，请在 Chrome 中打开本页再试。"],
    desktopChrome: ["在地址栏右端找到安装图标（一个带向下箭头的屏幕），点击它。", "没有图标？打开 ⋮ 菜单，选择“投放、保存和分享”，再选“将页面作为应用安装”（Edge：••• → 应用 → 将此站点作为应用安装）。", "点击“安装”。Auntie Ceci 会在自己的窗口中打开，可以固定到任务栏或程序坞。"],
    desktopSafari: ["在菜单栏中点击“文件”。", "点击“添加到程序坞”。", "点击“添加”。Auntie Ceci 会出现在程序坞中。"],
    desktopOther: ["Firefox 暂时不能安装网页应用。请在 Chrome、Edge 或 Safari（Mac）中打开本页。", "使用地址栏里的安装图标，或在 Safari 中选择“文件”→“添加到程序坞”。", "点击“安装”或“添加”。"],
    tip: "无论从图标还是浏览器打开，你的厨房、食谱本和记录都一样。登录后可在多台设备间同步。",
    hintTitle: "把 Auntie Ceci 添加到主屏幕", hintBody: "一键像应用一样打开。", hintShow: "教我怎么做", hintClose: "以后再说", back: "返回",
  },
  ar: {
    navLabel: "إضافة إلى الشاشة الرئيسية", navSub: "افتح Auntie Ceci كتطبيق بلمسة واحدة",
    title: "أضف Auntie Ceci إلى شاشتك الرئيسية",
    intro: "احصل على أيقونة Auntie Ceci بجانب تطبيقاتك الأخرى. تفتح بملء الشاشة دون أشرطة المتصفح. لا حاجة لتنزيل أي شيء من متجر التطبيقات.",
    already: "أنت تستخدم Auntie Ceci من شاشتك الرئيسية بالفعل. كل شيء جاهز!",
    install: "تثبيت Auntie Ceci", installing: "جارٍ الفتح…",
    yourDevice: "خطوات جهازك", otherDevices: "تستخدم جهازًا آخر؟",
    iphone: "iPhone / iPad", android: "Android", computer: "الكمبيوتر",
    inApp: "فتحت هذه الصفحة داخل تطبيق آخر (مثل Instagram أو TikTok) لا يمكنه إضافتها إلى الشاشة الرئيسية. اضغط على ••• أو قائمة المشاركة، واختر الفتح في المتصفح (Safari على iPhone وChrome على Android)، ثم اتبع الخطوات أدناه.",
    iosSafari: ["اضغط على زر المشاركة (مربع به سهم يشير للأعلى). تجده أسفل الشاشة، أو في الأعلى على iPad. إن لم تره فاضغط على ••• أولًا.", "مرّر للأسفل واضغط على إضافة إلى الشاشة الرئيسية. إن لم يكن في القائمة فاضغط على تعديل الإجراءات… وأضفه.", "اترك خيار الفتح كتطبيق ويب مفعّلًا (إن ظهر)، ثم اضغط على إضافة."],
    iosChrome: ["اضغط على زر المشاركة في شريط العنوان (أعلى اليمين، مربع به سهم يشير للأعلى).", "اضغط على إضافة إلى الشاشة الرئيسية. قد تحتاج إلى التمرير أو الضغط على المزيد أولًا.", "اضغط على إضافة."],
    iosOther: ["اضغط على زر المشاركة (مربع به سهم يشير للأعلى). قد تجده في قائمة المتصفح.", "اضغط على إضافة إلى الشاشة الرئيسية.", "اضغط على إضافة. إن لم يظهر الخيار فافتح هذه الصفحة في Safari وحاول هناك."],
    androidChrome: ["اضغط على قائمة ⋮ أعلى الشاشة.", "اضغط على إضافة إلى الشاشة الرئيسية (قد يظهر تثبيت التطبيق).", "اضغط على تثبيت أو إضافة. ستظهر الأيقونة على شاشتك الرئيسية."],
    androidSamsung: ["اضغط على قائمة ≡ أسفل الشاشة.", "اضغط على إضافة الصفحة إلى، ثم الشاشة الرئيسية.", "اضغط على إضافة."],
    androidOther: ["افتح قائمة المتصفح (غالبًا ⋮ أعلى الشاشة).", "اضغط على إضافة إلى الشاشة الرئيسية أو تثبيت.", "اضغط على إضافة. إن لم يظهر الخيار فافتح هذه الصفحة في Chrome وحاول هناك."],
    desktopChrome: ["ابحث عن أيقونة التثبيت (شاشة بسهم للأسفل) في طرف شريط العنوان وانقر عليها.", "لا توجد أيقونة؟ افتح قائمة ⋮ واختر البث والحفظ والمشاركة، ثم تثبيت الصفحة كتطبيق (في Edge: ••• ثم التطبيقات ثم تثبيت هذا الموقع كتطبيق).", "انقر على تثبيت. سيفتح Auntie Ceci في نافذته الخاصة ويمكنك تثبيته في شريط المهام أو Dock."],
    desktopSafari: ["في شريط القوائم، انقر على ملف.", "انقر على إضافة إلى Dock.", "انقر على إضافة. سيظهر Auntie Ceci في Dock."],
    desktopOther: ["لا يدعم Firefox تثبيت تطبيقات الويب بعد. افتح هذه الصفحة في Chrome أو Edge أو Safari (Mac).", "استخدم أيقونة التثبيت في شريط العنوان، أو ملف ثم إضافة إلى Dock في Safari.", "انقر على تثبيت أو إضافة."],
    tip: "مطبخك وكتاب وصفاتك وسجلك هي نفسها سواء فتحت Auntie Ceci من الأيقونة أو من المتصفح. سجّل الدخول لمزامنتها بين أجهزتك.",
    hintTitle: "أضف Auntie Ceci إلى شاشتك الرئيسية", hintBody: "افتحه كتطبيق بلمسة واحدة.", hintShow: "أرني الطريقة", hintClose: "ليس الآن", back: "رجوع",
  },
};
export const installText = (lang, key) => (TX[lang] && TX[lang][key]) || TX.en[key];

function stepsFor(platform, browser) {
  if (platform === "ios") return browser === "safari" ? "iosSafari" : browser === "chrome" || browser === "edge" ? "iosChrome" : "iosOther";
  if (platform === "android") return browser === "samsung" ? "androidSamsung" : browser === "chrome" || browser === "edge" ? "androidChrome" : "androidOther";
  return browser === "safari" ? "desktopSafari" : browser === "chrome" || browser === "edge" || browser === "opera" ? "desktopChrome" : "desktopOther";
}

// Little pictures of the buttons people look for.
const ShareGlyph = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: "-3px" }}>
    <path d="M12 3v12" /><path d="m8 7 4-4 4 4" /><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
  </svg>
);
const PlusSquare = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: "-3px" }}>
    <rect x="3" y="3" width="18" height="18" rx="4" /><path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);
function stepGlyph(set, i, color) {
  if (set.startsWith("ios")) return i === 0 ? <ShareGlyph color={color} /> : i === 1 ? <PlusSquare color={color} /> : "✓";
  if (set === "androidChrome" || set === "androidOther") return i === 0 ? "⋮" : i === 1 ? <PlusSquare color={color} /> : "✓";
  if (set === "androidSamsung") return i === 0 ? "≡" : i === 1 ? <PlusSquare color={color} /> : "✓";
  return String(i + 1);
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------
export function InstallScreen({ lang, colors: C, styles: S, onBack, ArrowLeft }) {
  const tx = (k) => installText(lang, k);
  const device = detectDevice();
  const standalone = isStandalone();
  const prompt = useInstallPrompt();
  const [busy, setBusy] = useState(false);
  const mine = device.platform;
  const [shown, setShown] = useState(mine);
  const browserFor = (p) => (p === mine ? device.browser : p === "ios" ? "safari" : "chrome");
  const set = stepsFor(shown, browserFor(shown));
  const steps = installText(lang, set);

  async function install() {
    if (!deferredPrompt) return;
    setBusy(true);
    try { deferredPrompt.prompt(); await deferredPrompt.userChoice; } catch { /* closed */ }
    deferredPrompt = null; notify(); setBusy(false);
  }

  const card = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", marginTop: 12 };
  const tabs = [["ios", tx("iphone")], ["android", tx("android")], ["desktop", tx("computer")]];
  return (
    <div style={S.screenPad}>
      <button onClick={onBack} style={S.backRow}>
        <ArrowLeft className="ms-flip" size={16} color={C.inkMuted} />
        <span style={{ marginInlineStart: 6, color: C.inkMuted, fontSize: 13 }}>{tx("back")}</span>
      </button>
      <h1 style={{ ...S.h1, marginTop: 6 }}>{tx("title")}</h1>
      <p style={{ ...S.subtext, fontSize: 14, lineHeight: 1.5 }}>{tx("intro")}</p>

      {standalone ? (
        <div role="status" style={{ ...card, background: C.sageSofter, fontWeight: 600, color: C.primaryText }}>✓ {tx("already")}</div>
      ) : (
        <>
          {prompt && (
            <button onClick={install} disabled={busy} style={{ ...S.primaryButton, marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <PlusSquare color="#fff" /> {busy ? tx("installing") : tx("install")}
            </button>
          )}
          {device.inApp && <div role="note" style={{ ...card, background: C.accentSofter, color: C.ink, fontSize: 14, lineHeight: 1.5 }}>⚠️ {tx("inApp")}</div>}

          <div style={{ ...S.sectionLabel, marginTop: 20 }}>{shown === mine ? tx("yourDevice") : tabs.find((x) => x[0] === shown)[1]}</div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {steps.map((s, i) => (
              <li key={set + i} style={{ ...card, marginTop: i ? 10 : 0, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: C.sage, color: C.primaryText, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{stepGlyph(set, i, C.primaryText)}</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink, paddingTop: 6 }}><b style={{ marginInlineEnd: 6 }}>{i + 1}.</b>{s}</span>
              </li>
            ))}
          </ol>

          <div style={{ ...S.sectionLabel, marginTop: 22 }}>{tx("otherDevices")}</div>
          <div role="tablist" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map(([id, label]) => (
              <button key={id} role="tab" aria-selected={shown === id} onClick={() => setShown(id)}
                style={{ padding: "8px 14px", borderRadius: 999, border: `1px solid ${shown === id ? C.primary : C.line}`, background: shown === id ? C.sage : C.card, color: C.ink, fontWeight: shown === id ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      <p style={{ ...S.subtext, marginTop: 20, lineHeight: 1.5 }}>💡 {tx("tip")}</p>
    </div>
  );
}

// A small, dismissible card on Home (phones only, not already installed).
export function InstallHint({ lang, colors: C, onOpen, Smartphone, X }) {
  const [hidden, setHidden] = useState(() => isStandalone() || installHintDismissed() || !detectDevice().phone);
  if (hidden) return null;
  const tx = (k) => installText(lang, k);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: "12px 12px 12px 14px", borderRadius: 14, background: C.sageSofter, border: `1px solid ${C.line}` }}>
      <span aria-hidden="true" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center" }}><Smartphone size={19} color={C.primaryText} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, lineHeight: 1.3 }}>{tx("hintTitle")}</div>
        <div style={{ fontSize: 12.5, color: C.inkMuted, marginTop: 2 }}>{tx("hintBody")}</div>
        <button onClick={onOpen} style={{ marginTop: 6, padding: 0, background: "none", border: "none", color: C.primaryText, fontWeight: 700, fontSize: 13.5, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>{tx("hintShow")}</button>
      </div>
      <button onClick={() => { dismissInstallHint(); setHidden(true); }} aria-label={tx("hintClose")} title={tx("hintClose")}
        style={{ alignSelf: "flex-start", width: 32, height: 32, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={16} color={C.inkMuted} />
      </button>
    </div>
  );
}
