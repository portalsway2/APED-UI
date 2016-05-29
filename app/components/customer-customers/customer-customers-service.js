angular.module('customer-customers')
    .factory('CustomerCustomers',
        ['Restangular', function (Restangular) {

            return Restangular.service('customer/customers');
        }]);