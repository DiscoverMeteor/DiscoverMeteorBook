PurchaseId = createReactClass({
  render() {
    return (
      <a href={FlowRouter.path("adminPurchasePage", this.props.rowData)}>{this.props.rowData._id}</a>
    )
  }
});