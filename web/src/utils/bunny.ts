/**
 * Bunny.net Stream API utilities
 * Manages video library collections for multi-tenant isolation
 */

const BUNNY_API_BASE = 'https://video.bunnycdn.com';

function getLibraryId() {
    return process.env.BUNNY_VIDEO_LIBRARY_ID || process.env.BUNNY_LIBRARY_ID || '';
}

function getAccessKey() {
    return process.env.BUNNY_API_KEY || process.env.BUNNY_ACCESS_KEY || '';
}

/**
 * Create a Collection in the Bunny Stream Library.
 * Used when a new tenant/school is approved to isolate their videos.
 */
export async function createBunnyCollection(tenantName: string): Promise<string | null> {
    const libraryId = getLibraryId();
    const accessKey = getAccessKey();

    if (!libraryId || !accessKey) {
        console.warn('[BUNNY] Library/AccessKey not configured. Skipping collection creation.');
        return null;
    }

    try {
        const response = await fetch(`${BUNNY_API_BASE}/library/${libraryId}/collections`, {
            method: 'POST',
            headers: {
                'AccessKey': accessKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name: tenantName }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[BUNNY] Failed to create collection for "${tenantName}":`, errText);
            return null;
        }

        const data = await response.json();
        console.log(`[BUNNY] Collection created for "${tenantName}": ${data.guid}`);
        return data.guid;
    } catch (error) {
        console.error('[BUNNY] Collection creation error:', error);
        return null;
    }
}

/**
 * Create a video in a specific collection.
 * Returns the video GUID for TUS upload.
 */
export async function createBunnyVideo(title: string, collectionId?: string | null) {
    const libraryId = getLibraryId();
    const accessKey = getAccessKey();

    if (!libraryId || !accessKey) {
        throw new Error('Bunny.net not configured (Library/AccessKey missing).');
    }

    const body: Record<string, string> = { title };
    if (collectionId) {
        body.collectionId = collectionId;
    }

    const response = await fetch(`${BUNNY_API_BASE}/library/${libraryId}/videos`, {
        method: 'POST',
        headers: {
            'AccessKey': accessKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Bunny API error: ${err}`);
    }

    return response.json();
}

/**
 * Delete a video from the library.
 */
export async function deleteBunnyVideo(videoId: string): Promise<boolean> {
    const libraryId = getLibraryId();
    const accessKey = getAccessKey();

    if (!libraryId || !accessKey) return false;

    try {
        const response = await fetch(`${BUNNY_API_BASE}/library/${libraryId}/videos/${videoId}`, {
            method: 'DELETE',
            headers: { 'AccessKey': accessKey },
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Get collection stats (total size, video count).
 */
export async function getBunnyCollectionStats(collectionId: string) {
    const libraryId = getLibraryId();
    const accessKey = getAccessKey();

    if (!libraryId || !accessKey) return null;

    try {
        const response = await fetch(
            `${BUNNY_API_BASE}/library/${libraryId}/collections/${collectionId}`,
            { headers: { 'AccessKey': accessKey, 'Accept': 'application/json' } }
        );

        if (!response.ok) return null;
        return response.json();
    } catch {
        return null;
    }
}
