import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

Chapter = createReactClass({
  
  propTypes: {
    chapter: PropTypes.object.isRequired
  },

  getChapterContent() {
   return {
      __html: parseMarkdown(this.props.chapter.text)
    };
  },

  renderChapterContent() {
    return (
      <div className="post-content" id="content">
        <div dangerouslySetInnerHTML={this.getChapterContent()}></div>
        <ShareProgress chapter={this.props.chapter}/>
      </div>
    )
  },

  render() {
    return (
      <div className="post">
        {this.props.chapter.text ? this.renderChapterContent() : <Upgrade />}
        {<ChapterNav chapter={this.props.chapter}/>}
      </div>
    )
  }

});