Upgrade = React.createClass({
  
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      product: Products.findOne({key: BOOK_KEY}),
      user: Meteor.user(),
      code: Session.get("code")
    };
  },

  render() {
    
    var user = this.data.user;
    var book = this.data.product;
    var purchases = _.filter(book.levels, function (level) {
      return level.price > 0;
    });
    var upgrades = user && user.availableUpgradeLevels(book);

    if (!user) {
      return (
        <div className="prompt buy-prompt">
          <h2>This Is A Paid Chapter</h2>
          <p>To access the rest of the book, please buy either the <strong>Regular</strong> or <strong>Full</strong> editions:</p>
          <div className="prompt-options">
            {purchases.map((level, index) => <Purchase product={this.data.product} level={level} key={index}/>)}
          </div>
        </div>
      )
    } else if (user.hasPermission(book, "book")) {

      return (
        <div className="prompt upgrade-prompt">
          <h2>This Is An Extra Chapter</h2>
          <p>Extra chapters cover more advanced topics, such as making Meteor apps work with third-party services and APIs. To unlock them, upgrade to the <strong>Full</strong> edition:</p>
          <div className="prompt-options">
            {upgrades.map((level, index) => <Purchase product={this.data.product} level={level} user={this.data.user} key={index}/>)}
          </div>
        </div>
      )
    } else if (user.hasPermission(book, "starter")) {
      return (
        <div className="prompt buy-prompt">
          <h2>This Is A Paid Chapter</h2>
          <p>To access the rest of the book, please buy either the <strong>Regular</strong> or <strong>Full</strong> editions:</p>
          <div className="prompt-options">
            {upgrades.map((level, index) => <Purchase product={this.data.product} level={level} user={this.data.user} key={index}/>)}
          </div>
        </div>
      )
    }
  }

});

// ga event tracking code
// Template.upgrade.events({
//   'click [data-category]:not([data-category=""])': function (e) {
//     var $a = $(e.target);
//     trackEvent($a.data('category'),$a.data('action'),$a.data('label'));
//   }
// });