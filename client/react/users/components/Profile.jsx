Profile = createReactClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    product: React.PropTypes.object,
    purchases: React.PropTypes.array
  },

  isCurrentUserProfile() {
    return this.props.userId === this.props.currentUser._id;
  },

  attachMeteorAccount(event) {
    event.preventDefault();
    MeteorDeveloperAccounts.requestCredential(function(credentialTokenOrError){
      if (credentialTokenOrError && credentialTokenOrError instanceof Error) {
        var message = credentialTokenOrError.reason || credentialTokenOrError.message;
        return flash(message, 'error');
      }

      var credentialSecret = OAuth._retrieveCredentialSecret(credentialTokenOrError);
      Meteor.call('attachMDAccountToCurrentUser', credentialTokenOrError, credentialSecret, function(error) {
        if (error)
          return flash(error.error, 'error');

        flash("You've successfully attached your account.");
      });
    });
  },

  handleLogout(event) {
    event.preventDefault();
    Meteor.logout(function(){
      flash('You are now logged out.');
      FlowRouter.go('/');
    });
  },

  renderEmailOptions() {
    if (this.props.user.hasEmail()) {
      return (
        <span>
          <li><a href={FlowRouter.path("changeEmailPage")}>Change Email</a></li>
          <li><a href={FlowRouter.path("forgotPasswordPage")}>Reset Password</a></li>
        </span>
      )
    }
  },

  renderMeteorOptions() {
    if (this.props.user.hasMeteorAccount()) {
      return <li>Meteor account: <strong>{this.props.user.services["meteor-developer"].username}</strong></li>
    } else {
      return <li><a className="attach-md-account" href="#" onClick={this.attachMeteorAccount}>Attach your Meteor Developer Account</a></li>
    }
  },

  renderLogout() {
    if (this.isCurrentUserProfile()) {
      return <li><a href="/" className="log-out-link" onClick={this.handleLogout}>Log Out</a></li>
    }
  },

  render() {
    const productLevel = this.props.user.productLevel(this.props.product);
    return (
      <div>
        <h3>Account</h3>
        <ul>
          <li>Level: <strong>{productLevel && productLevel.name}</strong></li>
          <li>Email: {this.props.user.getEmail()}</li>
          {this.renderEmailOptions()}
          {this.renderMeteorOptions()}
          {this.renderLogout()}
        </ul>

        <UserPurchases userId={this.props.user._id}/>
      </div>
    )
  }

});