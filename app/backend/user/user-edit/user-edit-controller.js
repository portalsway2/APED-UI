'use strict';
angular.module('backend-module.user')
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('backend.user.edit', {
            url: '/edit/{id:[0-9]*}',
            templateUrl: 'backend/user/user-edit/user-edit.html',
            controller: 'UserEditController',
            authenticate: true,
            role: "admin",
            resolve: {
                _user: [
                    'UserUsers', '$stateParams',
                    function (UserUsers, $stateParams) {

                        if ($stateParams.id) {
                            return UserUsers.one($stateParams.id).get({expand: ""});
                        } else {
                            var object = {data: UserUsers.one()};
                            object.data.categories = [];
                            object.data.images = [];

                            return object;
                        }

                    }
                ]
            }
        });
    }])
    .controller('UserEditController',
        ['$scope', '$modal', '$state', '$timeout', '_user',
            function ($scope, $modal, $state, $timeout, _user) {
                console.log(5)
                $scope.user = _user.data;


                $scope.saveUser = function () {

                    $scope.user.save().then(function () {

                        // $state.go("backend.user.list");
                    }, function () {

                    });
                }


            }]);