var MailChimpAPI = Npm.require('mailchimp').MailChimpAPI;

var apiKey = '5671675ec132e2df5fd7ab3d88afa3d8-us2';

try { 
  MailChimpAPIObject = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
} catch (error) {
  console.log(error.message);
}

// list ID: ed0fb4ac61

// MailChimpAPIObject.campaigns({ start: 0, limit: 25 }, function (error, data) {
//     if (error)
//         console.log(error.message);
//     else
//         console.log(JSON.stringify(data)); // Do something with your data!
// });

// api.campaignStats({ cid : '/* CAMPAIGN ID */' }, function (error, data) {
//     if (error)
//         console.log(error.message);
//     else
//         console.log(JSON.stringify(data)); // Do something with your data!
// });