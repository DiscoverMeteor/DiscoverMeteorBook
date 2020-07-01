import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

ProfilePage = createReactClass({

  propTypes: {
    _id: PropTypes.string // user ID
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {

    var userId = this.props._id || Meteor.user()._id;
    this.userProfileDataSub = Meteor.subscribe('userProfileData', userId);
    var user = this.props._id ? Meteor.users.findOne(this.props._id) : Meteor.user();

    return {
      currentUser: Meteor.user(),
      user: user,
      product: Products.findOne({key: BOOK_KEY})
    }
  },

  isCurrentUserProfile() {
    return this.props._id === this.data.currentUser._id;
  },

  render() {
    if (!this.data.currentUser) { // user is not logged in

      return <LoginPage />
    
    } else if (!this.data.user) { // still loading user data

      return <Loading />

    } else if (this.isCurrentUserProfile() || this.data.currentUser.isAdmin()) { // user is checking their own profile, or they're admin

      return <Layout><Profile {...this.data} /></Layout>;

    } else { // user is checking somebody else's profile
      
      return <NoRightsPage />
    }
  }

});