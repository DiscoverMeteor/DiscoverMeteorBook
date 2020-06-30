Meteor.startup(function() {
  Session.set('chaptersLoaded', false);

  // Analytics
  // mixpanel.init(Meteor.settings.public.mixpanel.account);
  mixpanel.init('fa88a89ec6dd6e929506ab2442affdab');
  Deps.autorun(function () {
    var user = Meteor.user();
    var email = user && ! Meteor.loggingIn() && user.getEmail();
    var book = Session.get("book");
    if (email && book) {
      
      Meteor.call('getHash', email, function(error, result){
        Session.set('userHash', result);
      });

      // Mixpanel
      mixpanel.identify(user._id);
      mixpanel.people.set({
        "$email": email,
        level: user.productLevel(book)
      });
      mixpanel.name_tag(email);

      if(userHash = Session.get('userHash')){
        // Intercom
        intercomSettings = {
          email: email,
          user_hash: userHash,
          widget: {
            activator: '#Intercom',
            use_counter: true
          },
          app_id: "36b9341d47d711cc22d7898536e2d480ebd71e20"
        };
        // FIXME
        // if(user.purchases){
        //   intercomSettings = _.extend(intercomSettings, {
        //     created_at: parseInt(getSignUpDate(user).toString().substring(0,10)),
        //     points: getUserPoints(user),
        //     level: getUserLevel(user).name,
        //     code: getOfferCode(user)
        //   });
        // }
        Intercom('boot', intercomSettings);
      }
    }
  });

}); 


// Meteor.subscribe('chapters', function(){
//   Session.set('chaptersLoaded', true); 
// });

// Meteor.subscribe('interviews', function(){
//   Session.set('interviewsLoaded', true); 
// });

// Meteor.subscribe('videos', function(){
//   Session.set('videosLoaded', true); 
// });

// Meteor.subscribe('thisUser');
// Meteor.subscribe('allUsers');

Meteor.subscribe('errors');

Meteor.subscribe('position');

// Meteor.subscribe('annotations');