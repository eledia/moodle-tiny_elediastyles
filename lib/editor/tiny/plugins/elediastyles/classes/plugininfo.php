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
 * Tiny EleDia Styles plugin for Moodle.
 *
 * @package     tiny_elediastyles
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_elediastyles;

use context;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;

/**
 * Tiny EleDia Styles plugin info class.
 */
class plugininfo extends plugin implements plugin_with_buttons, plugin_with_configuration {
    /**
     * Get the list of available buttons.
     *
     * @return array
     */
    public static function get_available_buttons(): array {
        return [
                'tiny_elediastyles/tiny_htmlblock_btn',
                'tiny_elediastyles/tiny_htmlblock_btn_clear',
        ];
    }

    /**
     * Get plugin configuration for context.
     *
     * @param context $context The context
     * @param array $options Editor options
     * @param array $fpoptions File picker options
     * @param \editor_tiny\editor|null $editor The editor instance
     * @return array Configuration array
     */
    public static function get_plugin_configuration_for_context(
            \context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): array {
        global $USER;

        // First check if the standard capability check passes.
        if (!has_capability('tiny/elediastyles:use', $context)) {
            return [];
        }

        // Then check if the user's role is in the allowed roles list.
        $allowedroles = get_config('tiny_elediastyles', 'allowedroles');
        if (!empty($allowedroles)) {
            $allowedroles = explode(',', $allowedroles);
            $userroles = get_user_roles($context, $USER->id);
            $roleallowed = false;
            foreach ($userroles as $role) {
                if (in_array($role->roleid, $allowedroles)) {
                    $roleallowed = true;
                    break;
                }
            }
            if (!$roleallowed) {
                return [];
            }
        }

        // Import styles & css.
        $jsondef = get_config('tiny_elediastyles', 'styleslist');
        $cssdef = get_config('tiny_elediastyles', 'compiled_css');

        // Import checkbox for showing button.
        $showclearbutton = get_config('tiny_elediastyles', 'showclearbutton');

        // Import external css.
        $useexternal = (bool)get_config('tiny_elediastyles', 'useexternalcss');
        $external = trim((string)get_config('tiny_elediastyles', 'externalcssurl'));

        if (!$useexternal || $external === '' || stripos($external, 'https://') !== 0) {
            $external = '';
        }

        return [
                'jsonDefinition' => $jsondef,
                'cssDefinition' => $cssdef,
                'externalCssUrl'  => $external,
                'useExternalCss'  => ($external !== ''),
                'showclearbutton' => (bool)$showclearbutton,
        ];
    }
}
