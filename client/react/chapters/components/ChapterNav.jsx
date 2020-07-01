import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

ChapterNav = createReactClass({
  
  propTypes: {
    chapter: PropTypes.object.isRequired
  },

  render() {
    const prevChapter = Helpers.prevChapter(this.props.chapter);
    const nextChapter = Helpers.nextChapter(this.props.chapter);

    return (
      <div className="post-nav">
        {prevChapter &&
          <a href={FlowRouter.path("chapter", {slug: prevChapter.slug})} className="prev">« {prevChapter.title}</a>}
        {nextChapter && 
          <a href={FlowRouter.path("chapter", {slug: nextChapter.slug})} className="next">{nextChapter.title} »</a>}
      </div>
    )
  }

});