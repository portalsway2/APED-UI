'use strict';
angular.module('backend-module.brand')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.brand.edit', {
            url: '/edit/{id:[0-9]*}',
            templateUrl: 'backend/brand/brand-edit/brand-edit.html',
            controller: 'BrandEditController',
            authenticate: true,
            role: "admin",
            resolve: {
                _brand: [
                    'BrandBrands', '$stateParams',
                    function (BrandBrands, $stateParams) {
                        if ($stateParams.id) {
                            return BrandBrands.one($stateParams.id).get({expand: "categories"});
                        } else {
                            var object = {data: BrandBrands.one()};
                            object.data.categories = [];
                            object.data.images = [];

                            return object;
                        }

                    }
                ],
                _categories: [
                    'CategoryCategories',
                    function (CategoryCategories) {
                        return CategoryCategories.getList();
                    }
                ]
            }
        });
    }])
    .controller('BrandEditController',
        ['$scope', '$modal', '$state', '$timeout', '_brand', '_categories',
            function ($scope, $modal, $state, $timeout, _brand, _categories) {
                $scope.brand = _brand.data;
                $scope.categories = _categories.data;


                $scope.UploadFile = {
                    open: function () {

                        var actionConfiguration = $modal.open({
                            templateUrl: 'components/device-devices/add-images-modal/add-images-modal.html',
                            controller: 'AddImagesModalController'

                        });
                        actionConfiguration.result.then(function (result) {
                            for (var i = 0; i < result.length; i++) {
                                $scope.brand.images.push(result[i]);
                            }

                        }, function () {

                        });
                    }
                };

                $scope.AddCategories = {

                    open: function (categories, $index) {
                        var categories_list = angular.copy($scope.brand.categories);
                        var addCategories = $modal.open({
                            templateUrl: 'components/category-categories/select-categories/select-categories.html',
                            controller: 'SelectCategoriesModalController',
                            resolve: {
                                _brandCategories: function () {
                                    return categories_list;
                                },
                                _categories: function () {
                                    return $scope.categories;
                                }
                            }
                        });
                        addCategories.result.then(function (result) {

                            $scope.brand.categories = result;
                        }, function () {


                        });
                    }
                };
                $scope.saveBrand = function () {


                    for (var i = 0; i < $scope.brand.categories.length; i++) {
                        delete($scope.brand.categories[i].images);
                    }

                    $scope.brand.save().then(function () {

                        $state.go("backend.brand.list");
                    }, function () {

                    });
                }


            }]);