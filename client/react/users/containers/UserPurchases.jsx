import Griddle from "griddle-react";

UserPurchases = React.createClass({

  propTypes: {
    userId: React.PropTypes.string.isRequired,
    showTableHeading: React.PropTypes.bool
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    Meteor.subscribe("userPurchases", this.props.userId);

    return {
      purchases: Purchases.find({userId: this.props.userId}).fetch()
    }
  },

  render() {

    var showTableHeading = _.isUndefined(this.props.showTableHeading) ? true : this.props.showTableHeading;
    var columnMetadata = [
      {
        columnName: "createdAt",
        order: 1,
        displayName: "date",
        customComponent: CreatedAt
      },
      {
        columnName: "toLevelKey",
        order: 2,
        displayName: "level"
      },
      {
        columnName: "price",
        order: 3,
      }
    ];

    return (
      <Griddle
        tableClassName="table"
        results={this.data.purchases}
        columns={['createdAt', 'toLevelKey', 'price']}
        columnMetadata={columnMetadata}
        showPager={false}
        showTableHeading={showTableHeading}
      />
    )
  }

});