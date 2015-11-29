/* global Meteor Notifications */

Meteor.publish('notifications', function() {
  return Notifications._collection.find({userId: this.userId});
});

function isOwnNotification(userId, notif) {
  return notif.userId === userId;
}

Notifications._collection.allow({
  insert: isOwnNotification,
  remove: isOwnNotification,
});
