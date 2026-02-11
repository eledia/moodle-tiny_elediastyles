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
 * Plugin administration pages are defined here.
 *
 * @package     tiny_elediastyles
 * @category    admin
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/lib/editor/tiny/plugins/elediastyles/lib.php');

if ($hassiteconfig) {
    $default = json_encode([
            'css' => '.test { color: red; }',
            'styles' => [
                    [
                            'label' => 'Test Style',
                            'class' => 'test',
                            'type' => 'inline',
                    ],
            ],
    ]);
    $defaultcss = '.test { color: red; }';

    if ($ADMIN->fulltree) {
        // Add introductory heading.
        $settings->add(new admin_setting_heading(
                'tiny_elediastyles/pluginname',
                get_string('pluginname', 'tiny_elediastyles'),
                get_string('pluginname_desc', 'tiny_elediastyles')
        ));

        $settingjson = new admin_setting_configtextarea(
                'tiny_elediastyles/styleslist',
                get_string('styleslist', 'tiny_elediastyles'),
                get_string('styleslist_desc', 'tiny_elediastyles'),
                $default
        );
        $settings->add($settingjson);

        $settingcss = new admin_setting_configtextarea(
                'tiny_elediastyles/csslist',
                get_string('csslist', 'tiny_elediastyles'),
                get_string('csslist_desc', 'tiny_elediastyles'),
                $defaultcss,
                PARAM_RAW
        );
        $settingcss->set_updatedcallback('tiny_elediastyles_process_settings_update');
        $settings->add($settingcss);

        $settings->add(new admin_setting_configcheckbox(
                'tiny_elediastyles/useexternalcss',
                get_string('useexternalcss', 'tiny_elediastyles'),
                get_string('useexternalcss_desc', 'tiny_elediastyles'),
                0
        ));

        $settings->add(new admin_setting_configtextarea(
                'tiny_elediastyles/externalcssurl',
                get_string('externalcssurl', 'tiny_elediastyles'),
                get_string('externalcssurl_desc', 'tiny_elediastyles'),
                '',
                PARAM_RAW
        ));

        $settings->add(new admin_setting_configcheckbox(
                'tiny_elediastyles/showclearbutton',
                get_string('showclearbutton', 'tiny_elediastyles'),
                get_string('showclearbutton_desc', 'tiny_elediastyles'),
                1
        ));

        $compiledcss = get_config('tiny_elediastyles', 'compiled_css');
        if (empty($compiledcss)) {
            $compiledcssdisplay = get_string('compiled_css_empty', 'tiny_elediastyles');
        } else {
            // Initialize the copy button JavaScript module.
            global $PAGE;
            $PAGE->requires->js_call_amd('tiny_elediastyles/copycss', 'init');

            $compiledcssdisplay = '<button type="button" id="copy-css-button" class="btn btn-secondary" '
                    . 'style="margin-bottom: 10px;">'
                    . get_string('copy_css', 'tiny_elediastyles')
                    . '</button>';
            $compiledcssdisplay .= '<pre id="compiled-css" style="background-color: #f5f5f5; border: 1px solid #ccc; '
                    . 'padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word;">'
                    . htmlspecialchars($compiledcss)
                    . '</pre>';
        }

        $settings->add(new admin_setting_heading(
                'tiny_elediastyles_compiled_css_heading',
                get_string('compiled_css_heading', 'tiny_elediastyles'),
                $compiledcssdisplay
        ));
    }
}
