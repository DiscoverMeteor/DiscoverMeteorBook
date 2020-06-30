Utils = {
  // if arg is from a {{foo bar='baz'}} type call, turn the
  //   last argument into {bar: 'baz'}, rather than Spacebars.kw
  spacebarsArg: function(arg) {
    return (arg instanceof Spacebars.kw) ? arg.hash : arg;
  },
  
  // A function that returns a cursor -- expects two (optional) arguments,
  //   as you'd pass into find.
  cursor: function(fn) {
    return function(query, options) {
      query = Utils.spacebarsArg(query) || {};
      options = Utils.spacebarsArg(options) || {};
      
      return fn.call(this, query, options);
    }
  }
}