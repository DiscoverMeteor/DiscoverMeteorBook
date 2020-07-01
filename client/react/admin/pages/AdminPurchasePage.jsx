import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

AdminPurchasePage = createReactClass({

  propTypes: {
    purchaseId: PropTypes.string.isRequired
  },

  mixins: [ReactMeteorData],

  getMeteorData() {

    var purchase = Purchases.findOne(this.props.purchaseId);

    Meteor.subscribe("adminPurchase", purchaseId);

    return {
      purchase: purchase
    }

  },

  render() {
    if (!this.data.purchase) {

      return <Loading/>

    } else { // user is checking their own profile, or they're admin

      return (
        <AdminLayout>
          <table>
            <tbody>
              <tr>
                <td>_id</td>
                <td>{this.data.purchase._id}</td>
              </tr>
              <tr>
                <td>productKey</td>
                <td>{this.data.purchase.productKey}</td>
              </tr>
              <tr>
                <td>toLevel</td>
                <td>{this.data.purchase.toLevel}</td>
              </tr>
              <tr>
                <td>price</td>
                <td>{this.data.purchase.price}</td>
              </tr>
              <tr>
                <td>user</td>
                <td><a href={FlowRouter.path("profilePage", {_id: this.data.purchase.userId})}>{this.data.purchase.email}</a></td>
              </tr>
              <tr>
                <td>Stripe Charge</td>
                <td><pre className="charge">{JSON.stringify(this.data.purchase.stripeCharge, null, 2)}</pre></td>
              </tr>
              <tr>
                <td>Gumroad Charge</td>
                <td><pre className="charge">{JSON.stringify(this.data.purchase.gumroadCharge, null, 2)}</pre></td>
              </tr>
            </tbody>
          </table>
        </AdminLayout>
      )

    }
  }

});