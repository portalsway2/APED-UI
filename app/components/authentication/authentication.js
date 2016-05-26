angular.module('authentication', [])
    .run(['$rootScope', 'SettingsService', 'authorizationHeader', '$state', '$stateParams', 'AuthService', 'USER_ROLES', 'API_LOGIN_CONFIG', 'API_CONFIG', 'AUTH_EVENTS', 'Restangular', 'Session', '$window', 'growl', 'UserProfile', '$cookieStore', 'SettingsSettings',
        function ($rootScope, SettingsService, authorizationHeader, $state, $stateParams, AuthService, USER_ROLES, API_LOGIN_CONFIG, API_CONFIG, AUTH_EVENTS, Restangular, Session, $window, growl, UserProfile, $cookieStore, SettingsSettings) {
            $rootScope.UserRolesList = [
                {
                    id: 1,
                    nameRole: "User"
                },
                {
                    id: 2,
                    nameRole: "SuperUser"
                },
                {
                    id: 3,
                    nameRole: "Client"
                },
                {
                    id: 4,
                    nameRole: "Visitor"
                }

            ]
            $rootScope.logout = function () {

                $rootScope.userLoged = false;
                $rootScope.UserAccount = null;


                $rootScope.destroyCurrentUser();
                Session.destroy();
                Restangular.requestParams.common.accessToken = null;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                $rootScope.destroyCurrentUser();

                $state.transitionTo(API_LOGIN_CONFIG.loginState);


            };
            $rootScope.login = function (credentials) {
                $rootScope.loginFailed = null;
                $rootScope.loadingMessage = "Login..";
                $rootScope.userLoged = true;
                $rootScope.loginFormSubmitted = true;
                AuthService.login(credentials).then(function (res) {

                    $rootScope.loadingMessage = "Loading..";
                    if (Session.validateUser()) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $rootScope.setCurrentUser(Session);
                        if (authorizationHeader.enabled) {
                            Restangular.setDefaultRequestParams({tenantId: $cookieStore.get('_session').tenantId});
                            Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + $cookieStore.get('_session').accessToken });
                        } else {
                            Restangular.setDefaultRequestParams({accessToken: $cookieStore.get('_session').accessToken, tenantId: $cookieStore.get('_session').tenantId});
                            API_CONFIG.accessToken = $cookieStore.get('_session').accessToken;
                            API_CONFIG.tenantId = $cookieStore.get('_session').tenantId;
                        }
                        API_CONFIG.tenantId = $cookieStore.get('_session').tenantId;
                        Restangular.requestParams.common.tenantId = Session.tenantId;


                        $rootScope.loadingMessage = false;
                        var aHref = API_LOGIN_CONFIG.dashboardState;
                        var hrefParams = {};
                        if ($rootScope.historicUrl) {

                            aHref = $rootScope.historicUrl;
                            hrefParams = $rootScope.historicUrlParams;
                            $rootScope.historicUrl = null;
                            $rootScope.historicUrlParams = null;
                        }
                        $state.transitionTo(aHref, hrefParams);


                    } else {
                        $rootScope.loginFailed = res.message;
                        $rootScope.loadingMessage = false;
                        $rootScope.isLoading = false;
                        $state.transitionTo(API_LOGIN_CONFIG.loginState);

                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    }


                }, function (res) {


                    $rootScope.loginFailed = "Authentication failed";
                    $state.transitionTo(API_LOGIN_CONFIG.loginState);

                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            };
            $rootScope.currentUser = angular.fromJson(localStorage.getItem('user'));
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthService.isAuthorized;

            $rootScope.setCurrentUser = function (user) {

                $rootScope.currentUser = user;
            };
            $rootScope.destroyCurrentUser = function () {

                $rootScope.currentUser = null;
            };
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on("$stateNotFound", function (event, to, toState, FromParams, fromState, fromParams) {
                console.info("not found ");
            });
            $rootScope.$on('$viewContentLoading',
                function (event, viewConfig) {

                });
            $rootScope.$on("$stateChangeStart", function (event, to, toState, FromParams, fromState, fromParams) {

                $rootScope.isLoading = true;

                if (!to.userNotAuthenticated) {


                    if (!AuthService.isAuthenticated()) {


                        if (FromParams.name != API_LOGIN_CONFIG.loginState) {

                            $rootScope.historicUrl = to.name;
                            $rootScope.historicUrlParams = toState;
                            $state.transitionTo(API_LOGIN_CONFIG.loginState);
                            event.preventDefault();

                        } else {

                            $state.reload();
                            event.preventDefault();

                        }


                    } else {
                        if (authorizationHeader.enabled) {
                            Restangular.setDefaultRequestParams({tenantId: $cookieStore.get('_session').tenantId});
                            Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + $cookieStore.get('_session').accessToken });
                        } else {
                            Restangular.setDefaultRequestParams({accessToken: $cookieStore.get('_session').accessToken, tenantId: $cookieStore.get('_session').tenantId});
                            API_CONFIG.accessToken = $cookieStore.get('_session').accessToken;
                            API_CONFIG.tenantId = $cookieStore.get('_session').tenantId;
                        }

                        if (to.name == API_LOGIN_CONFIG.loginState) {
                            $state.transitionTo(API_LOGIN_CONFIG.dashboardState);
                            $rootScope.isLoading = false;
                            event.preventDefault();
                        }


                    }
                } //to.userNotAuthenticated=true
                else {
                    console.log(22666148)

                }
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {


                if (error.status == 401) {
                    $rootScope.historicUrl = toState.name;
                } else {

                }


            });


        }]);
