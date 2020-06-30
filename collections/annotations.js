// Annotations = new Meteor.Collection('annotations');

// Annotations.allow({
//   update: ownsDocument,
//   remove: ownsDocument
// });

// Annotations.deny({
//   update: function(userId, post, fieldNames) {
//     // may only edit the following three fields:
//     return (_.without(fieldNames, 'url', 'title').length > 0);
//   }
// });


// Meteor.methods({
//   annotate: function(properties) {
//     var user = Meteor.user();

//     // ensure the user is logged in
//     if (!user)
//       throw new Meteor.Error(401, "You need to login to add annotations.");
    
//     // ensure the post has a title
//     if (!properties.content)
//       throw new Meteor.Error(422, 'Please fill in the content.');
    
//     // pick out the whitelisted keys
//     var annotation = _.extend(_.pick(properties, 'item', 'slug', 'content'), {
//       userId: user._id, 
//       createdAt: new Date().getTime()
//     });
    
//     var annotationId = Annotations.insert(annotation);
    
//     return annotationId;
//   }
// });