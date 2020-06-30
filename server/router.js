// var bodyParser = Meteor.npmRequire('body-parser');
import bodyParser from 'body-parser';

// Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({extended: false}));
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

Picker.route('/download/:format', function(params, req, res, next) {
  var book = _.findWhere(formats, {title: params.format});
  res.writeHead(302, {'Location': book.url});
  res.end();
});

Picker.route('/gumroad', function(params, req, res, next) {
  
  // support both this.request.query and this.request.body just in case
  var options = req.query;
  if (_.isEmpty(options)) {
    options = req.body;
  }

  try {
    var url = Gumroad.handleWebhook(options);
    res.end(url);
  } catch (e) {
    console.log("Webhook failed:", e.message);
    console.log(e.stack);
    res.writeHead(500);
    res.end(e.message);
  }

});