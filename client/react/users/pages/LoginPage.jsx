LoginPage = React.createClass({

  render() {
    return (
      <FormLayout>
        <div className="form-container">
          <div className="form-area">
            <Flash message="Log in to access the book."/>
            {(FlowRouter.getRouteName() === "loginPage") ? <MeteorLoginForm /> : <EmailLoginForm/>}
          </div>
        </div>
      </FormLayout>
    )
  }

});