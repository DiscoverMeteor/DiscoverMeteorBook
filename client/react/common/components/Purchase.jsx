import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

Purchase = createReactClass({

  propTypes: {
    product: PropTypes.object.isRequired,
    level: PropTypes.object.isRequired,
    user: PropTypes.object, // if a user is provided, then we know this is an upgrade
    key: PropTypes.number,
    code: PropTypes.string,
  },

  renderPrice(levelKey, index) {
    var purchase = Billing.createPurchase(this.props.user, this.props.product, levelKey, this.props.code);
    return (
      <span className="price">
        {purchase.undiscountedPrice ? <span className="strike">${purchase.undiscountedPrice}</span> : ''}
        ${purchase.price}
      </span>
    )
  },

  render() {
    
    var purchaseUrl = this.props.product.gumroadPurchaseUrl(this.props.level, this.props.user);
    var description = {
      __html: parseMarkdown(this.props.level.description)
    }

    return (
      <div className="prompt-option" key={this.props.index}>
        <h3>{this.props.level.name}</h3>
        <div className="prompt-contents" dangerouslySetInnerHTML={description}></div>
        <a href={purchaseUrl} target="_blank" className="button simple-button" data-category="Click" data-action="{{code}} clicked" data-label="{{code}} clicked (upgrade page)">
          {this.props.user ? "Upgrade" : "Buy"} ({this.renderPrice(this.props.level.key)})
        </a>
        <p className="prompt-more-info"><a href="https://www.discovermeteor.com/packages" target="_blank">More info…</a></p>
      </div>
    )
  },

})