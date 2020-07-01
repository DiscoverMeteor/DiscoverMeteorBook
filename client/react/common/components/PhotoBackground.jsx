import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

PhotoBackground = createReactClass({
  
  propTypes: {
    chapter: PropTypes.object.isRequired
  },

  componentDidMount() {
    var chapter = this.props.chapter;
    var imgUrl = s3Url+chapter.slug+'.jpg';
    $('.photo-overlay').removeClass('overlay-hidden');
    $('<img/>').attr('src', imgUrl).load(function() {
      $(this).remove(); // prevent memory leaks as @benweet suggested
      $('.photo-background').css('background-image', 'url('+imgUrl+')');
      $('.photo-overlay').addClass('overlay-hidden');
      $('.refresh').removeClass('loading');
    });
  },

  render() {
    return (
      <div className="photo-background-wrapper">
        <div className="photo-background"></div>
        <div className="photo-overlay"></div>
        <div className="photo-credit">
          Photo credit: <a href={this.props.chapter.photoUrl}>{this.props.chapter.photoAuthor}</a>
        </div>
      </div>
    )
  }

});