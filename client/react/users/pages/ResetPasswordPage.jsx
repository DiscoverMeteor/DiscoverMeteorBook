ResetPasswordPage = React.createClass({
  
  resetPassword(event) {
    event.preventDefault();
    var password = this.refs.password.value;

    if(!!password){
      Accounts.resetPassword(FlowRouter.getParam("token"), password, function(error, result) {
        if (error) {
          flash(error.reason, 'error');
        } else {
          FlowRouter.go('/');
          flash('You are now logged in.');
        }
      });
    }else{
      flash('Please enter a password', 'error');
    }

  },

  render() {

    return (
      <FormWrapper>
        <Flash message="Reset your password."/>
        <form onSubmit={this.resetPassword}>
          <div className="control-group">
            <label>Your Password</label>
            <div className="controls"><input id="password" ref="password" name="password" type="password" className="text"/></div>
          </div>
          <div className="form-actions">
            <input type="submit" className="button simple-button" value="Submit" />
          </div>
        </form>
      </FormWrapper>
    )

  }

});