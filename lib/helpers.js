Helpers = {};

s3Url = 'https://s3.amazonaws.com/discovermeteor/photos/large/';

slugify = function(text){
  return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}

var sum = function(a, b){
  return a + b;
}

logError = function(error, type){
  console.log("Error! \n", error.message);
  error.type = type;
  Errors.insert(error); 
}

Helpers.prevChapter = function(currentChapter){
  return Chapters.findOne({number: {$lt: currentChapter.number }}, {sort: {number: -1}});
}

Helpers.nextChapter = function(currentChapter){
  return Chapters.findOne({number: {$gt: currentChapter.number }}, {sort: {number: 1}});
}

Helpers.getPrevChapter = function (currentChapter, chapters) {
  var chapterPosition = _.indexOf(_.pluck(chapters, 'slug'), currentChapter.slug);
  return chapters[chapterPosition-1];
}

Helpers.getNextChapter = function (currentChapter, chapters) {
  var chapterPosition = _.indexOf(_.pluck(chapters, 'slug'), currentChapter.slug);
  return chapters[chapterPosition+1];
}

loadFonts = function () {
  // Google Webfont Loader
  if (typeof WebFontConfig == 'undefined'){
    WebFontConfig = {
      typekit: { id: 'rcr2ohz' }
    };
    (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  }
}

// copied from oauth/oauth_client.js -- return the secret without removing it
_retrieveCredentialSecret = function(token) {
  var secret = OAuth._retrieveCredentialSecret(token);
  OAuth._handleCredentialSecret(token, secret);
  return secret;
}

getGumroadCode = function (currentLevel, targetLevel) {
  if (currentLevel === "free" || currentLevel === "starter") {
    if (targetLevel === "book") return "eDzA";
    if (targetLevel === "full") return "ZjlD";
    if (targetLevel === "premium") return "OwKC";
  }
  if (currentLevel === "book") {
    if (targetLevel === "full") return "Bqld";
    if (targetLevel === "premium") return "zIux";
  }
  if (currentLevel === "full") {
    if (targetLevel === "premium") return "GPah";
  }
}