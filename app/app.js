var APEDevices = angular.module('APEDevices', [
            'ngSanitize'
            , 'APEDevices'
            , 'ngResource'
            , 'restangular'
            , 'oc.lazyLoad'
            , 'ui.router'
            , 'ui.select2'
            , 'ui.bootstrap'
            , 'angular-loading-bar'
            , 'angular-growl'
            , 'ui.slimscroll'
            , 'angularFileUpload'
            , 'ngCookies'


            //components
            , 'controller-factory'
            , 'device-devices'
            , 'product-products'
            , 'brand-brands'
            , 'category-categories'
            , 'content-contents'
            , 'extra-fields'
            , 'message-messages'
            , 'file-files'
            , 'user-users'
            , 'user-profile'
            , 'marketing-vault'


            //modules backend
            , 'backend-module'
            , 'backend-module.dashboard2'
            , 'backend-module.device'
            , 'backend-module.product'
            , 'backend-module.brand'
            , 'backend-module.category'
            , 'backend-module.shipping'
            , 'backend-module.payment'
//    ,'backend-module.country'
            , 'backend-module.user'

            //modules frontend
            , 'frontend-module'
            , 'frontend-module.dashboard'
            , 'frontend-module.home'
            , 'frontend-module.advertisements'
            , 'frontend-module.brands'
            , 'frontend-module.products'
            , 'frontend-module.devices'
            , 'frontend-module.user'
            , 'frontend-module.user.message'
            , 'frontend-module.user.profile'
            , 'frontend-module.compare'
            , 'frontend-module.checkout'
            , 'paymentmethod-paymentmethods'
            , 'payment-payments'
            , 'shipping-shippings'
            , 'loginuser'
            , 'authentication'
            , 'settings-settings'
            , 'customer-password'


        ])
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        })
        .constant('authorizationHeader', {
            enabled: false
        })

        .config([
            '$urlRouterProvider',
            function ($urlRouteProvider) {
                $urlRouteProvider.otherwise('/');
            }])
        .config([
            'growlProvider', function (growlProvider) {

                growlProvider.globalTimeToLive({success: 5000, error: 10000, warning: 6000, info: 5000});
            }
        ])
        .config([
            'RestangularProvider', 'API_CONFIG',
            function (RestangularProvider, API_CONFIG) {

                RestangularProvider
                    .setBaseUrl(API_CONFIG.baseUrl)
                    .setDefaultRequestParams({accessToken: API_CONFIG.accessToken})
                    .setFullResponse(true);
            }
        ])
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: false
            });

//        $urlRouterProvider.otherwise('/backend');


        }])
        .run(['$rootScope', 'SITE_CONFIG', '$http', 'Restangular', 'authorizationHeader', '$state', '$stateParams',
            '$cookieStore', 'Session', 'API_CONFIG', 'API_LOGIN_CONFIG', '$window',
            function ($rootScope, SITE_CONFIG, $http, Restangular, authorizationHeader, $state, $stateParams, $cookieStore, Session, API_CONFIG, API_LOGIN_CONFIG, $window) {

                $rootScope._ = window._;
                SITE_CONFIG.siteUrl = window.location.origin + "/";
                Restangular
                    .setErrorInterceptor(function (response, error) {

                        if (response.status === 500) {


                        }
                        if (response.status === 401) {
                            $rootScope.isLoading = true;
                            Restangular.requestParams.common.accessToken = null;
                            $rootScope.destroyCurrentUser();
                            Session.destroy();
                            $state.transitionTo(API_LOGIN_CONFIG.loginState);
                            event.preventDefault();
                        }

                    });
                if (localStorage.getItem("basket")) {
                    $rootScope.basket = JSON.parse(localStorage.getItem("basket"));
                } else {
                    $rootScope.basket = {
                        numberItems: 0,
                        totalPrice: 0,
                        listItems: []
                    }
                }
                $rootScope.basketTruncate = function () {
                    $rootScope.basket = localStorage.removeItem("basket");
                }
                console.log($rootScope.basket)
                if ($cookieStore.get('_session')) {
                    $rootScope.setCurrentUser($cookieStore.get('_session'));
                    $rootScope.UserAccount = $cookieStore.get('userProfile');
                    if (authorizationHeader.enabled) {
                        Restangular.setDefaultRequestParams({tenantId: $cookieStore.get('_session').tenantId});
                        Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + $cookieStore.get('_session').accessToken });
                    } else {
                        Restangular.setDefaultRequestParams({accessToken: $cookieStore.get('_session').accessToken, tenantId: $cookieStore.get('_session').tenantId});
                        API_CONFIG.accessToken = $cookieStore.get('_session').accessToken;
                        API_CONFIG.tenantId = $cookieStore.get('_session').tenantId;
                    }
                    ;
                    Restangular.requestParams.common.tenantId = $cookieStore.get('_session').tenantId;

                } else {
                    Restangular.setDefaultRequestParams({accessToken: "", tenantId: ""});
                }
            }])


    ;

    
