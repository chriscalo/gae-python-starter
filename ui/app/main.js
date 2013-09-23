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
   * Loads /content/content.yaml into scope. Reference this controller on the
   * <html> element:
   *   
   *   <html ng-app="app" ng-controller="ContentController">
   *   
   */
  app.controller("ContentController", function ($http, $scope) {
    $http.get("/content/content.yaml").then(function success(response) {
      $scope.content = jsyaml.load(response.data);
      document.body.classList.remove("loading");
    }, function failure(response) {
      $(document.body).html("Couldn't load content. <a href='javascript:location.reload(true)'>Try again</a>?");
      $(document.body).css({
        "margin": "72px auto",
        "width": "500px",
        "text-align": "center",
      });
      document.body.classList.remove("loading");
    });
  });
  
  /**
   * Angular directive for converting Markdown into HTML. Usage:
   *   
   *   <div markdown="some.scope.variable">Loading…</div>
   *   
   * Looks for link definitions in the "links" section of your YAML file.
   */
  app.directive("markdown", function () {
    // Adds Markdown-style link definitions to the end of a string.
    function appendMarkdownLinkDefs(str, scope) {
      var links = [];
      try {
        $.each(scope.content.links, function (name, href) {
          var line = "[{name}]: {href}"
            .replace("{name}", name)
            .replace("{href}", href);
          links.push(line);
        });
      } catch (error) {
        // pass
      }
      return "{content}\n\n{links}"
        .replace("{content}", str)
        .replace("{links}", links.join("\n"))
        .replace(/\n/g, "\n\n"); // YAML collapses new lines too much
    }
    
    return {
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.markdown, function (content) {
          var str = appendMarkdownLinkDefs(content, scope);
          elem.html(markdown.toHTML(str));
          elem.find("a").each(function (i, link) {
            $(link).attr("target", "_blank");
          });
        });
      },
    };
  });
})();
