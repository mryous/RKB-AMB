'use client';

import { useParams } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditPostPage() {
    const params = useParams();
    return (
        <AdminLayout activePage="blog" title="Edit Artikel">
            <PostEditor postId={params.id} />
        </AdminLayout>
    );
}
