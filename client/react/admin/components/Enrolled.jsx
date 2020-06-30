Enrolled = React.createClass({
  render: function(){
    var user = Meteor.users._transform(this.props.rowData);
    if (user.enrollMethod() === "pending") {
      return <a href={user.finishSignupUrl()}>Pending</a>
    } else {
      return <span>{user.enrollMethod()}</span>
    }
  }
});