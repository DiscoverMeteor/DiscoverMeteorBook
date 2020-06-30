parseMarkdown = function (text) {

  // var text = text
  //   .replace(/```(.*)\n([\s\S]*)```/gm, '<code><pre>$2</pre></code>');

  // get rid of something?
  var text = text.replace(/<\$[^>]*>/g, '').replace(/<\/\$[^>]*>/g, '');

  var myRegexp = /\<\%\=\s(\S+)(?:\s?\"([^\"]+)\",?)+\s*\%\>/g;
  var match = myRegexp.exec(text);

  // console.log(myRegexp.exec(text));

  // while (match != null) {
  //     match = myRegexp.exec(text);
  //     // matched text: match[0]
  //     // match start: match.index
  //     // capturing group n: match[n]
  //     // console.log(match);
  //  + ' 

  // /\<\%\=\s(\S+)(?:\s?\"([^\"]+)\",?)+\s*\%\>/g.exec('<%= commit "11-2", "Display notifications in the header." %>')[0].match(/(\"[^\"]+\"|\w+)/g);

  // get rid of YAML frontmatter
  text = text.replace(/---([\s\S]*?)---/g, '');

  //http://stackoverflow.com/questions/3395843/replace-callback-function-with-matches
  text = text.replace(myRegexp, function(match, contents, offset, s){
    var helperArray = _.map(match.match(/(\"[^\"]+\"|\w+)/g), function(element){
      //get rid of extra quote marks
      var s = element;
      var l = element.length-1;
      if(element[0] == '"' || element[0] == "'")
        s = s.substring(1)
      if(element[l] == '"' || element[l] == "'"){
        s = s.substring(0, l-1)
      }
      return s;
    });
    // console.log(helperArray)
    switch(helperArray[0]){
      case 'commit':
        var name = helperArray[1];
        var caption = helperArray[2];
        return '<div class="commit">\
        <img src="/images/code.svg"/>\
        <div class="message">\
        <h4>Commit ' + name + '</h4>\
        <p>' + caption + '</p>\
        </div>\
        <div class="actions">\
        <a class="commit-link" href="https://github.com/DiscoverMeteor/Microscope/commit/chapter' + name + '" target="_blank">\
        View on GitHub\
        </a>\
        <a class="instance-link" href="http://meteor-book-chapter' + name + '.meteor.com" target="_blank" class="live-instance">\
        Launch Instance\
        </a>\
        </div>\
        </div>';
      break;

      case 'scommit':
        var name = helperArray[1];
        var caption = helperArray[2];
        return '<div class="commit">\
        <img src="/images/code.svg"/>\
        <div class="message">\
        <h4>Commit ' + name + '</h4>\
        <p>' + caption + '</p>\
        </div>\
        <div class="actions">\
        <a class="commit-link" href="https://github.com/DiscoverMeteor/Microscope/commit/sidebar' + name + '" target="_blank">\
        View on GitHub\
        </a>\
        <a class="instance-link" href="http://meteor-book-sidebar' + name + '.meteor.com" target="_blank" class="live-instance">\
        Launch Instance\
        </a>\
        </div>\
        </div>';
      break;

      case 'caption':
        var content = helperArray[1];
        return '<div class="caption">' + content + '</div>';
      break;

      case 'image':
        var src = helperArray[1];
        var css_class = helperArray[2];
        return '<img class="' + css_class + '" src="/images/' + src + '"/>';
      break;

      case 'figure':
        var src = helperArray[1];
        var caption = helperArray[2];
        var css_class = helperArray[3];
        var imgCode = '<img src="/images/' + src + '" alt="' + caption + '"/>';
        if (helperArray.length >= 5) {
          var link = helperArray[4];
          imgCode = '<a href="' + link + '">' + imgCode + '</a>';
        }
        return  '<figure class="' + css_class + '">' + imgCode + '\
                <figcaption>' + caption + '</figcaption></figure>';
      break;

      case 'pullquote':
        var content = helperArray[1];
        var css_class = helperArray[2] || 'left';
        return '<blockquote class="pull pull-' + css_class + '">'+content+'</blockquote>';
      break;

      case 'diagram':
        var name = helperArray[1];
        var caption = helperArray[2];
        var css_class = helperArray[3];
        return '<figure class="diagram ' + css_class + '">\
        <img src="/images/diagrams/' + name + '@2x.png" alt="' + caption + '"/>\
        <figcaption>' + caption + '</figcaption></figure>';
      break;

      case 'screenshot':
        var name = helperArray[1];
        var caption = helperArray[2];
        var css_class = helperArray[3];
        return '<figure class="screenshot ' + css_class + '">\
        <img src="/images/screenshots/' + name + '.png" alt="' + caption + '"/>\
        <figcaption>' + caption + '</figcaption>\
        </figure>';
      break;

      case 'gifscreenshot':
        var name = helperArray[1];
        var caption = helperArray[2];
        var css_class = helperArray[3];
        return '<figure class="screenshot ' + css_class + '">\
        <img src="/images/screenshots/' + name + '.gif" alt="' + caption + '"/>\
        <figcaption>' + caption + '</figcaption>\
        </figure>';
      break;

      case 'highlight':
        var lines = helperArray[1];
        var css_class = helperArray[2] || 'added';
        return '<div class="lines-highlight" data-lines="' + lines + '" data-class="' + css_class + '"></div>';
      break;
    }
    return contents;
  });

  text = marked(text);

  text = text.replace(/<p>&lt;% chapter do %&gt;<\/p>/g, '<div class="chapter note"><h3>In this chapter, we will:</h3>')
    .replace(/<p>&lt;% note do %&gt;<\/p>/g, '<div class="note">')
    .replace(/<p>&lt;% alert do %&gt;<\/p>/g, '<div class="alert note">')
    .replace(/<p>&lt;% end %&gt;<\/p>/g, '</div>');

  return text;
}