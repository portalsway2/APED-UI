angular.module('frontend-module', ["frontend-module.dashboard"])
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('frontend', {
            abstract: true,
            url: '/frontend',
            userNotAuthenticated: true,
            templateUrl: 'templates/frontend/main.html',
            resolve: {
                _notification: [
                    'NotificationNotifications', '$stateParams', '$state', '$rootScope',
                    function (NotificationNotifications, $stateParams, $state, $rootScope) {
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
                                    'query[2][type]': "like",
                                    'query[2][field]': "receiver",
                                    'query[2][value]': $rootScope.UserAccount.id
                                }
                            );


                            return NotificationNotifications.getList(
                                FiltersInstantSearch
                            );
                        } else {
                            return {data: []}
                        }


                    }
                ],

                loadMyDirectives: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(

                        {
                            name: 'APEDevices',
                            files: [
                                'components/directives/frontend/header/header.js',
                                'components/directives/frontend/header/header-notification/header-notification.js',
                                'components/directives/frontend/sidebar/sidebar.js',
                                'components/directives/frontend/sidebar/sidebar-search/sidebar-search.js',

                                'components/directives/timeline/timeline.js',
                                'components/directives/notifications/notifications.js',
                                'components/directives/chat/chat.js',
                                'components/directives/dashboard/stats/stats.js',
                                'components/directives/truncate/truncate-text-filter.js'
                            ]
                        })

                }
            }

        });
    }]);