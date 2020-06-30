ChapterLayout = React.createClass({
  
  propTypes: {
    chapter: React.PropTypes.object.isRequired,
    chapters: React.PropTypes.array.isRequired,
    vocabularyChapter: React.PropTypes.object
  },
  
  render() {
    return (
      <div className="outerLayout">
        <div className="layout">
          <Photo {...this.props}/>
          <Header />
          <div className='main' id='main'>
            <div className='row'>
              {this.props.children}
            </div>
          </div>
          <Footer />
        </div>
        <Sidebars {...this.props}/>
      </div>
    );
  }

});