var MailChimpListId = 'ed0fb4ac61';

// note: we're not using the product key for now
subscribeUser = function(user, productKey, levelKey){

  console.log('==== subscribing '+user.getEmail()+' to MailChimp… ====');
  // console.log(user)

  // add user to mailing list in group 'api'
  MailChimpAPIObject.listSubscribe({
    id: MailChimpListId,
    email_address: user.getEmail().replace('+', '%2B'),
    double_optin: false,
    merge_vars:{
      GROUPINGS: [{name: 'customer_status', groups: levelKey}, {name: 'customer_origin', groups: 'api'}]
    }
  }, function(error, data){

    if(error){

      if (error.code == 214){
        // if user already exists, we only change their 'customer_status' group
        console.log("User is already subscribed");

        MailChimpAPIObject.listUpdateMember({
          id: MailChimpListId,
          email_address: getEmail(user).replace('+', '%2B'),
          merge_vars:{
            GROUPINGS: [{name: 'customer_status', groups: levelKey}]
          }
        }, function(error, data){
          if(error){
            logError(error, "MailChimp");
          } else {
            console.log('==== changed group to '+levelKey+' ====')
          }
        });

      }else{
        // if it's a different type of error, we log it
        logError(error, "MailChimp");
      }
    }
  });
}

Meteor.methods({
  logEmail: function () {
    console.log(Meteor.user().email());
  },
  getInterestGroups: function(){
    // useful method to check our groups
    MailChimpAPIObject.listInterestGroupings({id: MailChimpListId}, function(error, data){
      if (error){
        console.log("Error!")
        console.log(error.message);  
      }else{
        console.log("Success!")
        console.log(JSON.stringify(data)); // Do something with your data!
      }
    });
  },
  subscribeUser: function(user){
      // for testing only; only let admins call this method
    if(this.userId && Users.isAdminById(this.userId))
      subscriberUser(user);
    else
      console.log('You need to be an admin user to call this');
  }
})