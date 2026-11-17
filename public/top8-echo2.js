/* TOP 8 · ECHO 2 — rendu dédié (affiché uniquement avec le thème echo2).
   Utilise les mêmes données que le Top 8 standard : /api/top8 + event top8Update. */
(function () {
  var root = document.getElementById('top8-root');
  var el   = document.getElementById('e2-top8');
  if (!root || !el) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function charKey(name) { return String(name || '').replace(/\s*\/\s*/g, '-'); }
  function pad2(n) { return String(n || '').padStart(2, '0'); }

  // Image avec repli sur la couleur 00, puis masquage
  function img(cls, base, char, color) {
    if (!char) return '';
    var k = encodeURIComponent(charKey(char));
    var src = base + k + '_' + pad2(color || 0) + '.png';
    var fb  = base + k + '_00.png';
    return '<img class="' + cls + '" src="' + src + '" alt="" ' +
      'onerror="if(this.src.indexOf(\'_00.png\')<0){this.src=\'' + fb + '\'}else{this.style.display=\'none\'}">';
  }
  var FULL  = '/full/chara_1_';
  var STOCK = '/Stock%20Icons/chara_2_';

  // Texte circulaire sur l'étiquette du vinyle
  function labelText() {
    var txt = 'ECHO 2 · ACADEMIC LAN · TOP 8 · ';
    var out = '', n = txt.length;
    for (var i = 0; i < n; i++) {
      out += '<span style="transform:rotate(' + (i * 360 / n).toFixed(2) + 'deg)">' + esc(txt[i]) + '</span>';
    }
    return out;
  }

  function build(state) {
    var players = (state.players || []).slice(0, 8).slice()
      .sort(function (a, b) { return (a.placement || 99) - (b.placement || 99); });
    var champ = players[0] || {};
    var rest  = players.slice(1);

    var rows = rest.map(function (p, i) {
      var big  = i < 2; // 2e et 3e : grandes lignes avec l'art du perso
      var name = p.name ? esc(p.name) : '<span class="e2-tbd">TBD</span>';
      var tag  = p.tag ? '<div class="e2-tag">' + esc(p.tag) + '</div>' : '';
      var delay = (0.65 + i * 0.09).toFixed(2);
      return '<div class="e2-row' + (big ? ' big' : '') + '" style="animation-delay:' + delay + 's">' +
        '<div class="e2-no">' + pad2(p.placement) + '</div>' +
        (big ? '' : img('e2-icon', STOCK, p.character, p.characterColor)) +
        '<div class="e2-who">' + tag + '<div class="e2-name">' + name + '</div></div>' +
        (big
          ? '<div class="e2-art">' + img('', FULL, p.character, p.characterColor) + '</div>'
          : '<div class="e2-eq"><i></i><i></i><i></i><i></i><i></i></div>') +
      '</div>';
    }).join('');

    var champName = champ.name ? esc(champ.name) : '<span class="e2-tbd">TBD</span>';
    var eventTxt  = [state.eventName || state.tournamentName, state.eventDate].filter(Boolean).map(esc).join('  ·  ');

    el.innerHTML =
      '<div class="e2-bg"></div>' +

      '<div class="e2-vinyl"><div class="e2-vinyl-spin">' +
        '<div class="e2-label"><div class="e2-label-txt">' + labelText() + '</div></div>' +
      '</div></div>' +

      '<div class="e2-champ-art">' + img('', FULL, champ.character, champ.characterColor) + '</div>' +
      '<div class="e2-champ-plate">' +
        '<div class="e2-champ-no">01</div>' +
        '<div class="e2-champ-txt">' +
          '<div class="e2-champ-kicker">Champion</div>' +
          '<div class="e2-champ-name">' + champName + '</div>' +
          (champ.tag ? '<div class="e2-champ-tag">' + esc(champ.tag) + '</div>' : '') +
        '</div>' +
      '</div>' +

      '<div class="e2-head">' +
        '<div class="e2-logo">ECHO 2</div>' +
        '<div class="e2-sub">Top 8 <b>·</b> Smash Bros Ultimate</div>' +
      '</div>' +

      '<div class="e2-tape">' +
        '<div class="e2-tape-label">' +
          '<div class="e2-tape-title">Top 8</div><div class="e2-tape-side">FACE A</div>' +
          '<div class="e2-tape-window"><div class="e2-reel l"></div><div class="e2-reel r"></div></div>' +
        '</div>' +
        '<div class="e2-tape-bottom"></div>' +
      '</div>' +

      '<div class="e2-list">' +
        '<div class="e2-list-head"><div class="e2-list-title">Tracklist</div>' +
        '<div class="e2-list-meta">Résultats finaux</div></div>' +
        rows +
      '</div>' +

      '<div class="e2-player"><div class="e2-play"></div>' +
        '<div class="e2-event">' + eventTxt + '</div>' +
        '<div class="e2-track"><b></b></div>' +
      '</div>';
  }

  var _last = null;
  var _wasHidden = true;

  function render(state) {
    _last = state;
    var sig = JSON.stringify([state.players, state.eventName, state.tournamentName, state.eventDate]);
    var visible = !!state.visible;
    // Reconstruire uniquement si les données changent (évite de relancer les animations)
    if (sig !== el.dataset.sig) {
      el.dataset.sig = sig;
      build(state);
      replay();
    } else if (visible && _wasHidden) {
      replay();
    }
    _wasHidden = !visible;
  }

  // Relance les animations d'entrée
  function replay() {
    el.classList.remove('e2-in');
    void el.offsetWidth;
    el.classList.add('e2-in');
  }

  fetch('/api/top8').then(function (r) { return r.json(); }).then(render).catch(function () {});
  io().on('top8Update', render);

  window.E2Top8 = { render: render, replay: replay, last: function () { return _last; } };
})();
