import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Heading1, Heading2, Quote } from 'lucide-react';
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

const LowPriority = 1;

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                UNDO_COMMAND,
                (payload) => {
                    // Update undo/redo state
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                REDO_COMMAND,
                (payload) => {
                    // Update undo/redo state
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    const formatHeading = (headingSize) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            }
        });
    };

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    return (
        <div className="toolbar" ref={toolbarRef}>
            <button
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="toolbar-item"
                aria-label="Redo"
            >
                <Redo size={18} />
            </button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
                className={"toolbar-item spaced " + (isBold ? "active" : "")}
                aria-label="Format Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
                className={"toolbar-item spaced " + (isItalic ? "active" : "")}
                aria-label="Format Italics"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
                className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
                aria-label="Format Underline"
            >
                <Underline size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
                className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
                aria-label="Format Strikethrough"
            >
                <Strikethrough size={18} />
            </button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={() => formatHeading('h1')}
                className="toolbar-item spaced"
                aria-label="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => formatHeading('h2')}
                className="toolbar-item spaced"
                aria-label="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                onClick={formatQuote}
                className="toolbar-item spaced"
                aria-label="Quote"
            >
                <Quote size={18} />
            </button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
                className="toolbar-item spaced"
                aria-label="Left Align"
            >
                <AlignLeft size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
                className="toolbar-item spaced"
                aria-label="Center Align"
            >
                <AlignCenter size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
                className="toolbar-item spaced"
                aria-label="Right Align"
            >
                <AlignRight size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
                className="toolbar-item"
                aria-label="Justify Align"
            >
                <AlignJustify size={18} />
            </button>
        </div>
    );
}
