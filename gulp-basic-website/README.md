# Gulp Basic Website Template

Build a static page using [Gulp][gulp], and [SCSS][scss].

## Features

- Install the project in just three commands (see "Developing" below).
- Use [SCSS][scss] to keep our CSS organized into logical components.
- Use [Autoprefixer][autoprefixer] to automatically insert browser prefixes where necessary to handle cross browser compatibility.
- Use [Browsersync][browsersync] to automatically launch a development version of our website, reload the page whenever we change the HTML, and inject changes to CSS, JavaScript, and images with needing to reload.
- Use [HTML Minifier][htmlmin], [CSSNano][cssnano], [UglifyJS][uglifyjs], and [ImageMin][imagemin] to compress and optimize our HTML, CSS, JavaScript, and images, respectively.
- Use [SCSS-Lint][scss-lint], [JSHint][jshint], and [JSCS][jscs] to perform [linting][linting] and style checking on our SCSS and JavaScript files.


## Setup
```bash
npm install -g gulp     # May require `sudo`
npm install             # One time
gem install scss_lint   # One time
gulp serve
```

## Gulp Commands

An overview of Gulp commands available:

### `gulp build`

Builds the site into the `dist` directory.  This includes:

- SCSS w/ linting, sourcemaps and autoprefixing
- JS linting and uglification

### `gulp build:optimized`

This is used for distributing an optimized version of the site (for deployment).  It includes everything from `gulp build` as well as:
- SCSS minification
- CSS / JS inline-sourcing 

### `gulp watch`

Watchs for changes in local files and rebuilds parts of the site as necessary, into the `dist` directory.

### `gulp serve`

Runs `gulp watch` in the background, and serves the `dist` directory at `localhost:3000` with automatic reloading using [Browsersync][browsersync].

## To Update Dev Dependencies

```script
$ npm install npm-check-updates -g
$ npm-check-updates
$ npm-check-updates -u  # Updates all the dependecies
```
After you determine that there are updates remove node_modules and reinstall
```script
$ rm -fr node_modules
$ npm install
```

[autoprefixer]: https://css-tricks.com/autoprefixer/
[browsersync]: http://www.browsersync.io/
[cssnano]: http://cssnano.co/
[gulp]: http://gulpjs.com/
[htmlmin]: https://github.com/kangax/html-minifier
[imagemin]: https://github.com/imagemin/imagemin
[jscs]: http://jscs.info/
[jshint]: http://jshint.com/
[linting]: https://en.wikipedia.org/wiki/Lint_%28software%29
[npm-install]: https://nodejs.org/en/download/
[uglifyjs]: https://github.com/mishoo/UglifyJS
[scss]: http://sass-lang.com/
[scss-lint]: https://github.com/brigade/scss-lint
