Videos = new Meteor.Collection('videos');

if(Meteor.isServer){
  Meteor.startup(function(){
    Videos.remove({});  
    _.each(videosContent, function(video){
      Videos.insert(video);
    });
  });
}