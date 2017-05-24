(function() {
    'use strict';

    angular
        .module('app')
        .directive('navBar', navBar);

    function navBar() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'Static/JS/Directives/NavBar/nav-bar.html',
            scope: {
                max: '='
            },
            controller: NavBarController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    NavBarController.$inject = ['$scope'];

    function NavBarController($scope) {
        // Injecting $scope just for comparison
        var vm = this;

    }

})();