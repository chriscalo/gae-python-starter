/**
 * Main entry point.
 * @author chris.calo@gmail.com (Chris Calo)
 */

(function () {
  /**
   * This is the name of the main module on the page. You'll want to put this
   * module name in an ng-app attribute on the <html> element.
   *   
   *   <html ng-app="appname">
   *   
   */
  var app = angular.module("appname", []);
  
  /**
   * Directive for loading JSON data into a scope variable. Example:
   * 
   *   <data name="mydata" src="/foo/bar.yaml" type="yaml"></data>
   *   
   * TODO: what if a name has spaces in it?
   * TODO: smarter ways of determining type.
   * TODO: What if response is already a parsed object?
   */
  app.directive("data", function ($http) {
    return {
      restrict: "E",
      link: function ($scope, $elem, attrs) {
        var name = attrs.name;
        var src = attrs.src;
        var type = attrs.type;
        
        var parsers = {
          "yaml": jsyaml.load.bind(jsyaml),
        };
        
        // must have name, type, and src attributes
        if (name && src && parsers.hasOwnProperty(type)) {
          $http.get(src).then(function success(response) {
            var parse = parsers[type];
            // split names like name="foo.bar.baz"
            var names = name.split(".");
            var finalName = names.pop();
            var currentNode = $scope;
            
            // build structure when name="foo.bar.baz"
            while (names.length > 0) {
              var currentName = names.shift();
              if (currentNode[currentName] === undefined) {
                currentNode = currentNode[currentName] = {};
              } else {
                currentNode = currentNode[currentName];
              }
            }
            
            // set data on final name
            currentNode[finalName] = parse(response.data);
          }, function failure(response, status) {
            var msg = "Failed to load data. {status}: {response}"
              .replace("{status}", status)
              .replace("{response}", response);
            console.error(msg);
          });
        } else {
          console.error('<data> elements must have name, src, and type="yaml" attributes.');
        }
      },
    };
  });
  
  /**
   * Angular directive for converting Markdown into HTML. Usage:
   *   
   *   <div markdown="some.scope.variable">Loading…</div>
   *   
   */
  app.directive("markdown", function factory() {
    return function link(scope, elem, attrs) {
      scope.$watch(attrs.markdown, function (content) {
        if (!content) return;
        content = content.replace(/\n/g, "\n\n");
        elem.html(markdown.toHTML(content));
        elem.find("a").each(function (i, link) {
          $(link).attr("target", "_blank");
        });
      });
    };
  });
})();
