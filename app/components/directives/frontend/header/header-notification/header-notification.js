'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('APEDevices')
    .directive('headerNotificationFrontend', function () {
        return {
            templateUrl: 'components/directives/frontend/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope, MessageMessages, $rootScope, NotificationNotifications) {


                $scope.userNotification = {};
                $scope.userNotification.newestMessages = [];
                MessageMessages.getList(
                    {
                        expand: 'sender',
                        page: 1,
                        'sort': '-updatedAt',
                        'per-page': 3
                    }
                ).then(function (result) {
                        $scope.userNotification.newestMessages = result.data
                    });


                if ($rootScope.UserAccount.id) {
                    var page = 1;
                    var perPage = 400;

                    var FiltersInstantSearch = {
                        'sort': '-updatedAt',
                        expand: '',
                        'per-page': perPage,
                        page: page
                    };
                    FiltersInstantSearch = $.extend(FiltersInstantSearch,
                        {
                            'query[2][type]': "eq",
                            'query[2][field]': "receiver",
                            'query[2][value]': $rootScope.UserAccount.id
                        }
                    );


                    NotificationNotifications.getList(
                            FiltersInstantSearch
                        ).then(function (result) {
                            $rootScope.notificationsList = result.data;
                            console.log($rootScope.notificationsList)
                        });
                } else {
                    $rootScope.notificationsList = {data: []}
                }

                $scope.ameur = 'oumayma';
            }
        }
    });


