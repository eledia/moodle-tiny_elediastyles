<?php
// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Web service to get the CSS for tiny_elediastyles.
 *
 * @package     tiny_elediastyles
 * @copyright   2025 Alexander Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_elediastyles\external;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

use context;
use external_api;
use external_function_parameters;
use external_single_structure;
use external_value;

/**
 * External service to get CSS for the editor.
 */
class get_css extends external_api {
    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([
                'contextid' => new external_value(PARAM_INT, 'The context id', VALUE_DEFAULT, 1),
        ]);
    }

    /**
     * Get the CSS.
     *
     * @param int $contextid The context id
     * @return array CSS content
     */
    public static function execute($contextid = 1) {
        global $USER;

        // Validate parameters.
        $params = self::validate_parameters(self::execute_parameters(), [
                'contextid' => $contextid,
        ]);

        // Validate context.
        $context = context::instance_by_id($params['contextid']);
        self::validate_context($context);

        // Check capability.
        require_capability('tiny/elediastyles:use', $context);

        // Get the CSS from config.
        $css = get_config('tiny_elediastyles', 'compiled_css');

        return [
                'css' => $css,
        ];
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     */
    public static function execute_returns() {
        return new external_single_structure([
                'css' => new external_value(PARAM_RAW, 'The CSS content'),
        ]);
    }
}
