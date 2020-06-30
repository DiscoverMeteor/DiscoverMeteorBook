// Package.on_use(function (api) {
//   api.add_files(['static-collections.js'], 'server');
// });


// ------------------------- Static Collections Package ----------------------------- //
//                                                                                    //
//      This package looks through your app for .md.erb files, then adds them         //
//      to a collection named after their containing folder.                          //
//      It also transforms each file's YAML frontmatter into document properties.     //
//                                                                                    //
// ---------------------------------------------------------------------------------- //

printObject = function(obj){
//   //TODO: use real function for printing out object
//   var objectString = "";
//   _.each(obj, function(property, key){
//     property = !!parseFloat(property) ? parseFloat(property) : '"'+property+'"';
//     objectString += ","+key+": "+property;
//   });
//   if(obj.title=="Routing"){
//     console.log(JSON.stringify(obj), '\n\n--------------------------')
// console.log("{"+objectString.slice(1)+"}", '\n\n--------------------------')
// }
// return "{"+objectString.slice(1)+"}";
  return JSON.stringify(obj)
}


var collectionsArray = [];

var handler = function(compileStep) {

  // ---------- Get file contents ----------

  var contents = compileStep.read().toString('utf8');

  // ---------- Get collection name  ----------

  // use file's containing folder for collection name, then capitalize it
  var pathArray = compileStep.inputPath.split('/');
  var collectionName = pathArray[pathArray.length-2];
  collectionName = collectionName.substring(0,1).toUpperCase()+collectionName.substring(1);

  // ---------- Clean up content  ----------

  // add "\n" to the end of every line
  // contents = contents.replace(/\n/g, '\\n');
  // escape quotes and percents
  // contents = contents.replace(/"/g, '\\"').replace(/%/g, '\\%');

  // ---------- Build properties object  ----------
  var properties = {};
  var fileName = _.last(compileStep.inputPath.split('/'));
  var fileNameArray = fileName.split('-');
  properties.fileName = fileName;
  properties.slug = fileNameArray.join('-').split('.').shift();

  // parse YAML frontmatter to build meta properties
  var myRegexp = /---([\s\S]*?)---/g;

  if(frontMatter = myRegexp.exec(contents)){
    _.each(frontMatter[0].split('\n'), function(item){
      if (item == "---" || item == "")
        return false;
      var itemArray = item.split(':');
      var key = itemArray[0].trim();
      var property = _.rest(itemArray).join(':').trim();
      // if property is an int, parse it as such
      property = !!parseFloat(property) ? parseFloat(property) : property;
      // if property is a boolean, parse it as such
      property = (property === "true") ? true : property;
      property = (property === "false") ? false : property;
      // strip extra spaces
      property = property[0] === " " ? property.slice(1) : property;
      // strip wrapping quotes
      property = property[0] === '"' ? property.slice(1) : property;
      property = property[property.length-1] === '"' ? property.slice(0,-1) : property;
      properties[key] = property;
    });
  }

  // once parsing is done, get rid of frontmatter
  properties.text = contents.replace(/---([\s\S]*?)---/g, '');

  // ---------- Build insert statement  ----------
  var insertStatement = 'Meteor.startup(function() {\n';
  insertStatement += '  Meteor.defer(function() {\n';

  var match = printObject(_.pick(properties, 'fileName'));
  var object = printObject(properties);
  insertStatement += '     ' + collectionName+'.upsert(' + match + ',' + object +');\n  });\n});';

  path = pathArray[pathArray.length-2] + '/' + pathArray[pathArray.length-1] + '.js'
  compileStep.addJavaScript({
    path: path,
    sourcePath: compileStep.inputPath,
    data: insertStatement,
  });
}

Plugin.registerSourceHandler("md.erb", handler);
