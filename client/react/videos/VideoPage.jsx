import createReactClass from 'create-react-class';

VideoPage = createReactClass({
  
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      video: Videos.findOne({slug: FlowRouter.getParam("slug")}),
      user: Meteor.user(),
      product: Products.findOne({key: BOOK_KEY})
    }
  },

  render() {
    if (!this.data.user) {
      return <LoginPage/>
    } else if (this.data.user.hasPermission(this.data.product, "full")){
      return <Layout><Video key={this.data.video._id} video={this.data.video} /></Layout>;
    } else {
      return <Layout><div>Please upgrade!</div></Layout>
    }
  }

});