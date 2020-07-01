var ReactDisqusThread = require('react-disqus-thread');

var disqus_shortname = 'themeteorbook'; // required: replace example with your forum shortname

Comments = createReactClass({

  propTypes: {
    chapter: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired,
    vocabularyChapter: React.PropTypes.object
  },

  handleToggleClick(event) {
    event.preventDefault();
    $('body').toggleClass('comments-open sidebar-open');
  },

  render() {
    return (
      <div className="comments sidebar">
        <a href="#disqus_thread" className="sidebar-toggle" data-disqus-identifier={this.props.chapter.slug} onClick={this.handleToggleClick}></a>
        <div className="sidebar-inner">
          <div className="issues">
            <p className="mbottom">If <strong>you need support</strong>, please leave an issue on GitHub:</p>
            <a className="issue-link simple-button" href="https://github.com/DiscoverMeteor/Microscope/issues" target="_blank">Report an issue with the code</a>
            <a className="issue-link simple-button" href="https://github.com/DiscoverMeteor/book/issues" target="_blank">Report an issue with the book</a>
            <hr/>
            <p>Additionally, you can use this area for more general discussion and questions:</p>
          </div>
          <ReactDisqusThread
            shortname={disqus_shortname}
            identifier={this.props.chapter.slug}
            title={this.props.chapter.title}
            url={Meteor.absoluteUrl() + 'chapters/' + this.props.chapter.slug}
          />
        </div>
      </div>
    );
  }

});