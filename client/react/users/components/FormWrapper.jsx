FormWrapper = React.createClass({

  render() {
    return (
      <FormLayout>
        <div className="form-container">
          <div className="form-area">
            {this.props.children}
          </div>
        </div>
      </FormLayout>
    );
  }

});