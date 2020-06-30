ChapterPage = React.createClass({
  
  propTypes: {
    slug: React.PropTypes.string.isRequired
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      chapter: Chapters.findOne({slug: this.props.slug}),
      chapters: Chapters.find({published: {$ne: false}, appendix: {$ne: true}}, {sort: {number: 1}}).fetch(),
      vocabularyChapter: Chapters.findOne({slug: 'meteor-vocabulary'})
    }
  },

  render() {
    return <ChapterLayout {...this.data}><Chapter chapter={this.data.chapter}/></ChapterLayout>
  }

});

// Template.chapterPage.onCreated(function() {
//   Meteor.Keybindings.add({
//     'esc' : function () {
//       $('body').removeClass('toc-open comments-open sidebar-open vocabulary-open')
//     }
//   });

//   Session.set('currentChapterSlug', FlowRouter.getParam("slug"));
//   Meteor.call('updateLastPosition', FlowRouter.getParam("slug"));
// });
