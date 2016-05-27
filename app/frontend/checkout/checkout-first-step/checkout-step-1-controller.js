'use strict';
angular.module('frontend-module.checkout')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.checkout.step1', {
            url: '/step/1',
            templateUrl: 'frontend/checkout/checkout-first-step/checkout-step1.html',
            controller: 'Checkout1ViewController',
            userNotAuthenticated: true,
            resolve: {
                _devices: [
                    'ContentContents', '$stateParams',
                    function (ContentContents, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersDevices = {
                            'sort': '-updatedAt',
                            'per-page': perPage,
                            page: page
                        };
                        return ContentContents.getList(FiltersDevices);
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
    .controller('Checkout1ViewController',
        ['$rootScope', '$scope', '$modal', '$state', '$timeout', 'basketObject', '_devices',
            function ($rootScope, $scope, $modal, $state, $timeout, basketObject, _devices) {
                $rootScope.nameStep = "Order Details";
                $rootScope.nextStep = "frontend.checkout.step2";
                $rootScope.previousStep = null;
                $scope._devices = _devices.data;

                $rootScope.goPreviousStep = function () {
                    $state.transitionTo($rootScope.previousStep)
                }
                $rootScope.goNextStep = function () {
                    $state.transitionTo($rootScope.nextStep)
                }

                $scope.basket = basketObject;
                $scope.removeItemFromBasket = function (item) {

                    $scope.basket.totalPrice -= item.price;
                    $scope.basket.numberItems -= 1;
                    for (var i = 0; i < $scope.basket.listItems.length; i++) {
                        if (item.id == $scope.basket.listItems[i].id) {
                            $scope.basket.listItems.splice(i, 1);
                        }
                    }
                    setBasket($scope.basket);
                    $rootScope.basket = $scope.basket;


                }

                function setBasket(basket) {
                    localStorage.setItem("basket", JSON.stringify(basket));
                };


            }]);