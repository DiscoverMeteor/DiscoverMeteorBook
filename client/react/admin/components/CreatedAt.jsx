CreatedAt = createReactClass({
  render: function(){
    return (
      <span>{moment(this.props.rowData.createdAt).fromNow()}</span>
    )
  }
});