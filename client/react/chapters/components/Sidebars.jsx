Sidebars = createReactClass({
  
  propTypes: {
    chapter: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired,
    vocabularyChapter: React.PropTypes.object
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