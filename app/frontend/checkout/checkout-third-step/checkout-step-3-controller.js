'use strict';
angular.module('frontend-module.checkout')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.checkout.step3', {
            url: '/step/3',
            templateUrl: 'frontend/checkout/checkout-third-step/checkout-step3.html',
            controller: 'Checkout3ViewController',
            userNotAuthenticated: true,
            resolve: {
                _paymentMethod: [
                    'PaymentmethodPaymentmethods', '$stateParams',
                    function (PaymentmethodPaymentmethods, $stateParams) {
                        var page = $stateParams.page ? $stateParams.page : 1;
                        var perPage = $stateParams.perPage ? $stateParams.perPage : 4;

                        var FiltersShippings = {
                            'sort': '-updatedAt',
                            expand: '',
                            'per-page': perPage,
                            page: page
                        };
                        return PaymentmethodPaymentmethods.getList(FiltersShippings);
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
    .controller('Checkout3ViewController',
        ['$rootScope', '$scope', '$modal', '$state', '$timeout', 'basketObject', '_paymentMethod',
            function ($rootScope, $scope, $modal, $state, $timeout, basketObject, _paymentMethod) {
                $rootScope.nameStep = "Payment Methods";
                $rootScope.nextStep = null;
                $rootScope.previousStep = "frontend.checkout.step2";

                $rootScope.goPreviousStep = function () {
                    $state.transitionTo($rootScope.previousStep)
                }
                $rootScope.goNextStep = function () {
                    $state.transitionTo($rootScope.nextStep)
                }

                $scope._paymentMethod = _paymentMethod.data;


                $scope.paymentMethodSelected = {};
                if ($scope.basket.paymentMethod) {
                    $scope.paymentMethodSelected = $scope.basket.paymentMethod
                }
                $scope.selectMethodSelected = function (pay) {
                    $scope.paymentMethodSelected = pay;
                    addPaymentMethod()
                };
                function addPaymentMethod() {

                    $scope.basket.paymentMethod = $scope.paymentMethodSelected;
                    $rootScope.basket = $scope.basket;
                    setBasket($scope.basket);


                }

                function setBasket(basket) {
                    console.log(basket)
                    localStorage.setItem("basket", JSON.stringify(basket));
                }

            }]);