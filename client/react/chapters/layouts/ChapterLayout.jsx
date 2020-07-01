import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

ChapterLayout = createReactClass({
  
  propTypes: {
    chapter: PropTypes.object.isRequired,
    chapters: PropTypes.array.isRequired,
    vocabularyChapter: PropTypes.object
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