var getVerb = function (chapterNumber) {
  // pick a verb to introduce a bit of diversity in the prompt.
  // early chapters have more normal verbs, and it gets more crazy at the end.
  var verbs = ['completed','finished','wrapped up','taken care of','dealt with','mastered','gone through','vanquished','dominated','terminated','put to bed','vaporized','decimated','obliterated'],
      vlen = verbs.length-1,
      chaptersCount = 17,
      vindex = Math.floor(chapterNumber*vlen/chaptersCount);  
  return verbs[vindex];
};

ShareProgress = React.createClass({

  propTypes: {
    chapter: React.PropTypes.object.isRequired
  },

  verb() {
    return getVerb(this.props.chapter.number);
  },

  tweetUrl() {
    const tweetContent = encodeURIComponent("I've just "+getVerb(this.props.chapter.number)+" Chapter "+this.props.chapter.number+" of @DiscoverMeteor. It's a great way to learn @meteorjs! https://www.discovermeteor.com");
    return "https://twitter.com/intent/tweet?source=webclient&text="+tweetContent;
  },

  render() {
    return (
      <div className="note share-progress">
        <h3>You've {this.verb()} Chapter {this.props.chapter.number} – <em>{this.props.chapter.title}</em>.</h3>
        <p>Share your progress with the world!</p>
        <a href={this.tweetUrl()} target="_blank" className="button tweet-button simple-button">Tweet</a>
      </div>
    );
  }

});