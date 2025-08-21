/***************************************************************************************************
 * POLYFILLS FILE
 *
 * Purpose:
 * Ensure modern JavaScript and Angular features run on older browsers (e.g. IE11).
 *
 * Includes:
 * 1. web-animations-js   → Adds support for animations in old browsers.
 * 2. core-js/es/reflect  → Adds Reflect API (required for Angular decorators).
 * 3. core-js/es/...      → Provides modern JS methods (Array, Number, String, Object, etc.).
 * 4. @angular/localize   → Enables Angular localization ($localize).
 **************************************************************************************************/

// 1. Web Animations API polyfill
import 'web-animations-js';

// 2. Reflect API polyfill
import 'core-js/es/reflect';

// 3. ES features polyfills
import 'core-js/es/array';
import 'core-js/es/parse-int';
import 'core-js/es/parse-float';
import 'core-js/es/number';
import 'core-js/es/string';
import 'core-js/es/regexp';
import 'core-js/es/object';

// 4. Angular localization
import '@angular/localize/init';
