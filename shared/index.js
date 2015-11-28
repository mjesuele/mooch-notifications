/* global check Meteor Mongo Notifications Random SimpleSchema */

Notifications = {};

Notifications._collection = new Mongo.Collection('notifications');

Notifications._schema = new SimpleSchema({
  userId: {
    type: String,
  },
  data: {
    type: Object,
    blackbox: true,
  },
});

Notifications._collection.attachSchema(Notifications._schema);

Notifications._handlers = {};

Notifications.emit = function(type, data, callback) {
  const handler = this._handlers[type];
  return typeof handler === 'function' ? handler(data, callback) : false;
};

Notifications.registerHandler = function(type, handler) {
  check(handler, Function);
  const uniqueId = Random.id;
  Meteor.methods({[uniqueId]: handler});
  this._handlers[type] = (data, callback) => {
    return Meteor.call(uniqueId, type, data, callback);
  };

  return true;
};

Notifications.removeHandler = function(type) {
  delete this._handlers[type];
};

Notifications.addNotification = function(userId, type, data, callback) {
  Meteor.call('mooch:notifications/addNotification', userId, data, callback);
};

Notifications.removeNotification = function(_id, callback) {
  Meteor.call('mooch:notifications/removeNotification', _id, callback);
};

Notifications.getNotifications = function({ userId, type }) {
  const query = { userId };
  if (type) query['data.type'] = type;
  return Notifications._collection.find(query).fetch();
};

Meteor.methods({
  'mooch:notifications/addNotification': function(userId, type, data) {
    const u = Meteor.users.findOne(userId);
    check(u, Object);
    check(data, Object);

    return !!Notifications._collection.insert({data, userId});
  },

  'mooch:notifications/removeNotification': function(_id) {
    check(_id, String);
    return !!Notifications._collection.remove(_id);
  },
});
