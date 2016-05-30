angular.module('notification-notifications')
    .factory('NotificationNotifications',
        ['Restangular', function (Restangular) {

            return Restangular.service('notification/notifications');
        }]);