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
 * Tiny tiny_elediastyles for Moodle.
 *
 * @module      tiny_elediastyles
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { get_string as getString } from "core/str";
import { component, pluginButtonName, pluginClearButtonName } from "./common";
import { getCssDefinition, getjsonDefinition, getExternalCssUrl, getUseExternalCss, getShowClearButtonOption } from "./options";

export const getSetup = async () => {
    const [
        buttonLabel,
        clearButtonLabel,
    ] = await Promise.all([
        getString("button_showStyles", component),
        getString("button_clearStyles", component),
    ]);

    return (editor) => {
        let showClearButton = getShowClearButtonOption(editor);
        let jsonDef = getjsonDefinition(editor) || '[]';
        if (typeof jsonDef === "string") {
            try {
                jsonDef = JSON.parse(jsonDef);
            } catch (e) {
                window.console.error("Error parsing style JSON:", e);
                jsonDef = [];
            }
        }

        const rawCss = getCssDefinition(editor);
        editor.once('init', () => {
            // Inject the compiled CSS from the plugin settings.
            if (rawCss) {
                editor.contentStyles.push(rawCss);
            }
            // Also inject external CSS file if configured.
            const useExternal = getUseExternalCss(editor);
            if (useExternal) {
                const externalUrlsString = (getExternalCssUrl(editor) || '').trim();
                if (externalUrlsString) {
                    // Split the string into an array of URLs, one per line.
                    const urls = externalUrlsString.split(/\r?\n/);
                    urls.forEach(url => {
                        const trimmedUrl = url.trim();
                        // Add each valid URL to the editor's content CSS list.
                        if (trimmedUrl) {
                            editor.contentCSS.push(trimmedUrl);
                        }
                    });
                }
            }
        });

        /**
         * Applies the CSS classes based on the style definition.
         * @param {string} classes - The CSS classes to apply.
         * @param {string} [type='block'] - The type of style, e.g., 'block' or 'inline'.
         */
        const applyClass = (classes, type = "block") => {
            if (type === "block") {
                // Create a unique name for the format.
                const formatName = `custom_block_${classes.replace(/\s+/g, '_')}`;

                // Register the format, specifying a DIV as the block element.
                editor.formatter.register(formatName, {
                    block: 'div',
                    classes: classes,
                    wrapper: true // Allows nesting other block elements like lists.
                });

                // Apply the format to the current selection.
                editor.formatter.toggle(formatName);

            } else {
                // Handle inline formatting.
                const formatName = `custom_inline_${classes.replace(/\s+/g, '_')}`;
                editor.formatter.register(formatName, {
                    inline: "span",
                    classes: classes,
                });
                editor.formatter.toggle(formatName);
            }
        };

        /**
         * Removes all custom style classes from the current selection.
         * Resets styled block elements back to standard paragraphs.
         */
        const clearAllClasses = () => {
            if (!Array.isArray(jsonDef)) {
                return;
            }

            // Block-Level Clearing
            editor.execCommand('FormatBlock', false, 'p');

            const blocks = editor.selection.getSelectedBlocks();
            if (blocks && blocks.length) {
                const blockClasses = jsonDef.flatMap(style => {
                    if (style.type === 'block' && style.classes) {
                        return style.classes.split(' ');
                    }
                    return [];
                });

                const uniqueBlockClasses = [...new Set(blockClasses)].filter(Boolean);

                blocks.forEach(block => {
                    uniqueBlockClasses.forEach(className => {
                        editor.dom.removeClass(block, className);
                    });
                });
            }

            // Inline-Level Clearing
            jsonDef.forEach(styleDef => {
                if (styleDef.type === "inline" && styleDef.classes) {
                    const formatName = `custom_inline_${styleDef.classes.replace(/\s+/g, '_')}`;
                    if (editor.formatter.match(formatName)) {
                        editor.formatter.remove(formatName);
                    }
                }
            });
        };

        /**
         * Builds the menu items for the dropdown button.
         * Conditionally inserts a "Clear Formatting" item.
         */
        const buildMenuItems = () => {
            // in case we got an old value
            const showClear = getShowClearButtonOption(editor);
            let menuItems = [];

            // ONLY add the "Clear Style" item to the dropdown if the separate button is DISABLED.
            if (!showClear) {
                menuItems.push({
                    type: 'menuitem',
                    text: clearButtonLabel,
                    icon: 'invert',
                    onAction: () => clearAllClasses()
                });
            }

            if (!Array.isArray(jsonDef)) {
                return menuItems;
            }

            // Generate the dynamic list of styles from the JSON definition.
            const styleItems = jsonDef.map((styleDef) => ({
                type: 'menuitem',
                text: styleDef.title || styleDef.classes,
                onAction: () => applyClass(styleDef.classes, styleDef.type),
                onSetup: () => {
                    setTimeout(() => {
                        const menuItems = document.querySelectorAll('.tox-menu .tox-collection__item');
                        menuItems.forEach(item => {
                            if (item.getAttribute('aria-label') === (styleDef.title || styleDef.classes)) {
                                item.classList.add('eledia-style-item');
                                if (styleDef.classes) {
                                    styleDef.classes.split(' ').forEach(cls => {
                                        if (cls) {
                                            item.classList.add(cls);
                                        }
                                    });
                                }
                            }
                        });
                    }, 0);
                    return () => {};
                }
            }));

            // Combine the conditional clear item with the dynamic styles.
            return [...menuItems, ...styleItems];
        };

        // Add "Double Enter" behavior to exit styled divs.
        editor.on('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const node = editor.selection.getNode();

                const wrapperDiv = editor.dom.getParents(node, (el) => {
                    return jsonDef.some(style => style.type === 'block' && el.classList.contains(style.classes));
                }, editor.getBody());

                if (!wrapperDiv || wrapperDiv.length === 0) {
                    return;
                }
                const container = wrapperDiv[0];

                const currentBlock = editor.dom.getParent(node, 'p,h1,h2,h3,h4,h5,h6,li');
                if (currentBlock && editor.dom.isEmpty(currentBlock)) {
                    e.preventDefault();
                    const newPara = editor.dom.create('p');
                    editor.dom.insertAfter(newPara, container);
                    editor.dom.remove(currentBlock);
                    editor.selection.setCursorLocation(newPara, 0);
                }
            }
        });

        // Register the main menu button.
        editor.ui.registry.addMenuButton(pluginButtonName, {
            icon: 'color-levels',
            tooltip: buttonLabel,
            fetch: (callback) => {
                const items = buildMenuItems();
                callback(items);
            },
        });

        // Register the clear format button ONLY if the setting is enabled.
        if (showClearButton) {
            editor.ui.registry.addButton(pluginClearButtonName, {
                icon: 'invert',
                tooltip: clearButtonLabel,
                onAction: () => clearAllClasses(),
            });
        }
    };
};