<?php
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
 * Plugin strings are defined here.
 *
 * @package     tiny_elediastyles
 * @category    string
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['button_showStyles'] = 'Show Styles';
$string['button_clearStyles'] = 'Clear style';
$string['menuitem_startstyles'] = 'Show CSS header';
$string['pluginname'] = 'eleDia Styles';
$string['helplinktext'] = 'eleDia Styles';
$string['privacy:metadata'] = 'eleDia Styles does not store any personal data.';
$string['pluginname_desc'] = 'Add custom CSS styles to the TinyMCE editor.';

// Settings.
$string['settings'] = 'eLeDia Styles editor settings';
$string['settings_desc'] = 'Configure the eLeDia Styles plugin for TinyMCE';
$string['styleslist'] = 'Style definitions (JSON)';
$string['styleslist_desc'] = 'JSON with "styles" (list of label/class/type) and "css" classes for display.';
$string['csslist'] = 'CSS definitions';
$string['csslist_desc'] = 'Enter the CSS code here as you would normally write it.';
$string['allowedroles'] = 'Allowed roles';
$string['allowedroles_desc'] = 'Select which roles are allowed to use the eLeDia Styles plugin';
$string['compiled_css_heading'] = 'Compiled CSS (for copying into the theme)';
$string['compiled_css_empty'] = 'No CSS compiled yet. Please enter CSS and save.';
$string['copy_css'] = 'Copy All';
$string['copied_to_clipboard'] = 'CSS code copied to clipboard!';
$string['showclearbutton'] = 'Display "Clear style" button separately';
$string['showclearbutton_desc'] = 'By default, the "Clear style" function is located in the dropdown menu. If enabled, it will be displayed as a separate button in the toolbar instead.';
$string['useexternalcss'] = 'Load external CSS (Tiny)';
$string['useexternalcss_desc'] = 'If enabled, the CSS file at the URL below will be loaded inside the Tiny editor iframe.';
$string['externalcssurl'] = 'External CSS URL (Tiny)';
$string['externalcssurl_desc'] = 'Public HTTPS URL to one or more CSS file to be loaded inside the Tiny editor iframe. Please only one URL per Line';

// SCSS compilation messages.
$string['scsscompileerror'] = 'SCSS could not be compiled, please check your code.';
$string['scsscompilesuccess'] = 'SCSS was compiled and saved successfully.';
$string['scsscompilernotfound'] = 'SCSS compiler library not found.';

// Capability strings.
$string['elediastyles:use'] = 'Use eleDia Styles plugin';