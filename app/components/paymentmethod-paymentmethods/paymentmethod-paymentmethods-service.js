angular.module('paymentmethod-paymentmethods')
    .factory('PaymentmethodPaymentmethods',
        ['Restangular', function (Restangular) {

            return Restangular.service('paymentmethod/paymentmethods');
        }]);