App = createReactClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    var data = {
      ready: false
    };

    var handles = [
      Meteor.subscribe('site', SITE_KEY),
      Meteor.subscribe('toc'),
      Meteor.subscribe('chapters', BOOK_KEY),
      Meteor.subscribe('interviews', BOOK_KEY),
      Meteor.subscribe('videos', BOOK_KEY),
      Meteor.subscribe('thisUser'),
      Meteor.subscribe('pages'),
    ];

    if(_.every(handles, handle => {return handle.ready();})) {
      data.ready = true;
    }

    return data;
  },

  componentDidMount() {
    loadFonts();
  },

  render() {
    return this.data.ready ? this.props.content : <Loading/>;
  }

});