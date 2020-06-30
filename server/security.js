Meteor.methods({
  getHash: function(s){
    return CryptoJS.HmacSHA256(s, "MrJ2Ys2Tg9XbXrdb4lASpklnYCEQO0DVXr-hNjFi").toString();
  }
})