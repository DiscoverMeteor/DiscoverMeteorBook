MeteorLoginForm = createReactClass({

  handleSubmit(event) {
    event.preventDefault();
    Meteor.loginWithMeteorDeveloperAccount(function(error) {
      if (error)
        return flash(error.error, 'error');
        
      FlowRouter.go('/')
      flash('You are now logged in.');
    });
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-actions">
          <button className="button simple-button meteor-developer">Log In With Your Meteor Account</button>
        </div>
        <div className="form-footer">
          <span className="form-divider">or </span>
          <a href={FlowRouter.path("emailLoginPage")} className="form-link">Log in with your email</a>.
        </div>
      </form>
    )
  }

});