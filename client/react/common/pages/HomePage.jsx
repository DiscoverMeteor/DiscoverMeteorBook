HomePage = createReactClass({

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    var data = {
      chapters: Chapters.find({published: {$ne: false}, appendix: {$ne: true}}, {sort: {number: 1}}).fetch(),
      changelogChapter: Chapters.findOne({slug: "changelog"}),
      screencasts: Videos.find({type: "Screencast"}).fetch(),
      caseStudies: Videos.find({type: "Case Study"}).fetch(),
      interviews: Interviews.find().fetch(),
      user: Meteor.user(),
      product: Products.findOne({key: BOOK_KEY}),
      position: Positions.findOne()
    }

    data.lastChapter = data.position && Chapters.findOne({slug: data.position.slug});

    return data;
  },

  renderChapter(chapter, index) {
    return (
      <li key={index} className={!!chapter.text ? "chapter-available" : "chapter-unavailable"}>
        <a href={FlowRouter.path("chapter", {slug: chapter.slug})}>{chapter.title}</a>
        {!!chapter.extra ? <span className="marker special-marker">Extra</span> : ''}
        <span className="chapter-number">{chapter.number}</span>
      </li>
    )
  },

  renderLastPosition() {
    if (this.data.lastChapter) {
      return (
        <a href={FlowRouter.path("chapter", {slug: this.data.lastChapter.slug})} className="last-position-link">Go back to: {this.data.lastChapter.title}</a>
      )
    }
  },

  renderNote() {
    if (!this.data.user || this.data.user.hasPermission(this.data.product, "book")) {
      // don't show anything
    } else if (this.data.user.hasPermission(this.data.product, "starter")) {
      return (
        <div className="note">
          This is a starter edition of the first eight chapters (plus sidebars) of <em>Discover Meteor</em>.
          To purchase the full book, please use the upgrade links on the right.
        </div>
      )
    } else {
      return (
        <div className="note">
          This is a preview version of the first three chapters (plus a sidebar) of <em>Discover Meteor</em>. If you like the book, be sure to check out the <a href="https://www.discovermeteor.com/packages">full version</a>!
        </div>
      )
    }
  },

  renderSpecialNote() {
    return (
      <div className="sidebar-block note">
        <p>
          We've just completely rewritten this app's front-end to use React.
          If you encounter any bugs, please <a href="https://github.com/DiscoverMeteor/book/issues">let us know!</a>
        </p>
      </div>    
    )
  },

  renderSidebarNote() {
    if (this.data.user) {
      const productLevel = this.data.user.productLevel(this.data.product);
      return (
        <div className="sidebar-block">
          <p>Welcome to the Discover Meteor members area. Your package: <strong>{productLevel && productLevel.name}</strong>.</p>
          <p><a href={FlowRouter.path("accountPage")}>My Account</a></p>
        </div>
      )
    } else {
      return (
        <div className="sidebar-block">
          <p>Already purchased the book? <a href={FlowRouter.path("loginPage")}>Log in</a> to access your account.</p>
        </div>
      )
    }
  },

  renderLinks() {

    var links = [];
    if (this.data.user && this.data.user.isAdmin()) {
      links.push({name: "Users", link: FlowRouter.path("adminUsersPage")});
      links.push({name: "Purchases", link: FlowRouter.path("adminPurchasesPage")});
    }
    links.push({name: "Changelog", link: FlowRouter.path("changelogPage")});

    return (
      <div className="sidebar-block useful-links">
        <h3>Links</h3>
        <ul>
          {links.map((link, index) => <li key={index}><a href={link.link}>{link.name}</a></li>)}
        </ul>
      </div>
    )
  },

  renderDownloads() {

    // formats is a global

    if (this.data.user && this.data.user.hasPermission(this.data.product, "book")) {
      return (
        <div className="sidebar-block full-book">
          <h3>Download the Book</h3>
          <ul>
            {formats.map((format, index) => <li key={index}><a target="_blank" download href={"/download/" + format.title} className={format.title} data-category="Download" data-action={format.title + " downloaded"} data-label={format.title + " downloaded"}>{format.title}</a></li>)}
          </ul>
          <p className="small">
            {this.data.user.hasPermission(this.data.product, "full")? <span>Note: does not contain extra chapters. </span> : ""}
            Last updated on {this.data.changelogChapter.updated}
          </p>
        </div>
      )
    }
  },

  renderScreencasts() {
    if (this.data.user && this.data.user.hasPermission(this.data.product, "full")) {
      return (
        <div className="extra-content-blocks">
          <div className="sidebar-block screencasts">
            <h3>Screencasts</h3>
            <ul>
                {this.data.screencasts.map((screencast, index) => <li key={index}><a href={FlowRouter.path("videoPage", {slug: screencast.slug})}>{screencast.title}</a></li>)}
            </ul>
          </div>
          <div className="sidebar-block casestudies">
            <h3>Case Studies</h3>
            <ul>
              {this.data.caseStudies.map((study, index) => <li key={index}><a href={FlowRouter.path("videoPage", {slug: study.slug})}>{study.title}</a></li>)}
            </ul>
          </div>
          <div className="sidebar-block interviews">
            <h3>Interviews</h3>
            <ul>
              {this.data.interviews.map((interview, index) => <li key={index}><a href={FlowRouter.path("interviewPage", {slug: interview.slug})}>{interview.title}</a></li>)}
            </ul>
          </div>
        </div>
      )
    }
  },

  renderPurchases() {

    var user = this.data.user;
    var book = this.data.product;

    if (user) {
      var upgrades = user && user.availableUpgradeLevels(book);
      if (upgrades.length) {
        return (
          <div className="sidebar-block upgrade">
            <h3>Upgrade</h3>
            {upgrades.map((level, index) => <Purchase product={this.data.product} level={level} user={this.data.user} key={index}/>)}
          </div>
        )
      }
    } else {
      var purchases = _.filter(book.levels, function (level) {
        return level.price > 0 && !level.disabled;
      }); 
      return (
        <div className="sidebar-block purchase">
          <h3>Buy the Book</h3>
          {purchases.map((level, index) => <Purchase product={this.data.product} level={level} key={index}/>)}
        </div>
      )
    }
    
  },

  renderNewsletter() {
    if (!this.data.user) {
      return (
        <div className="sidebar-block newsletter">
          <h3>Newsletter</h3>
          <p>Join our newsletter to start receiving Meteor tips and news:</p>
          <form className="newsletter-form normal-style" action="https://telesc.us2.list-manage.com/subscribe/post?u=b5af47765edbd2fc173dbf27a&amp;amp;id=ed0fb4ac61" method="post" name="mc-embedded-subscribe-form" noalidate="" target="_blank">
            <div className="control-group">
              <input className="email text" name="EMAIL" placeholder="Your email" type="email"/>
              <input id="landing" name="LANDING" type="hidden" value="members-area-homepage"/>
              <input id="origin" name="ORIGIN" type="hidden" value="members-area"/>
            </div>
            <div className="form-actions">
              <button className="submit button simple-button newsletter-submit" data-category="Click" data-action="newsletter clicked" data-label="newsletter clicked (homepage)" name="subscribe" type="submit">Join</button>
            </div>
          </form>
        </div>    
      )
    }
  },

  render() {

    return (
      <Layout>
        {this.renderLastPosition()}

        {this.renderNote()}

        <section className="chapters">
          <h2>Table of Contents</h2>
          <ul>
            {this.data.chapters.map(this.renderChapter)}
          </ul>
        </section>


        <section className="links home-sidebar">
          {this.renderSpecialNote()}
          {this.renderSidebarNote()}
          {this.renderLinks()}
          {this.renderDownloads()}
          {this.renderScreencasts()}
          {this.renderPurchases()}
          {this.renderNewsletter()}
        </section>


      </Layout>
    )
  }

});

// Template.homepage.rendered = function () {
//   $('body').removeClass('toc-open sidebar-open comments-open');
// }

// Template.homepage.events({
//   'click [data-category]:not([data-category=""])': function (e) {
//     var $a = $(e.target);
//     trackEvent($a.data('category'),$a.data('action'),$a.data('label'));
//   }
// })