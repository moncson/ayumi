import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Tag } from '@/types/article';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // リクエストヘッダーからmediaIdを取得
    const mediaId = request.headers.get('x-media-id');
    
    console.log('[API /admin/tags] Fetching tags...', { mediaId });
    
    let tagsRef = adminDb.collection('tags');
    
    // mediaIdが指定されている場合はフィルタリング
    let query: FirebaseFirestore.Query = tagsRef;
    if (mediaId) {
      query = tagsRef.where('mediaId', '==', mediaId);
    }
    
    const snapshot = await query.orderBy('name').get();

    const tags: Tag[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      slug: doc.data().slug,
      mediaId: doc.data().mediaId,
    }));

    console.log(`[API /admin/tags] Found ${tags.length} tags`);

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching admin tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

