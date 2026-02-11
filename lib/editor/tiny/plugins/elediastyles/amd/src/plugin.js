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
 * Tiny tiny_elediastyles plugin.
 *
 * @module      tiny_elediastyles/plugin
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define([
    'editor_tiny/loader',
    'editor_tiny/utils',
    'tiny_elediastyles/common',
    'tiny_elediastyles/options',
    'tiny_elediastyles/commands',
    'tiny_elediastyles/configuration'
], function(
    Loader,
    Utils,
    Common,
    Options,
    Commands,
    Configuration
) {

    // ====================
    // Inject theme ALL CSS into the Tiny iframe
    // ====================

    /**
     * I look up the editor CSS loaded in the Tiny iframe (.../theme/styles.php/.../editor),
     * derive .../all from it, and append it as a <link rel="stylesheet"> to the iframe head,
     * so the full theme CSS (including Font Awesome) becomes available.
     * @param {TinyMCEEditor} editor
     */
    var injectThemeAllCss = function(editor) {
        try {
            var doc = editor.getDoc();
            if (!doc || !doc.head) {
                return;
            }
            // Collect all stylesheet links inside the iframe.
            var links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
            // Find the link that ends with .../editor.
            var editorLink = links.find(function(l) {
                return l && typeof l.href === 'string' &&
                    /\/theme\/styles\.php\/[^/]+\/[^/]+\/editor$/.test(l.href);
            });
            if (!editorLink) {
                // Eslint-disable-next-line no-console.
                window.console.warn('[tiny_elediastyles] No editor stylesheet found in the iframe.');
                return;
            }
            // Derive /all from /editor.
            var allHref = editorLink.href.replace(/\/editor$/, '/all');
            // Skip if it's already present.
            var already = links.some(function(l) {
                return l && l.href === allHref;
            });
            if (already) {
                return;
            }
            // Append a <link> for .../all.
            var link = doc.createElement('link');
            link.rel = 'stylesheet';
            link.href = allHref;
            doc.head.appendChild(link);
            // Eslint-disable-next-line no-console.
            window.console.log('[tiny_elediastyles] Injected theme ALL CSS into Tiny iframe:', allHref);
        } catch (e) {
            // Eslint-disable-next-line no-console.
            window.console.error('[tiny_elediastyles] injectThemeAllCss error:', e);
        }
    };

    // Setup the tiny_elediastyles plugin.
    return new Promise(function(resolve) {
        Promise.all([
            Loader.getTinyMCE(),
            Utils.getPluginMetadata(Common.component, Common.pluginName),
            Commands.getSetup(),
        ]).then(function(results) {
            var tinyMCE = results[0];
            var pluginMetadata = results[1];
            var setupCommands = results[2];

            tinyMCE.PluginManager.add(Common.pluginName, function(editor) {
                Options.register(editor);
                setupCommands(editor);
                // Inject ALL CSS once Tiny is initialized.
                editor.on('init', function() {
                    injectThemeAllCss(editor);
                });
                return pluginMetadata;
            });
            return resolve([Common.pluginName, Configuration]);
        }).catch(function(error) {
            window.console.error("Error during plugin setup:", error);
            // Reject(error); // Optional.
            return resolve([Common.pluginName, Configuration]);
        });
    });
});