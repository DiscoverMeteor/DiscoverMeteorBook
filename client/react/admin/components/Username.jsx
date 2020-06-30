Username = React.createClass({
  render: function(){
    var user = Meteor.users._transform(this.props.rowData);
    return <span>{user.getUsername()}</span>
  }
});