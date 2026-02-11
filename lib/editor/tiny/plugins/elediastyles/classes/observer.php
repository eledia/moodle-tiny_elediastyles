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

namespace tiny_elediastyles;

use core\event\course_module_viewed;
use function \tiny_elediastyles_extend_page;


defined('MOODLE_INTERNAL') || die();

class observer {
	/**
     * Observer function triggered when a course module is viewed.
     *
     * @param \core\event\course_module_viewed $event The event data.
     * @return void
     */
    public static function course_module_viewed(\core\event\course_module_viewed $event) {
        global $PAGE, $CFG;
		require_once($CFG->dirroot . '/lib/editor/tiny/plugins/elediastyles/lib.php');
        tiny_elediastyles_extend_page($PAGE);
    }
}
