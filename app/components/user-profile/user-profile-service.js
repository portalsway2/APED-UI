angular.module('user-profile')
    .factory('UserProfile',
        ['Restangular',
            function (Restangular) {
                return Restangular.service('customer/portals/profile');
            }]);
