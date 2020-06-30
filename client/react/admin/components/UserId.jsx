UserId = React.createClass({
  render() {
    return (
      <a href={FlowRouter.path("profilePage", this.props.rowData)}>{this.props.rowData._id}</a>
    )
  }
});