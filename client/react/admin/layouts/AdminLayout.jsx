AdminLayout = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      user: Meteor.user(),
    }
  },
  
  render() {
    if (!this.data.user) { // user is not logged in

      return <Layout><p><a href={FlowRouter.path("loginPage")}>Please log in</a></p></Layout>
    
    } else if (!this.data.user.isAdmin()) {

      return <Layout><p>Sorry, you don't have the rights to view this page.</p></Layout>

    } else {
    
      return (
        <div className="layout dashboard-layout">
          <Header />
          <div className="dashboard-container">
            <ul className="dashboard-nav">
              <li><a href={FlowRouter.path("adminUsersPage")}>Users</a></li>
              <li><a href={FlowRouter.path("adminPurchasesPage")}>Purchases</a></li>
            </ul>
            {this.props.children}
          </div>
          <Footer />
        </div>
      )
    }
  }

});