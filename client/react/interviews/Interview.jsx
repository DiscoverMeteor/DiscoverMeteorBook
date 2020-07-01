import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

Interview = createReactClass({

  propTypes: {
    interview: PropTypes.object.isRequired
  },

  render() {
    
    var content = {
      __html: parseMarkdown(this.props.interview.text)
    };

    return (
      <div className="interview-page">
        <div className="back-link"><a href="/">⬅ Back to home</a></div>
        <div className="interview post-content" dangerouslySetInnerHTML={content}></div>
      </div>
    )
  }
});

