import createReactClass from 'create-react-class';

InterviewPage = createReactClass({
  
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      interview: Interviews.findOne({slug: FlowRouter.getParam("slug")}),
      user: Meteor.user(),
      product: Products.findOne({key: BOOK_KEY})
    }
  },

  render() {
    if (!this.data.user) {
      return <Layout><div><a href={FlowRouter.path("loginPage")}>Please log in</a></div></Layout>
    } else {
      if (this.data.user.hasPermission(this.data.product, "full")){
        return <Layout><Interview key={this.data.interview._id} interview={this.data.interview} /></Layout>;
      } else {
        return <Layout><div>Please upgrade!</div></Layout>
      }
    }
  }

});