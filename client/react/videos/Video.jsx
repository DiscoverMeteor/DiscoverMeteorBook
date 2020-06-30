Video = React.createClass({

  propTypes: {
    video: React.PropTypes.object.isRequired
  },

  getDescription() {
    return {
      __html: parseMarkdown(this.props.video.description)
    }; 
  },

  renderResource(resource, index) {
    return (
      <li key={index}><a href={resource.url}>{resource.title}</a></li>
    )
  },

  componentDidMount() {
    $(".player").fitVids();
  },
  
  render() {
    return (
      <div className="video-page">
        <div className="back-link">
          <a href="/">⬅ Back to home</a>
        </div>
        <div className="player">
          <iframe src={"https://player.vimeo.com/video/"+this.props.video.code+"?title=0&amp;byline=0&amp;portrait=0&amp;color=f3cc14"} width="500" height="281" frameBorder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
        </div>
        <div className="infos">
          <h2>{this.props.video.title}</h2>
          <div className="description" dangerouslySetInnerHTML={this.getDescription()}>
          </div>
        </div>
        <div className="links">
          <h3>Links:</h3>
          <ul>
            {this.props.video.resources.map(this.renderResource)}
          </ul>
        </div>
      </div> 
    )
  }
});

