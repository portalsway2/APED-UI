angular.module('frontend-module.checkout', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.checkout', {
            url: '/checkout',
            templateUrl: 'frontend/checkout/checkout.html',
            userNotAuthenticated: false


        });
    }]);
