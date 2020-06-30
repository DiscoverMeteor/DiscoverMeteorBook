Vocabulary = React.createClass({

  propTypes: {
    vocabularyChapter: React.PropTypes.object.isRequired
  },

  getVocabulary() {
    return {
      __html: parseMarkdown(this.props.vocabularyChapter.text)
    }; 
  },
  
  componentDidMount() {
    $('.vocabulary .sidebar-content p').hide();
    $('.vocabulary h4').click(event => {
      event.preventDefault();
      $(event.currentTarget).toggleClass('active').next().slideToggle('fast');
    });
  },

  handleToggleClick(event) {
    event.preventDefault();
    $('body').toggleClass('vocabulary-open sidebar-open');
  },

  render() {
    return (
      <div className="vocabulary sidebar">
        <a href="#" className="sidebar-toggle" onClick={this.handleToggleClick}>Toggle Vocabulary</a>
        <div className="sidebar-inner">
          <div className="sidebar-content">
            <h3>Vocabulary</h3>
            <div className="vocabulary-content" dangerouslySetInnerHTML={this.getVocabulary()}></div>
          </div>
        </div>
      </div>
    )
  }

});