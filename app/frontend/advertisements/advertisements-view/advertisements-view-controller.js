'use strict';
angular.module('frontend-module.advertisements')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.advertisements.view', {
            url: '/view/{id:[0-9]*}',
            templateUrl: 'frontend/advertisements/advertisements-view/advertisements-view.html',
            controller: 'AdvertisementsViewController',
            authenticate: true,
            userNotAuthenticated: true,
            resolve: {
                _announcement: [
                    'ContentContents', '$stateParams', '$state',
                    function (ContentContents, $stateParams, $state) {
                        if ($stateParams.id) {
                            return ContentContents.one($stateParams.id).get({expand: 'device,owner'});
                        } else {
                            $state._stop();
                            return false;
                        }

                    }
                ]
            }
        });
    }])
    .controller('AdvertisementsViewController',
        ['$scope', '$modal', '$state', '$timeout', '_announcement', 'growl', '$rootScope',
            function ($scope, $modal, $state, $timeout, _announcement, growl, $rootScope) {

                $scope.announcement = _announcement.data;


                $scope.addToBasket = function () {


                    var basket = getBasket();

                    growl.addWarnMessage("This adds a warn message", {title: 'Warning!'});
                    var productFound = false;
                    for (var i = 0; i < basket.listItems.length; i++) {
                        if (basket.listItems[i].id == $scope.announcement.id) {
                            productFound = true;

                        }

                    }

                    if (!productFound) {
                        basket.listItems.push($scope.announcement);
                        basket.numberItems += 1;
                        basket.totalPrice += parseFloat($scope.announcement.price);

                        setBasket(basket);
                        $rootScope.basket = basket;


                    } else {

                    }


                    console.log(basket)
                };


                function removeBasket() {
                    localStorage.removeItem("basket")
                }

                function getBasket() {
                    if (localStorage.getItem("basket")) {
                        return JSON.parse(localStorage.getItem("basket"));
                    } else {
                        return {
                            numberItems: 0,
                            totalPrice: 0,
                            listItems: []
                        }
                    }

                };

                function setBasket(basket) {
                    localStorage.setItem("basket", JSON.stringify(basket));
                    $rootScope.basket = basket;
                };
            }]);