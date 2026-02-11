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
 * Copy CSS to clipboard functionality.
 *
 * @module      tiny_elediastyles/copycss
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['core/notification', 'core/str'], function(Notification, Str) {

    /**
     * Initialize the copy button
     *
     * @returns {void}
     */
    var init = function() {
        var copyButton = document.getElementById('copy-css-button');
        var cssElement = document.getElementById('compiled-css');

        if (!copyButton || !cssElement) {
            return;
        }

        copyButton.addEventListener('click', function() {
            var cssText = cssElement.textContent;

            // Use modern Clipboard API if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(cssText)
                    .then(function() {
                        return Str.get_string('copied_to_clipboard', 'tiny_elediastyles');
                    })
                    .then(function(message) {
                        Notification.addNotification({
                            message: message,
                            type: 'success'
                        });
                        return true;
                    })
                    .catch(function(error) {
                        Notification.exception(error);
                    });
            } else {
                // Fallback for older browsers
                try {
                    var range = document.createRange();
                    range.selectNode(cssElement);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();

                    Str.get_string('copied_to_clipboard', 'tiny_elediastyles')
                        .then(function(message) {
                            Notification.addNotification({
                                message: message,
                                type: 'success'
                            });
                            return true;
                        })
                        .catch(function(error) {
                            Notification.exception(error);
                        });
                } catch (error) {
                    Notification.exception(error);
                }
            }
        });
    };

    return {
        init: init
    };
});