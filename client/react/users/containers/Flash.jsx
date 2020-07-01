import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

Flash = createReactClass({
  
  propTypes: {
    message: PropTypes.string,
    type: PropTypes.string
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      flash: Session.get("flash")
    }
  },

  componentDidMount() {
    clearFlash();
  },
  
  render() {
    
    // if session contains a flash message use this, else default to message from props
    var flash = _.isEmpty(this.data.flash) ? this.props : this.data.flash;

    return (
      <p className={"form-notice form-" + flash.type}>{flash.message}</p>
    )
  }

});