/**
 * Download a binary export (Excel / PDF) via fetch so the current page can
 * show a toast notification instead of navigating away.
 */
export async function downloadFile(url: string): Promise<string> {
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
            Accept: '*/*',
        },
    });

    if (!response.ok) {
        throw new Error(`Export gagal (HTTP ${response.status}).`);
    }

    const disposition = response.headers.get('Content-Disposition') ?? '';
    const match = /filename="?([^";]+)"?/i.exec(disposition);
    const filename = match?.[1] ?? 'export';

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = decodeURIComponent(filename);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);

    return filename;
}
