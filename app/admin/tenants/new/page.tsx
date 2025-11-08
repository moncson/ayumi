'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import FloatingInput from '@/components/admin/FloatingInput';
import FeaturedImageUpload from '@/components/admin/FeaturedImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaTenant } from '@/contexts/MediaTenantContext';

export default function NewTenantPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshTenants } = useMediaTenant();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    customDomain: '',
    subdomain: '',
    siteName: '',
    siteDescription: '',
    logoUrl: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      alert('メディア名とスラッグは必須です');
      return;
    }

    if (!user) {
      alert('ログインしてください');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          customDomain: formData.customDomain || undefined,
          subdomain: formData.subdomain || formData.slug,
          ownerId: user.uid,
          settings: {
            siteName: formData.siteName || formData.name,
            siteDescription: formData.siteDescription || '',
            logoUrl: formData.logoUrl || '',
          },
        }),
      });

      if (response.ok) {
        alert('メディアを作成しました');
        await refreshTenants();
        router.push('/admin/tenants');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'メディア作成に失敗しました');
      }
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      alert(error.message || 'メディアの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="max-w-4xl pb-32">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">新規メディア作成</h2>

              {/* ロゴ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ロゴ画像
                </label>
                <FeaturedImageUpload
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                />
              </div>

              {/* メディア名 */}
              <FloatingInput
                label="メディア名"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                required
              />

              {/* スラッグ */}
              <FloatingInput
                label="スラッグ（英数字とハイフンのみ）"
                value={formData.slug}
                onChange={(value) => setFormData({ ...formData, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                required
              />

              {/* サブドメイン */}
              <FloatingInput
                label="サブドメイン（任意・空欄の場合はスラッグを使用）"
                value={formData.subdomain}
                onChange={(value) => setFormData({ ...formData, subdomain: value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              />

              {/* カスタムドメイン */}
              <FloatingInput
                label="カスタムドメイン（任意）"
                value={formData.customDomain}
                onChange={(value) => setFormData({ ...formData, customDomain: value })}
                placeholder="example.com"
              />

              {/* サイト名 */}
              <FloatingInput
                label="サイト名（任意・空欄の場合はメディア名を使用）"
                value={formData.siteName}
                onChange={(value) => setFormData({ ...formData, siteName: value })}
              />

              {/* サイト説明 */}
              <FloatingInput
                label="サイトの説明（任意）"
                value={formData.siteDescription}
                onChange={(value) => setFormData({ ...formData, siteDescription: value })}
                multiline
                rows={5}
              />
            </div>
          </form>

          {/* フローティングボタン */}
          <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
            {/* キャンセルボタン */}
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white w-14 h-14 rounded-full hover:bg-gray-600 transition-all hover:scale-110 flex items-center justify-center"
              title="キャンセル"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 作成ボタン */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-orange-500 text-white w-14 h-14 rounded-full hover:bg-orange-600 transition-all hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="メディア作成"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}

