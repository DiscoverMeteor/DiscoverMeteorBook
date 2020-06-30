clearFlash = function () {
  Session.set('flash', null);
  $('.form-notice').removeClass().addClass("form-notice");
}

flash = function (message, type) {
  var type = typeof type === 'undefined' ? 'notification' : type;
  Session.set('flash', {message: message, type: type});
}