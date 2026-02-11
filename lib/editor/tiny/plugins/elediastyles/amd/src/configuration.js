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
 * Tiny tiny_elediastyles configuration.
 *
 * @module      tiny_elediastyles/configuration
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['tiny_elediastyles/common', 'editor_tiny/utils'], function(Common, Utils) {

    /**
     * Get the toolbar configuration.
     *
     * @param {object} instanceConfig The instance configuration.
     * @returns {object} The toolbar configuration.
     */
    var getToolbarConfiguration = function(instanceConfig) {
        var toolbar = instanceConfig.toolbar;
        toolbar = Utils.addToolbarButtons(toolbar, 'content', [
            Common.pluginButtonName,
            Common.pluginClearButtonName,
        ]);
        return toolbar;
    };

    /**
     * Get the menu configuration.
     *
     * @param {object} instanceConfig The instance configuration.
     * @returns {object} The menu configuration.
     */
    var getMenuConfiguration = function(instanceConfig) {
        var menu = instanceConfig.menu;
        menu = Utils.addMenubarItem(menu, 'file', [
            Common.pluginMenuItem,
        ].join(' '));
        return menu;
    };

    /**
     * Configure the editor instance.
     *
     * @param {object} instanceConfig The instance configuration.
     * @returns {object} The updated configuration.
     */
    var configure = function(instanceConfig) {
        return {
            toolbar: getToolbarConfiguration(instanceConfig),
            menu: getMenuConfiguration(instanceConfig),
        };
    };

    return {
        configure: configure
    };
});