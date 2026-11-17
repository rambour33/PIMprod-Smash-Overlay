/* PSO — mise à l'échelle 1920×1080.
   L'overlay est conçu en 1920×1080 : si la fenêtre (navigateur, source OBS)
   a une autre taille, tout le contenu est agrandi/réduit d'un bloc et centré,
   pour que fond et contenu restent alignés. En 1920×1080 exact : aucun effet. */
(function () {
  var W = 1920, H = 1080;
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var b = document.body;
    if (!b) return;
    var s = Math.min(vw / W, vh / H);
    var ox = (vw - W * s) / 2, oy = (vh - H * s) / 2;
    // Neutralise le CSS par défaut d'OBS (body { margin: 0 auto }) qui décalerait tout
    b.style.setProperty('margin', '0', 'important');
    b.style.setProperty('position', 'absolute', 'important');
    b.style.left = '0'; b.style.top = '0';
    b.style.width = W + 'px';
    b.style.height = H + 'px';
    if (Math.abs(s - 1) < 0.001 && Math.abs(ox) < 0.5 && Math.abs(oy) < 0.5) { b.style.transform = ''; return; }
    document.documentElement.style.overflow = 'hidden';
    b.style.transformOrigin = '0 0';
    b.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fit); else fit();
})();
