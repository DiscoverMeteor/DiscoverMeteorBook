ChaptersTOC = React.createClass({

  propTypes: {
    chapter: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired
  },
  
  renderChapter(chapter, index) {
    return (
      <li key={index} className={chapter.slug === this.props.chapter.slug ? "active" : ""}>
        <span className="number">{chapter.number}</span>
        <a href={FlowRouter.path("chapter", {slug: chapter.slug})}>{chapter.title}</a>
      </li>
    )
  },

  handleToggleClick(event) {
    event.preventDefault();
    $('body').toggleClass('toc-open sidebar-open');
  },

  render() {
    return (
      <div className="toc sidebar">
        <a href="#" className="sidebar-toggle" onClick={this.handleToggleClick}>Toggle Table of Contents</a>
        <div className="sidebar-inner">
          <ul>
            {this.props.chapters.map(this.renderChapter)}
          </ul>
        </div>
      </div>
    );
  }

});