CreatedAt = React.createClass({
  render: function(){
    return (
      <span>{moment(this.props.rowData.createdAt).fromNow()}</span>
    )
  }
});