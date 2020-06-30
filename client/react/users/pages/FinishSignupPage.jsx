FinishSignupPage = React.createClass({
  
  getInitialState() {
    return {
      checkingToken: true,
      tokenError: false,
      hasMeteorAccount: false, 
      hasEmailAccount: false,
      token: FlowRouter.getParam("token"),
      signupMethod: "meteor"
    }
  },

  componentDidMount() {
    var component = this;

    Meteor.call('tokenUsed', this.state.token, function (err, type) {
      
      var state = {checkingToken: false};

      if (err) {
        state.tokenError = true;
      }
      
      if (type === 'meteor-developer') {
        state.hasMeteorAccount = true;
      } else if (type === 'password') {
        state.hasEmailAccount = true;
      }

      component.setState(state);
    });
  },

  finishSignupMeteor(event) {
    event.preventDefault();
    MeteorDeveloperAccounts.requestCredential(credentialTokenOrError => {
      if (credentialTokenOrError && credentialTokenOrError instanceof Error) {
        var message = credentialTokenOrError.reason || credentialTokenOrError.message;
        return flash(message, 'error');
      }
      
      // Attach the MD account to the passwords user that's associated with 
      // this account
      var credentialSecret = _retrieveCredentialSecret(credentialTokenOrError);
      Meteor.call('attachMDAccountToUserByCredential', 
          this.state.token, 
          credentialTokenOrError, 
          credentialSecret, error => {

        if (error)
          return flash(error.error, 'error');
        
        // ok, the account exists, we can login now
        Accounts.oauth.tryLoginAfterPopupClosed(credentialTokenOrError, error => {
          if (error)
            return flash(error.error, 'error');
            
          FlowRouter.go('/')
          flash('You are now logged in.');
        });
      });
    });
  },

  finishSignupEmail(event) {
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

  toggleSignupMethod(event) {
    event.preventDefault();

    var signupMethod = this.state.signupMethod === "meteor" ? "email" : "meteor";
    this.setState({signupMethod: signupMethod});

  },

  render() {
    if (this.state.checkingToken) { // still checking token

      return (
        <Loading/>
      )
    
    } else if (this.state.tokenError) { // invalid token
    
      return (
        <FormWrapper>
          <Flash message="The URL appears to be incorrect. Check your email!"/>
        </FormWrapper>
      )

    } else if (this.state.hasMeteorAccount) { // user has already created a Meteor account

      return (
        <FormWrapper>
          <Flash message="Log in to access the book."/>
          <MeteorLoginForm />
        </FormWrapper>
      )

    } else if (this.state.hasEmailAccount) { // user has already created an email/password account

      return (
        <FormWrapper>
          <Flash message="Log in to access the book."/>
          <EmailLoginForm/>
        </FormWrapper>
      )

    } else if (this.state.signupMethod === "meteor") { // finish signup using Meteor account

      return (
        <FormWrapper>
          <Flash message="Connect your Meteor account to complete signup."/>
          <form onSubmit={this.finishSignupMeteor}>
            <div className="form-actions">
              <button className="button simple-button meteor-developer">Connect Your Meteor Account</button>
            </div>
            <div className="form-footer">
              <span className="form-divider">or </span>
              <a onClick={this.toggleSignupMethod} href="#" className="form-link">Finish Signup With Email/Password</a>.
            </div>
          </form>
        </FormWrapper>
      )

    } else if (this.state.signupMethod === "email") { // finish signup using email/password

      return (
        <FormWrapper>
          <Flash message="Enter a password to complete signup."/>
          <form onSubmit={this.finishSignupEmail}>
            <div className="control-group">
              <label>Your Password</label>
              <div className="controls"><input id="password" ref="password" name="password" type="password" className="text"/></div>
            </div>
            <div className="form-actions">
              <input type="submit" className="button simple-button" value="Submit" />
            </div>
            <div className="form-footer">
              <span className="form-divider">or </span>
              <a onClick={this.toggleSignupMethod} href="#" className="form-link">Finish Signup With Your Meteor Account</a>.
            </div>
          </form>
        </FormWrapper>
      )
    }
  }

});