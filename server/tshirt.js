sendTshirt = function (user, params) {

  var url = 'http://foobar.herokuapp.com/';

  params.permalink = 'DM t-shirt'; // replace Premium Edition code with name of t-shirt
  if(Meteor.absoluteUrl().indexOf('0.0.0.0') === -1 && Meteor.absoluteUrl().indexOf('localhost') === -1 ){
    console.log('==== Sending t-shirt to user ====')
  
    var queryString = qs.stringify(params);
    var url = url+'?'+queryString;
    console.log(url);
  
    HTTP.get(url, {}, function (error, result) {
      if(!error){
        console.log('Sent.');
        Meteor.users.update(user._id, {$inc: {sentTshirt: 1}});
      }else{
        console.log(error);
      }
    });
  } else {
    console.log('==== Sending t-shirt to user (test, not actually sending!) ====')
  }
}