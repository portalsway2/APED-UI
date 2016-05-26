'use strict';
angular.module('frontend-module.checkout')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.checkout.step2', {
            url: '/step/2',
            templateUrl: 'frontend/checkout/checkout-second-step/checkout-step2.html',
            controller: 'Checkout2ViewController',
            userNotAuthenticated: true,
            resolve: {
                _shipping: [
                    'ShippingShippings', '$stateParams',
                    function (ShippingShippings, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersShippings = {
                            'sort': '-updatedAt',
                            expand: '',
                            'per-page': perPage,
                            page: page
                        };
                        return ShippingShippings.getList(FiltersShippings);
                    }
                ],
                basketObject: [ function () {
                    if (localStorage.getItem("basket")) {
                        return JSON.parse(localStorage.getItem("basket"));
                    } else {
                        return {
                            numberItems: 0,
                            totalPrice: 0,
                            listItems: []
                        }
                    }

                }]

            }
        });
    }])
    .controller('Checkout2ViewController',
        ['$scope', '$modal', '$state', '$timeout', 'basketObject', '_shipping',
            function ($scope, $modal, $state, $timeout, basketObject, _shipping) {


                $scope._shipping = _shipping.data;
                console.log($scope._shipping)

                $scope.mehtodSelected = {};
                $scope.selectShipping = function (shipping) {
                    $scope.mehtodSelected = shipping;
                }


            }]);