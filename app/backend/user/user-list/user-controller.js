'use strict';
angular.module('backend-module.user')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.user.list', {
            url: '/list?nameSearch&perPage&page',
            templateUrl: 'backend/user/user-list/user.html',
            controller: 'UserListController',
            roleUser: 1,
            resolve: {
                _users: [
                    'CustomerCustomers', '$stateParams',
                    function (CustomerCustomers, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersUsers = {
                            'sort': '-updatedAt',
                            expand: '',
                            'per-page': perPage,
                            page: page
                        };
                        return CustomerCustomers.getList(FiltersUsers);
                    }
                ]
            }
        });
    }])
    .controller('UserListController',
        ['$scope', '$rootScope', '$modal', '$timeout', '_users', 'UserUsers',
            function ($scope, $rootScope, $modal, $timeout, _users, UserUsers) {


                $scope.getUserRole = function (role) {

                    var index = _.findIndex($rootScope.UserRolesList, {id: role });
                    return $rootScope.UserRolesList[index].nameRole;
                }
                $scope.SelectUser = function (email) {
                    $scope.UserSelected = email;
                }
                $scope.search = {};
                $scope.users = _users.data;
                $scope.search.totalItems = _users.headers('x-pagination-total-count');
                $scope.search.currentPage = _users.headers('x-pagination-current-page');
                $scope.search.itemsPerPage = _users.headers('x-pagination-per-page');
                $scope.search.maxPageSize = 4;
                $scope.setPerPage = function (perPage) {
                    $scope.search.itemsPerPage = perPage;
                    goToUsersList();

                };

                $scope.saveUserRole = function (user) {

                    user.save().then(function () {
                        $scope.userSaved = user.email + ' is saved successfully '
                    });
                }
                $scope.pageChanged = function () {

                    goToUsersList()
                };
                function goToUsersList() {

                    var page = $scope.search.currentPage;
                    var perPage = $scope.search.itemsPerPage;

                    var FiltersUsers = {
                        'sort': '-updatedAt',
                        expand: '',
                        'per-page': perPage,
                        page: page
                    };


                    UserUsers.getList(
                            FiltersUsers
                        ).then(function (result) {

                            $scope.users = result.data;

                            $scope.search.totalItems = result.headers('x-pagination-total-count');
                            $scope.search.currentPage = result.headers('x-pagination-current-page');
                            $scope.search.itemsPerPage = result.headers('x-pagination-per-page');
                            $scope.displayPageBoundaryLinks = Math.ceil($scope.search.totalItems / $scope.search.itemsPerPage) > $scope.search.maxPageSize;

                        });

                }
            }]);