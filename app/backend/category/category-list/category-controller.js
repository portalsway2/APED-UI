'use strict';
angular.module('backend-module.category')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.category.list', {
            url: '/list',
            templateUrl: 'backend/category/category-list/category.html',
            controller: 'CategoryListController',
            authenticate: true,
            role: "admin",
            roleUser: 1,
            resolve: {
                _categories: [
                    'CategoryCategories', '$stateParams',
                    function (CategoryCategories, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersCategory = {
                            'sort': '-updatedAt',
                            expand: 'brand',
                            'per-page': perPage,
                            page: page
                        };
                        return CategoryCategories.getList(FiltersCategory);
                    }
                ]
            }
        });
    }])
    .controller('CategoryListController',
        ['$scope', '$modal', '$timeout', '_categories', 'CategoryCategories',
            function ($scope, $modal, $timeout, _categories, CategoryCategories) {
                $scope.categories = _categories.data;

                console.log($scope.categories);
                $scope.search = {};

                $scope.search.totalItems = _categories.headers('x-pagination-total-count');
                $scope.search.currentPage = _categories.headers('x-pagination-current-page');
                $scope.search.itemsPerPage = _categories.headers('x-pagination-per-page');
                $scope.search.maxPageSize = 4;
                $scope.setPerPage = function (perPage) {
                    $scope.search.itemsPerPage = perPage;
                    goToCategoriesList();

                };

                $scope.pageChanged = function () {

                    goToCategoriesList()
                };
                function goToCategoriesList() {

                    var page = $scope.search.currentPage;
                    var perPage = $scope.search.itemsPerPage;

                    var FiltersDevices = {
                        'sort': '-updatedAt',
                        expand: '',
                        'per-page': perPage,
                        page: page
                    };


                    CategoryCategories.getList(
                            FiltersDevices
                        ).then(function (result) {

                            $scope.categories = result.data;

                            $scope.search.totalItems = result.headers('x-pagination-total-count');
                            $scope.search.currentPage = result.headers('x-pagination-current-page');
                            $scope.search.itemsPerPage = result.headers('x-pagination-per-page');
                            $scope.displayPageBoundaryLinks = Math.ceil($scope.search.totalItems / $scope.search.itemsPerPage) > $scope.search.maxPageSize;

                        });

                }
            }]);