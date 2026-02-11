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
 * Tiny tiny_elediastyles options.
 *
 * @module      tiny_elediastyles/options
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['editor_tiny/options', 'tiny_elediastyles/common'], function(Options, Common) {

    // Helper variables for the option names.
    var jsonDefinitionList = Options.getPluginOptionName(Common.pluginName, 'jsonDefinition');
    var cssDefinitionList = Options.getPluginOptionName(Common.pluginName, 'cssDefinition');
    var externalCssUrlOption = Options.getPluginOptionName(Common.pluginName, 'externalCssUrl');
    var useExternalCssOption = Options.getPluginOptionName(Common.pluginName, 'useExternalCss');
    var showClearButtonOption = Options.getPluginOptionName(Common.pluginName, 'showclearbutton');

    /**
     * Options registration function.
     *
     * @param {TinyMCE.Editor} editor
     */
    var register = function(editor) {
        // For each option, register it with the editor.
        // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
        editor.options.register(jsonDefinitionList, {
            processor: 'Array',
        });
        editor.options.register(cssDefinitionList, {
            processor: 'Array',
        });
        editor.options.register(externalCssUrlOption, {
            processor: 'string'
        });
        editor.options.register(useExternalCssOption, {
            processor: 'boolean'
        });
        editor.options.register(showClearButtonOption, {
            processor: 'boolean'
        });
    };

    /**
     * @param {TinyMCE.Editor} editor The editor instance to fetch the value for
     * @returns {array} The value of the jsonDefinition option
     */
    var getjsonDefinition = function(editor) {
        return editor.options.get(jsonDefinitionList);
    };

    /**
     * @param {TinyMCE.Editor} editor The editor instance to fetch the value for
     * @returns {array} The value of the cssDefinition option
     */
    var getCssDefinition = function(editor) {
        return editor.options.get(cssDefinitionList);
    };

    /**
     * @param {TinyMCE.Editor} editor
     * @returns {string} External CSS URL (may be empty)
     */
    var getExternalCssUrl = function(editor) {
        return editor.options.get(externalCssUrlOption) || '';
    };

    /**
     * @param {TinyMCE.Editor} editor
     * @returns {boolean} Whether to load the external CSS
     */
    var getUseExternalCss = function(editor) {
        return !!editor.options.get(useExternalCssOption);
    };

    /**
     * @param {TinyMCE.Editor} editor
     * @returns {boolean} Whether to show button next to dropdown or in the dropdown
     */
    var getShowClearButtonOption = function(editor) {
        return !!editor.options.get(showClearButtonOption);
    };

    return {
        register: register,
        getjsonDefinition: getjsonDefinition,
        getCssDefinition: getCssDefinition,
        getExternalCssUrl: getExternalCssUrl,
        getUseExternalCss: getUseExternalCss,
        getShowClearButtonOption: getShowClearButtonOption
    };
});