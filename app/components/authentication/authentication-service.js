angular.module('authentication')
    .factory('AuthService', ['$http', 'Session', 'API_LOGIN_CONFIG', '$rootScope', '$cookieStore',
        function ($http, Session, API_LOGIN_CONFIG, $rootScope, $cookieStore) {
            var authService = {};
            var urlFile = API_LOGIN_CONFIG.urlLoginFile;
            authService.login = function (credentials) {
                return $.post(urlFile, {
                    client_id: "testclient",
                    client_secret: "testpass",
                    grant_type: "password",
                    username: credentials.username,
                    password: credentials.password


                },function (res) {
                    console.log(res)
                    if (res.status == 401) {
                        Session.destroy();
                    } else {

                        Session.create(
                            5,
                            5,
                            "admin",
                            res.access_token,
                            res.expires_in,
                            res.token_type,
                            res.scope,
                            res.refresh_token,
                            res.tenant_id,
                            res.domain_name
                        );
                        var userProfile = {
                            id: res.user.id,
                            email: res.user.email,
                            username: res.user.username,
                            firstName: res.user.firstName,
                            lastName: res.user.lastName,
                            active: res.user.active,
                            blocked: res.user.blocked,
                            status: res.user.status

                        };
                        $rootScope.UserAccount = userProfile;
                        $cookieStore.put('userProfile', userProfile);

                    }

                }).done(function (res) {

                    })
                    .fail(function (res) {
                        Session.destroy();

                    })
                    .always(function (res) {
                        $rootScope.isLoading = false;

                    });


            };

            authService.logout = function () {
                return $.post(urlFile, {username: null, password: null},function (res) {


                }).done(function (res) {

                    })
                    .fail(function (res) {


                    })
                    .always(function (res) {
                        Session.destroy();
                    });

            };
            authService.isAuthenticated = function () {

                if (!Session.validateUser()) {
                    Session.destroy();
                    $rootScope.currentUser = null;
                }
                return Session.validateUser();
            };

            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() &&
                    authorizedRoles.indexOf(Session.userRole) !== -1);
            };

            return authService;
        }])
;

(function (exports) {

    var config = {

        /* List all the roles you wish to use in the app
         * You have a max of 31 before the bit shift pushes the accompanying integer out of
         * the memory footprint for an integer
         */
        roles: [
            'public',
            'user',
            'admin'
        ],

        /*
         Build out all the access levels you want referencing the roles listed above
         You can use the "*" symbol to represent access to all roles
         */
        accessLevels: {
            'public': '*',
            'anon': ['public'],
            'user': ['user', 'admin'],
            'admin': ['admin']
        }

    };

    /*
     Method to build a distinct bit mask for each role
     It starts off with "1" and shifts the bit to the left for each element in the
     roles array parameter
     */
    function buildRoles(roles) {

        var bitMask = "01";
        var userRoles = {};

        for (var role in roles) {
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = {
                bitMask: intCode,
                title: roles[role]
            };
            bitMask = (intCode << 1).toString(2);
        }

        return userRoles;
    }

    /*
     This method builds access level bit masks based on the accessLevelDeclaration parameter which must
     contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles) {


        var accessLevels = {},
            resultBitMask,
            role;
        for (var level in accessLevelDeclarations) {

            if (typeof accessLevelDeclarations[level] === 'string') {
                if (accessLevelDeclarations[level] === '*') {

                    resultBitMask = '';

                    for (role in userRoles) {
                        resultBitMask += "1";
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMask, 2),
                        title: accessLevelDeclarations[level]
                    };
                }
                else {
                    console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'");
                }
            }
            else {

                resultBitMask = 0;
                for (role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                    }
                    else {
                        console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'");
                    }
                }
                accessLevels[level] = {
                    bitMask: resultBitMask,
                    title: accessLevelDeclarations[level][role]
                };
            }
        }

        return accessLevels;
    }


    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

})(typeof exports === 'undefined' ? this : exports);
