import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { EditorTheme } from "./EditorTheme";
import ToolbarPlugin from "./ToolbarPlugin";
import "./editor.css";

function Placeholder() {
    return <div className="editor-placeholder">Mulai menulis cerita anda...</div>;
}

const editorConfig = {
    namespace: "RKB-AMB Blog",
    theme: EditorTheme,
    onError(error) {
        throw error;
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode
    ],
};

export default function Editor({ initialConfig, onChange, editable = true }) {
    return (
        <LexicalComposer initialConfig={{ ...editorConfig, ...initialConfig, editable }}>
            <div className={`editor-container ${!editable ? 'border-none' : ''}`}>
                {editable && <ToolbarPlugin />}
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={`editor-input ${!editable ? 'p-0 min-h-0' : ''}`} />}
                        placeholder={editable ? <Placeholder /> : null}
                        ErrorBoundary={(e) => <div>Error: {e.children}</div>}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    {onChange && <OnChangePlugin onChange={onChange} />}
                </div>
            </div>
        </LexicalComposer>
    );
}
