(function() {
    'use strict';

    angular
        .module('app')
        .service('ConstantsService', constantsService);

    constantsService.$inject = [];

    function constantsService() {
        var service = this;
        //enums
        service.Empty = 0;
        service.Black = 1;
        service.White = 2;
        service.N = 8;
        service.MaxDepth = 8;
    }
})();