# appengine-starter

Minimal boilerplate for a Python static file server running on AppEngine.
Includes jQuery and AngularJS.

## Get started
1. Copy the contents of this repo into an empty repo
2. Run the AppEngine local server
3. Start developing

## How it works
* Everything in the `ui` folder is servable. For example, if someone requests
  `/foo/bar.html`, the server will return `/ui/foo/bar.html`. (If you have files
  that shouldn't be sent to a browser, don't put them in the `ui` folder.)
* When someone goes to the root of your app (`http://whatever.appspot.com/`),
  then the server will return `/ui/index.html`.
* When someone navigates to a folder, the app will serve `index.html` from that
  folder. For example, if someone requests `/foo/`, the app will serve
  `/ui/foo/index.html`.

