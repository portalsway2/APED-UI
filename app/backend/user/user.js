angular.module('backend-module.user', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('backend.user', {
            url: '/userlist',
            templateUrl: 'backend/user/user-module.html'


        })
    }
    ]);
