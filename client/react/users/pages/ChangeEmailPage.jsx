ChangeEmailPage = createReactClass({
    
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      user: Meteor.user()
    }
  },

  handleSubmit(event) {
    event.preventDefault();
    var email = this.refs.email.value;

    if(!!email){
      Meteor.call("users/changeEmail", this.data.user._id, email, function (error, result) {
        if (error) {
          flash(error.reason, 'error');
        } else {
          flash("Email updated.");
        }
      });
    }else{
      flash('Please enter an email', 'error');
    }
  },

  render() {
    return (
      <FormLayout>
        <div className="form-container">
          <div className="form-area">
            <form onSubmit={this.handleSubmit}>
              <Flash message="Enter a new email:"/>
              <div className="control-group">
                <label>New Email</label>
                <div className="controls"><input id="email" ref="email" name="email" type="email" className="text email" placeholder="Your Email"/></div>
              </div>
              <div className="form-actions">
                <input type="submit" className="button simple-button" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </FormLayout>
    )
  }

});