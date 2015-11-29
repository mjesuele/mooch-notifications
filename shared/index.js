/* global check Match Meteor Mongo Notifications Random SimpleSchema */

/* eslint-disable no-native-reassign, no-undef */
Notifications = {};
/* eslint-enable no-native-reassign, no-undef */

Notifications._collection = new Mongo.Collection('notifications');

Notifications._schema = new SimpleSchema({
  data: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  type: {
    type: String,
  },
  userId: {
    type: String,
  },
});

Notifications._collection.attachSchema(Notifications._schema);

/**
 * Callback for handling success or error.
 * @callback successOrError
 * @param {Error} error - The error, if any, passed by the calling function
 * @param result - The result, if any, passed by the calling function
 */

/**
 * Creates a new notification for the given user, of the given type, with the
 * given data payload and a callback to be called on success or error.
 * @param {Object} params - The parameters for the new notification
 * @param {Object} [params.data] - The data payload attached to the notification
 * @param {String} params.type - The type of the notification
 * @param {String} params.userId - The id of the user whom the notification is for
 * @param {successOrError} [callback] - A callback which will be called on success
 *                                      or error
 * @return {String} The id of the new notification
 */
Notifications.insert = function(params, callback) {
  /* eslint-disable new-cap */
  check(callback, Match.Optional(Function));
  check(params, {
    data: Match.Optional(Object),
    type: String,
    userId: String,
  });
  /* eslint-enable new-cap */
  return this._collection.insert(params, callback);
};

/**
 * Removes the notification with the given id and calls the given callback on
 * success or error.
 * @param {String} _id - The id of the notification to remove
 * @param {successOrError} [callback] - A callback which will be called on success
 *                                      or error
 * @return {Boolean} True if a notification is removed, false otherwise
 */
Notifications.remove = function(_id, callback) {
  /* eslint-disable new-cap */
  check(callback, Match.Optional(Function));
  /* eslint-enable new-cap */
  check(_id, String);
  return !!this._collection.remove(_id, callback);
};

/**
 * Removes all notifications for a given type, userId, or both.
 * @param {Object} query - The query passed to the Mongo.Collection#remove method
 * @param {String} [query.type] - The type of the notification to clear
 * @param {String} query.userId - The userId to clear notifications for
 * @param {successOrError} [callback] - A callback which will be called on success
 *                                      or error
 * @return {Number} On the server, the number of notifications cleared. Returns
 *                  undefined on the client.
 */
Notifications.clear = function(query = {}, callback = () => {}) {
  return Meteor.isServer ?
    Notifications._collection.remove(query, callback) :
    Meteor.call('mooch:notifications/clear', query.type, callback);
};

/**
 * Gets a cursor of notifications based on the search query.
 * @param {Object|String} [query] - The query passed to the
 *                                  Mongo.Collection#find method
 * @return {Mongo.Cursor} The cursor of notifications
 */
Notifications.find = function(query = {}) {
  /* eslint-disable new-cap */
  check(query, Match.Optional(Match.OneOf(String, Object)));
  /* eslint-enable new-cap */
  return this._collection.find(query);
};

/**
 * Gets an array of notifications based on the search query.
 * @param {Object|String} [query] - The query passed to the
 *                                  Mongo.Collection#fetch method
 * @return {Object[]} The array of notifications
 */
Notifications.get = function(query = {}) {
  /* eslint-disable new-cap */
  check(query, Match.Optional(Match.OneOf(String, Object)));
  /* eslint-enable new-cap */
  return this.find(query).fetch();
};

Meteor.methods({
  /**
   * Removes all the user's notifications, optionally specifying a given type.
   * @param {String} [type] - The type of the notification to clear
   * @return {Number} The number of notifications removed
   */
  'mooch:notifications/clear'(type) {
    /* eslint-disable new-cap */
    check(type, Match.Optional(String));
    /* eslint-enable new-cap */
    return Notifications._collection.remove({
      type,
      userId: this.userId,
    });
  },
});
