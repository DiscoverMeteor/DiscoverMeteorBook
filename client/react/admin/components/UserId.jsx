import createReactClass from 'create-react-class';

UserId = createReactClass({
  render() {
    return (
      <a href={FlowRouter.path("profilePage", this.props.rowData)}>{this.props.rowData._id}</a>
    )
  }
});