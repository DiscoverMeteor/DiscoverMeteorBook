Meteor.methods({
  updateLastPosition: function(slug){
    if(this.userId) 
      var position = Positions.findOne({userId: this.userId});

    if (position) {
      Positions.update(position._id, {$set: {'slug': slug}});
    } else {
      Positions.insert({userId: Meteor.userId(), 'slug': slug});
    }
  }
});
