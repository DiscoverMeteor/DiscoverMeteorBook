/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

import {mount} from 'react-mounter';

SITE_KEY = 'dm';
BOOK_KEY = 'dmBook';

// Config

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("layout", {main: "notFound"});
  }
};

// Filters

var filters = {
  // TODO attachCode, similarly

  trackPageview: function () {
    trackPageview(this.url);
    this.next();
  },

  clearErrorMessages: function () {
    clearFlash();
    this.next();
  }

};

// if (Meteor.isClient) {
//   Router.onBeforeAction(filters.clearErrorMessages);
//   Router.onRun(filters.trackPageview);
// }

// Routes

// Book

FlowRouter.route('/chapter/:slug', {
  name: 'chapter',
  action: function (params) {
    mount(App, {content: <ChapterPage {...params}/>});
  },
  triggersExit: [(context, redirect) => {
    $('body').removeClass('toc-open comments-open vocabulary-open sidebar-open');
  }]
});

// FlowRouter.route('/print-3', {
//   name: 'print-3',
//   action: function () {
//     BlazeLayout.render('app', {main: 'bookPDF'});
//   }
// });

// Videos

FlowRouter.route('/video/:slug', {
  name: 'videoPage',
  action: function (params) {
    mount(App, {content: <VideoPage {...params}/>});
  }
});

// Interviews

FlowRouter.route('/interview/:slug', {
  name: 'interviewPage',
  action: function (params) {
    mount(App, {content: <InterviewPage {...params}/>});
  }
});

// Pages

FlowRouter.route('/', {
  name: 'homepage',
  action: function (params) {
    mount(App, {content: <HomePage/>});
  }
});

FlowRouter.route('/changelog', {
  name: 'changelogPage',
  action: function (params) {
    mount(App, {content: <ChangelogPage/>});
  }
});

FlowRouter.route('/starter', {
  name: 'starterPage',
  action: function (params) {
    mount(App, {content: <StarterPage/>});
  }
});

// FlowRouter.route('/loading', {
//   name: 'loading',
//   action: function () {
//     BlazeLayout.render('app', {main: 'loading'});
//   }
// });

// Users

// FlowRouter.route('/purchase', {
//   name: 'purchase',
//   action: function () {
//     BlazeLayout.render('app', {main: 'purchaseSelector'});
//   }
// });

FlowRouter.route('/login', {
  name: 'loginPage',
  action: function (params) {
    mount(App, {content: <LoginPage/>});
  }
});

FlowRouter.route('/email-login', {
  name: 'emailLoginPage',
  action: function (params) {
    mount(App, {content: <LoginPage/>});
  }
});

FlowRouter.route('/forgot-password', {
  name: 'forgotPasswordPage',
  action: function (params) {
    mount(App, {content: <ForgotPasswordPage/>});
  }
});

FlowRouter.route('/reset-password/:token', {
  name: 'resetPasswordPage',
  action: function (params) {
    mount(App, {content: <ResetPasswordPage {...params}/>});
  }
});

FlowRouter.route('/change-email', {
  name: 'changeEmailPage',
  action: function (params) {
    mount(App, {content: <ChangeEmailPage/>});
  }
});

FlowRouter.route('/finish-signup/:token?', {
  name: 'finishSignupPage',
  action: function (params) {
    mount(App, {content: <FinishSignupPage {...params}/>});
  }
});

FlowRouter.route('/account', {
  name: 'accountPage',
  action: function (params) {
    mount(App, {content: <ProfilePage _id={Meteor.userId()}/>});
  }
});

FlowRouter.route('/user/:_id', {
  name: 'profilePage',
  action: function (params) {
    mount(App, {content: <ProfilePage {...params}/>});
  }
});

// admin

FlowRouter.route('/admin/users', {
  name: 'adminUsersPage',
  action: function (params) {
    mount(App, {content: <AdminUsersPage/>});
  }
});

FlowRouter.route('/admin/purchases', {
  name: 'adminPurchasesPage',
  action: function (params) {
    mount(App, {content: <AdminPurchasesPage/>});    
  }
});

FlowRouter.route('/admin/purchase/:purchaseId', {
  name: 'adminPurchasePage',
  action: function (params) {
    mount(App, {content: <AdminPurchasePage {...params}/>});
  }
});