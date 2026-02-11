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
 * Library functions for tiny_elediastyles.
 *
 * @package     tiny_elediastyles
 * @category    lib
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Compiles SCSS string to CSS string.
 *
 * @param string $scsscode The SCSS code to compile.
 * @return string|false The compiled CSS or false on error.
 * @throws \Exception re-throws exception from the compiler.
 */
function tiny_elediastyles_compile_scss($scsscode) {
    if (!class_exists('\ScssPhp\ScssPhp\Compiler')) {
        throw new \moodle_exception('scsscompilerunavailable', 'tiny_elediastyles');
    }
    try {
        $compiler = new \ScssPhp\ScssPhp\Compiler();
        $compiledcss = $compiler->compileString($scsscode)->getCss();
        return $compiledcss;
    } catch (\Exception $e) {
        throw $e;
    }
}

/**
 * Callback function executed when the 'csslist' setting is updated.
 * It fetches the saved SCSS, compiles it, and saves the compiled CSS.
 *
 * @param mixed $data The data passed from the admin_setting object (may not be the direct value).
 * @param admin_setting|null $setting The admin setting object itself.
 * @return bool True on success.
 */
function tiny_elediastyles_process_settings_update($data, $setting = null) {
    global $CFG;
    $scsscompilerpath = $CFG->dirroot . '/lib/editor/tiny/plugins/elediastyles/vendor/scssphp/scss.inc.php';
    if (!file_exists($scsscompilerpath)) {
        \core\notification::error(get_string('scsscompilernotfound', 'tiny_elediastyles'));
        return false;
    }
    require_once($scsscompilerpath);

    // Get the just saved value from the 'csslist'-Config.
    $scsscodefromsettings = get_config('tiny_elediastyles', 'csslist');
    if ($scsscodefromsettings === null) {
        \core\notification::error(get_string('scsscompileerror', 'tiny_elediastyles'));
        $scsscodefromsettings = ''; // Fallback on empty string.
    }
    $compiledcss = tiny_elediastyles_compile_scss($scsscodefromsettings);
    if ($compiledcss !== false) {
        set_config('compiled_css', $compiledcss, 'tiny_elediastyles');
        \core\notification::success(get_string('scsscompilesuccess', 'tiny_elediastyles'));
    } else {
        set_config('compiled_css', '', 'tiny_elediastyles');
        \core\notification::error(get_string('scsscompileerror', 'tiny_elediastyles'));
    }
    theme_reset_all_caches();
    return true;
}

/**
 * Extends the page with required JavaScript for CSS injection.
 *
 * This function is currently NOT required, as we are ignoring theme-independent
 * CSS injection for the time being. It can be commented out or removed.
 *
 * @param moodle_page $PAGE The page object.
 * @return void
 */
function tiny_elediastyles_extend_page($PAGE) {
    // Fetching CSS per AJAX.
    $PAGE->requires->js_call_amd('tiny_elediastyles/injectcss', 'init', []);
}
