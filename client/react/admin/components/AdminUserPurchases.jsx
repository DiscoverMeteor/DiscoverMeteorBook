import createReactClass from 'create-react-class';

AdminUserPurchases = createReactClass({
  render() {
    return <UserPurchases userId={this.props.rowData._id} showTableHeading={false}/>
  }
});