angular.module('backend-module', ['backend-module.dashboard2'])
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state('backend', {
            abstract: true,
            url: '/backend',
            roleUser: 3,
            templateUrl: 'templates/backend/main.html',
            resolve: {
                loadMyDirectives: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        {
                            name: 'APEDevices',
                            files: [
                                'components/directives/backend/header/header.js',
                                'components/directives/backend/header/header-notification/header-notification.js',
                                'components/directives/backend/sidebar/sidebar.js',
                                'components/directives/backend/sidebar/sidebar-search/sidebar-search.js',

                                'components/directives/timeline/timeline.js',
                                'components/directives/notifications/notifications.js',
                                'components/directives/chat/chat.js',
                                'components/directives/dashboard/stats/stats.js'
                            ]
                        }
                    )

                }
            }

        });
    }]);
