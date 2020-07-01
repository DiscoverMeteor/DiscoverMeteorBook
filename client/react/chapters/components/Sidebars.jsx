import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

Sidebars = createReactClass({
  
  propTypes: {
    chapter: PropTypes.object.isRequired,
    chapters: PropTypes.array.isRequired,
    vocabularyChapter: PropTypes.object
  },

  render() {
    return (
      <div className="sidebars">
        <Comments {...this.props}/>
        <ChaptersTOC {...this.props}/>
        <Vocabulary vocabularyChapter={this.props.vocabularyChapter}/>
      </div>
    )
  }

});