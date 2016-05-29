'use strict';
angular.module('backend-module.dashboard2')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.index', {
            url: '',
            roleUser: 3,
            templateUrl: 'backend/dashboard/dashboard.html',
            controller: 'DashboardController',
            authenticate: true,
            role: "admin",
        });
    }])
    .controller('DashboardController',
        ['$scope', '$modal', '$timeout',
            function ($scope, $modal, $timeout) {

            }]);