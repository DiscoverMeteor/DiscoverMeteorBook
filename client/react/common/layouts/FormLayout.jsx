FormLayout = React.createClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    // get a random chapter
    var chapters = Chapters.find({published: {$ne: false}, appendix: {$ne: true}}, {sort: {number: 1}}).fetch();
    var randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    return {
      randomChapter: randomChapter
    }
  },

  render() {
    return (
      <div className="layout photo-layout form-layout">
        <PhotoBackground chapter={this.data.randomChapter}/>
        <Header />
        <div className='main' id='main'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
        <FormFooter />
      </div>
    );
  }

});

// TODO

// Template.formPageLayout.rendered = function(){
//   loadFonts();
//   // workaround for iPad not recalculating the value of '100vh' when content of div changes
//   $('.form-layout').css('min-height', $(window).height()+'px');
//   Meteor.setTimeout(function(){
//     $('.form-layout').css('min-height', '100vh');
//   }, 100);
// }