'use strict';
angular.module('frontend-module.home')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.home', {
            url: '',
            userNotAuthenticated: true,
            resolve: {

                _announcementsList: [
                    'ContentContents',
                    function (ContentContents) {
                        return ContentContents.getList(
                            {
                                'sort': '-updatedAt',
                                expand: 'device,owner',
                                'per-page': 6,
                                page: 1
                            }
                        );
                    }
                ],
                _topCategories: [
                    'CategoryCategoriesFormatted',
                    function (CategoryCategoriesFormatted) {
                        return CategoryCategoriesFormatted.getList(
                            {
                                'sort': '-updatedAt',
                                expand: 'images',
                                'per-page': 3,
                                page: 1
                            }
                        );
                    }
                ],
                _topProducts: [
                    'ProductProducts',
                    function (ProductProducts) {
                        return ProductProducts.getList(
                            {
                                'sort': '-updatedAt',
                                expand: 'images',
                                'per-page': 3,
                                page: 1
                            }
                        );
                    }
                ],
                _topBrands: [
                    'BrandBrands',
                    function (BrandBrands) {
                        return BrandBrands.getList(
                            {
                                'sort': '-updatedAt',
                                expand: 'images',
                                'per-page': 3,
                                page: 1
                            }
                        );
                    }
                ]
            },
            templateUrl: 'frontend/home/home.html',
            controller: 'HomeFrontendController',
            authenticate: true
        });
    }])
    .controller('HomeFrontendController',
        ['$scope', '$modal', '$timeout', '_announcementsList', '_topCategories', '_topBrands', '_topProducts',
            function ($scope, $modal, $timeout, _announcementsList, _topCategories, _topBrands, _topProducts) {


                $scope.announcementsList = _announcementsList.data;
                $scope.topCategories = _topCategories.data;
                $scope.topBrands = _topBrands.data;
                $scope.topProducts = _topProducts.data;


            }]);