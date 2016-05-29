'use strict';
angular.module('frontend-module.advertisements')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('frontend.advertisements.edit', {
            url: '/edit/{id:[0-9]*}',
            templateUrl: 'frontend/advertisements/advertisements-edit/advertisements-edit.html',
            controller: 'AdvertisementsEditController',
            authenticate: true,
            role: "superUser",
            roleUser: 10,
            resolve: {
                _announcement: [
                    'ContentContents', '$stateParams',
                    function (ContentContents, $stateParams) {
                        if ($stateParams.id) {
                            return ContentContents.one($stateParams.id).get({expand: "device"});
                        } else {
                            var announcement = {data: ContentContents.one()};
                            announcement.data.device = {};
                            announcement.data.images = [];
                            return announcement;
                        }

                    }
                ],
                _devicesList: [
                    'DeviceDevices',
                    function (DeviceDevices) {
                        return  DeviceDevices.getList();
                    }
                ]
            }
        });
    }])
    .controller('AdvertisementsEditController',
        ['$scope', '$modal', '$state', '$timeout', '_announcement', '_devicesList',
            function ($scope, $modal, $state, $timeout, _announcement, _devicesList) {

                $scope.announcement = _announcement.data;
                $scope.devicesList = _devicesList.data;

                $scope.changeDeviceObject = function () {
                    var index = _.findIndex($scope.devicesList, {id: Number($scope.announcement.deviceId)  });

                    $scope.announcement.device = $scope.devicesList[index];

                };
                $scope.UploadFile = {

                    open: function () {
                        console.log($scope.announcement);

                        var actionConfiguration = $modal.open({
                            templateUrl: 'components/device-devices/add-images-modal/add-images-modal.html',
                            controller: 'AddImagesModalController'

                        });
                        actionConfiguration.result.then(function (result) {
                            for (var i = 0; i < result.length; i++) {
                                $scope.announcement.images.push(result[i]);
                            }

                        }, function () {

                        });
                    }
                };


                $scope.saveAnnouncement = function () {
                    $scope.announcement.ownerId = 1;
                    $scope.announcement.save().then(function () {

                        $state.go("frontend.advertisements.list");
                    }, function () {

                    });
                }

            }]);