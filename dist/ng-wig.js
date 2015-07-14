/**
 * version: 1.1.10
 */
angular.module('ngWig', ['ngwig-app-templates']);

angular.module('ngWig')
    .directive('ngWig', function () {

    return {
      scope: {
        content: '=ngWig'
      },
      restrict: 'A',
      replace: true,
      templateUrl: 'ng-wig/views/ng-wig.html',
      link: function (scope, element, attrs) {

        scope.editMode = false;
        scope.autoexpand = !('autoexpand' in attrs) || attrs['autoexpand'] !== 'off';

        scope.toggleEditMode = function () {
          scope.editMode = !scope.editMode;
        };

        scope.execCommand = function (command, options) {
          if (command === 'createlink') {
            options = prompt('Please enter the URL', 'http://');
          }

          if (command === 'insertimage') {
            options = prompt('Please enter an image URL to insert', 'http://');
          }

          if (options !== null) {
            scope.$emit('execCommand', {command: command, options: options});
          }
        };

        scope.styles = [
          {name: 'Normal text', value: 'p'},
          {name: 'Header 1', value: 'h1'},
          {name: 'Header 2', value: 'h2'},
          {name: 'Header 3', value: 'h3'}
        ];

        scope.style = scope.styles[0];

        scope.$on("colorpicker-selected", function ($event, color) {
          scope.execCommand('foreColor', color.value);
        });
      }
    }
});


angular.module('ngWig')
  .directive('ngWigEditable', function () {
    function init(scope, $element, attrs, ctrl) {
      var document = $element[0].ownerDocument;

      $element.attr('contenteditable', true);

      //model --> view
      ctrl.$render = function () {
        $element.html(ctrl.$viewValue || '');
      };

      //view --> model
      function viewToModel() {

        ctrl.$setViewValue($element.html());

        //to support Angular 1.2.x
        if (angular.version.minor < 3) {
          scope.$apply();
        }

      }

      $element.bind('blur keyup change paste', viewToModel);

      scope.$on('execCommand', function (event, params) {
        $element[0].focus();

        var ieStyleTextSelection = document.selection,
          command = params.command,
          options = params.options;

        if (ieStyleTextSelection) {
          var textRange = ieStyleTextSelection.createRange();
        }

        document.execCommand(command, false, options);

        if (ieStyleTextSelection) {
          textRange.collapse(false);
          textRange.select();
        }

        viewToModel();
      });
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      replace: true,
      link: init
    }
  }
);

angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <ul class=\"nw-toolbar\">\n" +
    "    <li class=\"nw-toolbar__item\">\n" +
    "      <select class=\"nw-select\" ng-model=\"style\" ng-change=\"execCommand('formatblock', style.value)\" ng-options=\"style.name for style in styles\">\n" +
    "      </select>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--unordered-list\" title=\"Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--ordered-list\" title=\"Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button colorpicker ng-model=\"fontcolor\" class=\"nw-button nw-button--text-color\" title=\"Font Color\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--link\" title=\"link\" ng-click=\"execCommand('createlink')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--image\" title=\"image\" ng-click=\"execCommand('insertimage')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--source\" ng-class=\"{ 'nw-button--active': editMode }\" ng-click=\"toggleEditMode()\"></button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"nw-editor-container\">\n" +
    "    <div class=\"nw-editor\">\n" +
    "      <textarea class=\"nw-editor__src\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "      <div ng-class=\"{'nw-invisible': editMode, 'nw-autoexpand': autoexpand}\" class=\"nw-editor__res\" ng-model=\"content\" ng-wig-editable></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
