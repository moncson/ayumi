import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Category } from '@/types/article';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // リクエストヘッダーからmediaIdを取得
    const mediaId = request.headers.get('x-media-id');
    
    console.log('[API /admin/categories] Fetching categories...', { mediaId });
    
    let categoriesRef = adminDb.collection('categories');
    
    // mediaIdが指定されている場合はフィルタリング
    let query: FirebaseFirestore.Query = categoriesRef;
    if (mediaId) {
      query = categoriesRef.where('mediaId', '==', mediaId);
    }
    
    const snapshot = await query.orderBy('name').get();

    const categories: Category[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      slug: doc.data().slug,
      description: doc.data().description || '',
      mediaId: doc.data().mediaId,
    }));

    console.log(`[API /admin/categories] Found ${categories.length} categories`);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

