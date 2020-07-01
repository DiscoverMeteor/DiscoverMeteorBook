import createReactClass from 'create-react-class';

EmailLoginForm = createReactClass({

  handleSubmit(event) {
    event.preventDefault();
    var email = this.refs.email.value;
    var password = this.refs.password.value;
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
        flash(error.reason, 'error');
      }else{
        FlowRouter.go('/');
        flash('You are now logged in.');
      }
    });
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="control-group">
          <label>Email</label>
          <div className="controls"><input id="email" ref="email" type="email" className="text" placeholder="Email"/></div>
        </div>
        <div className="control-group">
          <label>Password</label>
          <div className="controls"><input id="password" ref="password" type="password" className="text" placeholder="Password"/></div>
          <a href={FlowRouter.path("forgotPasswordPage")} className="form-forgot form-link">Forgot password?</a>

        </div>
        <div className="form-actions">
          <button type="submit" className="button simple-button" >Log In</button>
        </div>
        <div className="form-footer">
          <span className="form-divider">or </span>
          <a href={FlowRouter.path("loginPage")} className="form-link">Log in with your Meteor account</a>.
        </div>
      </form>
    )
  }

});

