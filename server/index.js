/* global Meteor Notifications */

Meteor.publish('notifications', function() {
  return Notifications._collection.find({userId: this.userId});
});
