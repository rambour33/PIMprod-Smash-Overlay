/* PSO — rechargement à chaud.
   Touche R dans la console du serveur → toutes les pages se rechargent.
   Touche S → le serveur redémarre, les pages se rechargent dès qu'il est revenu. */
(function () {
  function init() {
    var socket = io();
    var waitRestart = false;
    socket.on('psoReload', function (opts) {
      if (opts && opts.afterRestart) { waitRestart = true; return; }
      location.reload();
    });
    socket.on('connect', function () {
      if (waitRestart) location.reload();
    });
  }
  if (typeof io !== 'undefined') return init();
  var s = document.createElement('script');
  s.src = '/socket.io/socket.io.js';
  s.onload = init;
  document.head.appendChild(s);
})();
