// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_elediastyles for Moodle.
 *
 * @module      tiny_elediastyles/injectcss
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['core/ajax', 'core/log'], function(Ajax, Log) {

    /**
     * Initialize the CSS injection
     *
     * @returns {void}
     */
    var init = function() {
        // Use Moodle's Ajax API to fetch the CSS.
        Ajax.call([{
            methodname: 'tiny_elediastyles_get_css',
            args: {
                contextid: 1  // System context 
            }
        }])[0]
            .then(function(data) {
                if (data && data.css) {
                    // Create and inject the style element.
                    var styleEl = document.createElement('style');
                    styleEl.textContent = data.css;
                    document.head.appendChild(styleEl);
                    Log.debug('TinyMCE elediaStyles CSS injected successfully');
                }
                return true;
            })
            .catch(function(error) {
                Log.error('Failed to load TinyMCE elediaStyles CSS:', error);
            });
    };

    return {
        init: init
    };
});