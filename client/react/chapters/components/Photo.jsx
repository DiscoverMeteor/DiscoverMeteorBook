import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

var timeout;

$.easing.easeOutQuad = function (x, t, b, c, d) {
  return -c *(t/=d)*(t-2) + b;
}

Photo = createReactClass({
    
  propTypes: {
    chapter: PropTypes.object.isRequired,
    chapters: PropTypes.array.isRequired
  },

  prevChapter() {
    return Helpers.getPrevChapter(this.props.chapter, this.props.chapters);
  },

  nextChapter() {
    return Helpers.getNextChapter(this.props.chapter, this.props.chapters);
  },

  renderChapterContents(content, index) {
    return (
      <li key={index}>{content}</li>
    )
  },

  handleScroll(event) {
    event.preventDefault();
    var link = e.target;
    //calculate destination place
    var dest=0;
    if($(link.hash).offset().top > $(document).height()-$(window).height()){
        dest=$(document).height()-$(window).height();
    }else{
        dest=$(link.hash).offset().top;
    }
    //go to destination
    $('html,body').animate({scrollTop:dest}, 600,'easeOutQuad');
  },

  componentDidMount() {
    var chapter = this.props.chapter;
    var prevChapter = this.prevChapter();
    var nextChapter = this.nextChapter();

    $('.photo-overlay').removeClass('overlay-hidden');

    if(timeout) // clear any pre-existing timeout to cancel any image that might still be scheduled to load
      Meteor.clearTimeout(timeout);
    
    if(chapter.slug){
      // delay image load by 300ms to avoid loading images when user is just paging through chapters
      timeout = Meteor.setTimeout(function () {
        // load current chapter image
        var imgUrl = s3Url+chapter.slug+'.jpg';
        $('<img/>').attr('src', imgUrl).load(function() {
          $(this).remove(); // prevent memory leaks as @benweet suggested
          $('.photo-background').css('background-image', 'url('+imgUrl+')');
          $('.photo-overlay').addClass('overlay-hidden');
        });
        // preload previous and next chapters' images in browser cache
        if(prevChapter)
          $('<img/>').attr('src', s3Url + prevChapter.slug+'.jpg');
        if(nextChapter)
          $('<img/>').attr('src', s3Url + nextChapter.slug+'.jpg');
      }, 300);

    }
  },

  render() {
    const prevChapter = this.prevChapter();
    const nextChapter = this.nextChapter();

    return (
      <div className="chapter-photo">
        <div className="photo-background"></div>
        <div className="inner">
          <div className="row">
            <div className="chapter-hero">
              <div className="chapter-heading">
                <h2 className="chapter-title">{this.props.chapter.title}</h2>
                {this.props.chapter.sidebar ? <span className="marker sidebar-marker">Sidebar</span> : ""}
                {this.props.chapter.extra ? <span className="marker special-marker">Extra</span> : ""}
                {this.props.chapter.draft ? <span className="marker draft-marker">Draft</span> : ""}
                <span className="chapter-index">{this.props.chapter.index}</span>
              </div>

            </div>
            <div className="chapter-contents">
              <ul>
                {this.props.chapter.contents.split('|').map(this.renderChapterContents)}
              </ul>
            </div>
          </div>
        </div>
        <div className="chapter-nav">
          {prevChapter &&
            <a className="prev-chapter has-tooltip" href={FlowRouter.path("chapter", {slug: this.prevChapter().slug})} title={this.prevChapter().title}></a>}
          {nextChapter &&
            <a className="next-chapter has-tooltip" href={FlowRouter.path("chapter", {slug: this.nextChapter().slug})} title={this.nextChapter().title}></a>}
        </div>
        <div className="photo-credit">
          Photo credit: <a href={this.props.chapter.photoUrl}>{this.props.chapter.photoAuthor}</a>
        </div>
        <div className="photo-overlay"></div>
        <a className="photo-scroll-arrow" href="#main"></a>
      </div>
    )
  }

});