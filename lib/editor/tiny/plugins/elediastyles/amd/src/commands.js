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
 * Tiny tiny_elediastyles commands.
 *
 * @module      tiny_elediastyles/commands
 * @copyright   2025 Alex Schander <alexander.schander@eledia.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['core/str', 'tiny_elediastyles/common', 'tiny_elediastyles/options'], function(Str, Common, Options) {

    var getSetup = function() {
        return Promise.all([
            Str.get_string('button_showStyles', Common.component),
            Str.get_string('button_clearStyles', Common.component),
        ]).then(function(strings) {
            var buttonLabel = strings[0];
            var clearButtonLabel = strings[1];

            return function(editor) {
                var showClearButton = Options.getShowClearButtonOption(editor);
                var jsonDef = Options.getjsonDefinition(editor) || '[]';

                if (typeof jsonDef === "string") {
                    try {
                        jsonDef = JSON.parse(jsonDef);
                    } catch (e) {
                        window.console.error("Error parsing style JSON:", e);
                        jsonDef = [];
                    }
                }

                var rawCss = Options.getCssDefinition(editor);
                editor.once('init', function() {
                    // Inject the compiled CSS from the plugin settings.
                    if (rawCss) {
                        editor.contentStyles.push(rawCss);
                    }
                    // Also inject external CSS file if configured.
                    var useExternal = Options.getUseExternalCss(editor);
                    if (useExternal) {
                        var externalUrlsString = (Options.getExternalCssUrl(editor) || '').trim();
                        if (externalUrlsString) {
                            // Split the string into an array of URLs, one per line.
                            var urls = externalUrlsString.split(/\r?\n/);
                            urls.forEach(function(url) {
                                var trimmedUrl = url.trim();
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
                var applyClass = function(classes, type) {
                    var formatName;
                    type = type || "block";
                    if (type === "block") {
                        // Create a unique name for the format.
                        formatName = 'custom_block_' + classes.replace(/\s+/g, '_');

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
                        formatName = 'custom_inline_' + classes.replace(/\s+/g, '_');
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
                var clearAllClasses = function() {
                    if (!Array.isArray(jsonDef)) {
                        return;
                    }

                    // Block-Level Clearing.
                    editor.execCommand('FormatBlock', false, 'p');

                    var blocks = editor.selection.getSelectedBlocks();
                    if (blocks && blocks.length) {
                        var blockClasses = jsonDef.flatMap(function(style) {
                            if (style.type === 'block' && style.classes) {
                                return style.classes.split(' ');
                            }
                            return [];
                        });

                        var uniqueBlockClasses = Array.from(new Set(blockClasses)).filter(Boolean);

                        blocks.forEach(function(block) {
                            uniqueBlockClasses.forEach(function(className) {
                                editor.dom.removeClass(block, className);
                            });
                        });
                    }

                    // Inline-Level Clearing.
                    jsonDef.forEach(function(styleDef) {
                        if (styleDef.type === "inline" && styleDef.classes) {
                            var inlineFormatName = 'custom_inline_' + styleDef.classes.replace(/\s+/g, '_');
                            if (editor.formatter.match(inlineFormatName)) {
                                editor.formatter.remove(inlineFormatName);
                            }
                        }
                    });
                };

                /**
                 * Builds the menu items for the dropdown button.
                 * Conditionally inserts a "Clear Formatting" item.
                 * @returns {Array} The menu items.
                 */
                var buildMenuItems = function() {
                    // In case we got an old value.
                    var showClear = Options.getShowClearButtonOption(editor);
                    var menuItems = [];

                    // ONLY add the "Clear Style" item to the dropdown if the separate button is DISABLED.
                    if (!showClear) {
                        menuItems.push({
                            type: 'menuitem',
                            text: clearButtonLabel,
                            icon: 'invert',
                            onAction: function() {
                                clearAllClasses();
                            }
                        });
                    }

                    if (!Array.isArray(jsonDef)) {
                        return menuItems;
                    }

                    // Generate the dynamic list of styles from the JSON definition.
                    var styleItems = jsonDef.map(function(styleDef) {
                        return {
                            type: 'menuitem',
                            text: styleDef.title || styleDef.classes,
                            onAction: function() {
                                applyClass(styleDef.classes, styleDef.type);
                            },
                            onSetup: function() {
                                setTimeout(function() {
                                    var items = document.querySelectorAll('.tox-menu .tox-collection__item');
                                    items.forEach(function(item) {
                                        if (item.getAttribute('aria-label') === (styleDef.title || styleDef.classes)) {
                                            item.classList.add('eledia-style-item');
                                            if (styleDef.classes) {
                                                styleDef.classes.split(' ').forEach(function(cls) {
                                                    if (cls) {
                                                        item.classList.add(cls);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }, 0);
                                return function() {
                                    // Cleanup function.
                                };
                            }
                        };
                    });

                    // Combine the conditional clear item with the dynamic styles.
                    return menuItems.concat(styleItems);
                };

                // Add "Double Enter" behavior to exit styled divs.
                editor.on('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        var node = editor.selection.getNode();

                        var wrapperDiv = editor.dom.getParents(node, function(el) {
                            return jsonDef.some(function(style) {
                                return style.type === 'block' && el.classList.contains(style.classes);
                            });
                        }, editor.getBody());

                        if (!wrapperDiv || wrapperDiv.length === 0) {
                            return;
                        }
                        var container = wrapperDiv[0];

                        var currentBlock = editor.dom.getParent(node, 'p,h1,h2,h3,h4,h5,h6,li');
                        if (currentBlock && editor.dom.isEmpty(currentBlock)) {
                            e.preventDefault();
                            var newPara = editor.dom.create('p');
                            editor.dom.insertAfter(newPara, container);
                            editor.dom.remove(currentBlock);
                            editor.selection.setCursorLocation(newPara, 0);
                        }
                    }
                });

                // Register the main menu button.
                editor.ui.registry.addMenuButton(Common.pluginButtonName, {
                    icon: 'color-levels',
                    tooltip: buttonLabel,
                    // eslint-disable-next-line promise/no-callback-in-promise
                    fetch: function(callback) {
                        callback(buildMenuItems());
                    },
                });

                // Register the clear format button ONLY if the setting is enabled.
                if (showClearButton) {
                    editor.ui.registry.addButton(Common.pluginClearButtonName, {
                        icon: 'invert',
                        tooltip: clearButtonLabel,
                        onAction: function() {
                            clearAllClasses();
                        },
                    });
                }
            };
        });
    };

    return {
        getSetup: getSetup
    };
});