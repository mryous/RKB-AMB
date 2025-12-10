'use client';

import Editor from '@/components/editor/Editor';

export default function SinglePostContent({ content }) {
    if (!content) return null;

    return (
        <div className="prose prose-lg max-w-none">
            <Editor
                initialConfig={{
                    editorState: typeof content === 'string' ? content : JSON.stringify(content),
                    editable: false
                }}
                editable={false}
            />
        </div>
    );
}
