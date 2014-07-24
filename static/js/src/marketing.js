var app = angular.module('app', ['ngCookies', 'ui.scrollfix']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }).run(function($http, $cookies){
        $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.headers.put['X-CSRFToken'] = $cookies['csrftoken'];
    });

app.controller('Controller', function($scope, $http, $location, $anchorScroll, focus) {

    $scope.showSurvey = true;

    mixpanel.register({'date': new Date().toDateString()}, 100);
    mixpanel.track('View Landing Page');

    $scope.nopeOptions = [
        "I'm not really into poetry",
        "I already use something else",
        "This doesn't seem useful",
        "It seems useful, but I wouldn't use it",
        // "You suck, your children suck, and DraftPress sucks"
    ];


    $scope.selection = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(option) {
        var idx = $scope.selection.indexOf(option);

        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
          $scope.selection.push(option);
        }
    }

    $scope.noThanks = _.once(function(){
        mixpanel.track('Not Interested');
    });

    $scope.yesPlease = _.once(function(){
        focus('focusMe');
        mixpanel.track('Yes Please!');
    });

    $scope.sendNopeReasons = function(){
        _.each($scope.selection, function(reason){
            mixpanel.track('reason: ' + reason);
        });

        $scope.showSurvey = false;
        $scope.nopeMode = false;
        $location.hash('top')
        $anchorScroll();
    }

    $scope.user = {name: 'guest', email: 'test@test.com'}

    $scope.signup = function(){

        mixpanel.identify()
        console.log($scope.email);
        mixpanel.people.set({$email: $scope.email });

        $scope.showSurvey = false;
        $scope.yepMode = false;
        $location.hash('top')
        $anchorScroll();
    }

});

app.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.focusOn) {
          elem[0].focus();
        }
      });
   };
});

app.factory('focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
});