angular.module('frontend-module.checkout', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.checkout', {
            url: '/checkout',
            templateUrl: 'frontend/checkout/checkout.html',
            userNotAuthenticated: false,
            controller: 'CheckoutViewController',
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

                }],
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
                ]
            }


        });
    }])
    .controller('CheckoutViewController',
        ['$rootScope', '$scope', '$modal', '$state', '$timeout', 'basketObject', '_shipping',
            function ($rootScope, $scope, $modal, $state, $timeout, basketObject, _shipping) {
                $scope.basket = basketObject;
                $rootScope.confirmationStep = function () {

                    if ($scope.basket) {
                        var test1 = (
                            $scope.basket.paymentMethod
                                && $scope.basket.shippingMethod
                                && ($scope.basket.totalPrice)
                                && ($scope.basket.numberItems)
                                && ($scope.basket.numberItems)
                                && ($scope.basket.listItems)

                            );
                        if (test1) {
                            return $scope.basket.paymentMethod.id
                                && $scope.basket.shippingMethod.id
                                && ($scope.basket.totalPrice > 0)
                                && ($scope.basket.numberItems > 0)
                                && ($scope.basket.numberItems > 0)
                                && ($scope.basket.listItems.length > 0)
                                && ($scope.basket.listItems.length > 0);


                        } else {
                            return false
                        }
                    } else {
                        return false
                    }

                };

            }])
