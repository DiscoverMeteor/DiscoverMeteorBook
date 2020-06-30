AdminUserPurchases = React.createClass({
  render() {
    return <UserPurchases userId={this.props.rowData._id} showTableHeading={false}/>
  }
});