trackPageview = function (url) { 
  mixpanel.track_pageview(url);
  GAnalytics.pageview(url);
}

trackEvent = function (category, action, label, value, properties) {
  var label =       typeof label === 'undefined'      ?   null  :   label;
  var value =       typeof value === 'undefined'      ?   null  :   value;
  var properties =  typeof properties === 'undefined' ?   {}    :   properties;

  properties.label = label;
  properties.value = value;

  if (Meteor.absoluteUrl().indexOf('localhost') != -1 || Meteor.isServer) { // always log on server
    console.log('// trackEvent //')
    console.log(category)
    console.log(action)
    console.log(label)
    console.log(value)
    console.log(properties)
  } 

  GAnalytics.event(category, action, label, value);

  mixpanel.track(action, properties);
  
}