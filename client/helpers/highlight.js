Handlebars.registerHelper('highlightWithMarkdown', function(text) {
  if (text) // XXX
    return new Handlebars.SafeString(parseMarkdown(text));
});
