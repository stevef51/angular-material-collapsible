(function () {
    'use strict';

    angular
        .module('ngMaterialCollapsible')
        .directive('mdCollapsible', MdCollapsible)
        .directive('mdCollapsibleItem', MdCollapsibleItem)
        .directive('mdCollapsibleHeader', MdCollapsibleHeader)
        .directive('mdCollapsibleBody', MdCollapsibleBody);

    MdCollapsibleItem.$inject = ['$document'];

    const CLASS_ACTIVE = 'active';

    function removeClassActive(collapsible) {
        angular.forEach(collapsible[0].children, function (item) {
            item = angular.element(item);
            if (item.hasClass(CLASS_ACTIVE)) {
                item.removeClass(CLASS_ACTIVE);
            }
        });
    }

    function MdCollapsible() {
        return {
            restrict: 'E',
            link: function (scope, element) {
                element.attr('layout', 'column');
                element.addClass('layout-column');
            }
        };
    }

    function MdCollapsibleItem($document) {
        return {
            restrict: 'E',
            scope: {
                isOpen: '=?mdOpen',
                closeOnClick: '@'
            },
            link: function (scope, element) {
                if (scope.isOpen) {
                    element.addClass(CLASS_ACTIVE);
                }
                if (scope.closeOnClick) {
                    var events = ['click', 'touchend'];
                    events.forEach(function (ev) {
                        $document[0].body.addEventListener(ev, close);
                    });

                    scope.$on('$destroy', function () {
                        events.forEach(function (ev) {
                            $document[0].body.removeEventListener(ev, close);
                        });
                    });
                }

                function close(ev) {
                    if (!element.hasClass(CLASS_ACTIVE)) {
                        return;
                    }

                    const clickInHeader = element[0].children[0].contains(ev.target);
                    const clickInBody = element[0].children[1].contains(ev.target);

                    var close = false;
                    switch (scope.closeOnClick) {
                        case 'outside':
                            close = !clickInHeader && !clickInBody;
                            break;
                        case 'true':
                            if (ev.type === 'click') {
                                close = !clickInHeader;
                            } else {
                                close = !clickInHeader && !clickInBody;
                            }
                            break;
                    }
                    if (close) {
                        element.removeClass(CLASS_ACTIVE);
                    }
                }
            }
        };
    }

    function MdCollapsibleBody() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div layout="column" ng-transclude></div>',
        };
    }

    function MdCollapsibleHeader() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div layout="row" class="md-collapsible-tools" ng-transclude></div>',
            link: function (scope, element) {

                element.on('click', onClick);

                function onClick(event) {
                    if (verifyClick(event)) {

                        var parentElement = angular.element(element[0].parentElement);

                        if (parentElement.hasClass(CLASS_ACTIVE)) {
                            parentElement.removeClass(CLASS_ACTIVE);
                            return;
                        }

                        var collapsible = angular.element(parentElement[0].parentElement);
                        if (!collapsible.hasClass('multiple-open')) {
                            removeClassActive(collapsible);
                        }
                        parentElement.addClass(CLASS_ACTIVE);

                        if (parentElement.hasClass('scroll-into-view')) {
                            element[0].scrollIntoView(true);
                        }
                    }
                }

                function verifyClick(event) {
                    var arrayNotEvent = ['md-icon', 'md-button', 'button', 'a', 'md-checkbox'];
                    return arrayNotEvent.indexOf(event.target.localName) < 0 && !event.target.hasAttribute('md-ink-ripple-checkbox');
                }

            }
        };
    }

})();
