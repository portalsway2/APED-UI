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
        ['$rootScope', '$scope', '$modal', '$state', '$timeout', 'basketObject', '_shipping',
            function ($rootScope, $scope, $modal, $state, $timeout, basketObject, _shipping) {
                $rootScope.nameStep = "Shipping Methods";
                $rootScope.nextStep = "frontend.checkout.step3";
                $rootScope.previousStep = "frontend.checkout.step1";
                $scope._shipping = _shipping.data;

                $rootScope.goPreviousStep = function () {
                    $state.transitionTo($rootScope.previousStep)
                };
                $rootScope.goNextStep = function () {
                    $state.transitionTo($rootScope.nextStep)
                };
                $scope.mehtodSelected = {};
                if ($scope.basket.shippingMethod) {
                    $scope.mehtodSelected = $scope.basket.shippingMethod;
                }


                $scope.selectShipping = function (shipping) {
                    $scope.mehtodSelected = shipping;
                    addShippingMethod()
                };
                function addShippingMethod() {

                    $scope.basket.shippingMethod = $scope.mehtodSelected;
                    $scope.basket.TotalIncludeShipping = $scope.basket.totalPrice + parseFloat($scope.basket.shippingMethod.configuration);
                    setBasket($scope.basket);
                    $rootScope.basket = $scope.basket;


                }

                function setBasket(basket) {
                    console.log(basket)
                    localStorage.setItem("basket", JSON.stringify(basket));
                };


            }]);