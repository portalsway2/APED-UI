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
        ['$scope', '$modal', '$state', '$timeout', '_announcement', 'growl', '$rootScope', 'NotificationNotifications',
            function ($scope, $modal, $state, $timeout, _announcement, growl, $rootScope, NotificationNotifications) {

                $scope.announcement = _announcement.data;

                $scope.visitNotification = {data: NotificationNotifications.one()};
                var visitorName = "anonymous";
                if ($rootScope.UserAccount.id) {
                    $scope.visitNotification.data.sender = $rootScope.UserAccount.id;
                    visitorName = $rootScope.UserAccount.firstName + " " + $rootScope.UserAccount.lastName;
                }

                $scope.visitNotification.data.receiver = $scope.announcement.ownerId;
                $scope.visitNotification.data.name = "visit";
                $scope.visitNotification.data.description = "  visited your ad  ";
                $scope.visitNotification.data.type = $scope.announcement.id;
                console.log($scope.visitNotification)
                $scope.visitNotification.data.save();

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


                        $scope.basketNotification = {data: NotificationNotifications.one()};
                        var visitorName = "anonymous";
                        if ($rootScope.UserAccount.id) {
                            $scope.basketNotification.data.sender = $rootScope.UserAccount.id;
                            visitorName = $rootScope.UserAccount.firstName + " " + $rootScope.UserAccount.lastName;
                        }

                        $scope.basketNotification.data.receiver = $scope.announcement.ownerId;
                        $scope.basketNotification.data.name = "basket";
                        $scope.basketNotification.data.description = "  add your ad to his basket  ";
                        $scope.basketNotification.data.type = $scope.announcement.id;
                        $scope.basketNotification.data.save();


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