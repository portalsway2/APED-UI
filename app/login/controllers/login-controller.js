angular.module('loginuser')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login.user', {
                userNotAuthenticated: true,
                userAuthenticated: false,
                url: '',
                templateUrl: 'login/templates/login-view.html',
                controller: 'LoginController',
                resolve: {
                    _customer: [
                        'CustomerCustomers', '$stateParams',
                        function (CustomerCustomers, $stateParams) {

                            return  {data: CustomerCustomers.one()};

                        }
                    ]
                }
            })
        ;
    }])

    .controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', '$state', '$http', 'CustomerPassword', 'growl',
        '$location', 'API_LOGIN_CONFIG', '_customer',
        function ($scope, $rootScope, AUTH_EVENTS, AuthService, $state, $http, CustomerPassword, growl, $location, API_LOGIN_CONFIG, _customer) {

            $scope.newUser = _customer.data;
            $scope.loginPage = "login";
            $scope.goToInscription = function () {

                $scope.loginPage = 'inscription';
            }
            $scope.goToLogin = function () {

                $scope.loginPage = 'login';
            }
            $scope.saveNewCustomerInServer = function () {
                $rootScope.inscriptionSuccess = null;
                $rootScope.inscriptionFailed = null;
                $scope.newUser.post("signup").then(
                    function (res) {

                        $rootScope.inscriptionSuccess = "your account is created successfully " + $scope.newUser.email;
                    },
                    function (res) {
                        $rootScope.inscriptionFailed = res.data.message;
                        console.log(res)
                    }
                )
            };
            $rootScope.loginFailed = null;
            $rootScope.sendResetPasswordFailed = null;
            $rootScope.sendResetPasswordSuccess = null;
            $scope.restPassword = false;
            $scope.resetPasswordFormSubmitted = false;
            $scope.credentials = {
                username: '',
                password: ''
            };

            if ($rootScope.UserAccount) {
                if ($rootScope.UserAccount.email) {
                    $state.transitionTo(API_LOGIN_CONFIG.dashboardState);
                }
            }

            $scope._url = location.hostname.split('.');
            $scope.tenantID = $scope._url.shift();

            $scope.changeForm = function () {

                $rootScope.loginFailed = null;
                $scope.restPassword = !$scope.restPassword;

            };
            $scope.resetPasswordRequest = function (email) {
                $rootScope.isLoading = true;
                $scope.resetPasswordFormSubmitted = true;

                $http({method: 'GET', url: CustomerPassword.one().getRestangularUrl()
                    + "?" + "&email=" + email + "&tenantId=" + $scope.tenantID,

                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                })
                    .success(function (res, status, headers, config) {

                        $rootScope.sendResetPasswordFailed = null;
                        growl.addSuccessMessage('Check your email, you will receive an email with a link to reset your password.', {ttl: 10000});
//                        $rootScope.sendResetPasswordSuccess = "Check your email, you will receive an email with a link to reset your password. ";
                        $scope.restPassword = false;
                        $rootScope.isLoading = false;

                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.sendResetPasswordSuccess = null;
//                        $rootScope.sendResetPasswordFailed = data.message;
                        growl.addErrorMessage(data.message, {ttl: 10000});

                        $rootScope.isLoading = false;

                    });


            }

        }]);
