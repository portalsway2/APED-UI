'use strict';
angular.module('backend-module.brand')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.brand.list', {
            url: '/list?nameSearch&perPage&page',
            templateUrl: 'backend/brand/brand-list/brand.html',
            controller: 'BrandListController',
            authenticate: true,
            role: "admin",
            roleUser: 3,
            resolve: {
                _brands: [
                    'BrandBrands', '$stateParams',
                    function (BrandBrands, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersBrands = {
                            'sort': '-updatedAt',
                            expand: '',
                            'per-page': perPage,
                            page: page
                        };
                        return BrandBrands.getList(FiltersBrands);
                    }
                ]
            }
        });
    }])
    .controller('BrandListController',
        ['$scope', '$rootScope', '$modal', '$timeout', '_brands', 'BrandBrands',
            function ($scope, $rootScope, $modal, $timeout, _brands, BrandBrands) {
                $scope.search = {};
                $scope.brands = _brands.data;
                $scope.search.totalItems = _brands.headers('x-pagination-total-count');
                $scope.search.currentPage = _brands.headers('x-pagination-current-page');
                $scope.search.itemsPerPage = _brands.headers('x-pagination-per-page');
                $scope.search.maxPageSize = 4;
                $scope.setPerPage = function (perPage) {
                    $scope.search.itemsPerPage = perPage;
                    goToBrandsList();

                };

                $scope.pageChanged = function () {

                    goToBrandsList()
                };
                function goToBrandsList() {

                    var page = $scope.search.currentPage;
                    var perPage = $scope.search.itemsPerPage;

                    var FiltersBrands = {
                        'sort': '-updatedAt',
                        expand: '',
                        'per-page': perPage,
                        page: page
                    };


                    BrandBrands.getList(
                            FiltersBrands
                        ).then(function (result) {

                            $scope.brands = result.data;

                            $scope.search.totalItems = result.headers('x-pagination-total-count');
                            $scope.search.currentPage = result.headers('x-pagination-current-page');
                            $scope.search.itemsPerPage = result.headers('x-pagination-per-page');
                            $scope.displayPageBoundaryLinks = Math.ceil($scope.search.totalItems / $scope.search.itemsPerPage) > $scope.search.maxPageSize;

                        });

                }
            }]);