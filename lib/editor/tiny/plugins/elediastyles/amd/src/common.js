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
 * Tiny tiny_elediastyles common constants.
 *
 * @module      tiny_elediastyles/common
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define([], function() {
    var component = 'tiny_elediastyles';

    return {
        component: component,
        pluginName: component + '/plugin',
        icon: 'color-levels',
        pluginButtonName: component + '_tiny_htmlblock_btn',
        pluginMenuItem: component + '_tiny_htmlblock_menu',
        pluginClearButtonName: component + '_tiny_htmlblock_clear_btn'
    };
});