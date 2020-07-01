ForgotPasswordPage = createReactClass({
  
  handleSubmit(event) {
    event.preventDefault();
    var email = this.refs.email.value;

    if(!email){
      flash('Please enter your email.', 'error');
      return;
    }

    flash("Working…");

    Meteor.call('Meteor.users.mutate.resetPassword', email, function(error, result){
      if(error){
        flash(error.reason, 'error');
      }else{
        flash("Password reset link sent!");
      }
    });
  },

  render() {
    return (
      <FormLayout>
        <div classNameName="form-container">
          <div className="form-area">
            <form onSubmit={this.handleSubmit}>
              <Flash message="Reset your password"/>
              <div className="control-group">
                <label>Your Email</label>
                <div className="controls"><input id="email" ref="email" name="email" type="email" className="text" placeholder="Your Email"/></div>
              </div>
              <div className="form-actions">
                <input type="submit" className="button simple-button" value="Reset Password" />
              </div>
              <div className="form-footer">
                <span className="form-divider">or </span>
                <a href={FlowRouter.path("emailLoginPage")} className="form-link">Log in with your email</a>.
              </div>
            </form>
          </div>
        </div>
      </FormLayout>
    )
  }

});