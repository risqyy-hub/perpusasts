import { Head } from '@inertiajs/react';
import { Play, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    totalBooks: number;
};

type Endpoint = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
};

const endpoints: Endpoint[] = [
    {
        method: 'GET',
        path: '/api/books',
        description: 'Ambil seluruh daftar buku (opsional ?search=)',
    },
    {
        method: 'GET',
        path: '/api/books/{id}',
        description: 'Ambil detail satu buku berdasarkan ID',
    },
    {
        method: 'POST',
        path: '/api/books',
        description: 'Tambah buku baru (JSON body)',
    },
    {
        method: 'PUT',
        path: '/api/books/{id}',
        description: 'Perbarui data buku (JSON body)',
    },
    {
        method: 'DELETE',
        path: '/api/books/{id}',
        description: 'Hapus buku berdasarkan ID',
    },
];

const methodClass: Record<Endpoint['method'], string> = {
    GET: 'bg-emerald-600 text-white',
    POST: 'bg-blue-600 text-white',
    PUT: 'bg-amber-500 text-white',
    DELETE: 'bg-red-600 text-white',
};

const sampleBody = `{
    "kode_buku": "BK011",
    "judul": "Bumi Manusia",
    "penulis": "Pramoedya Ananta Toer",
    "kategori": "Novel",
    "tahun_terbit": 1980,
    "penerbit": "Hasta Mitra"
}`;

const sampleResponse = `{
    "success": true,
    "data": [
        {
            "id": 1,
            "kode_buku": "BK001",
            "judul": "Laskar Pelangi",
            "penulis": "Andrea Hirata",
            "kategori": "Novel",
            "tahun_terbit": 2005,
            "penerbit": "Bentang Pustaka"
        }
    ]
}`;

export default function ApiPage({ totalBooks }: Props) {
    const resolvedBase =
        typeof window !== 'undefined'
            ? `${window.location.origin}/api`
            : 'http://localhost:8000/api';

    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testEndpoint = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/books', {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`Server merespon HTTP ${response.status}.`);
            }

            const json: unknown = await response.json();
            setResult(JSON.stringify(json, null, 2));
            toast.success('Berhasil mengambil data dari API.');
        } catch (caught) {
            const message =
                caught instanceof Error
                    ? caught.message
                    : 'Gagal memanggil API.';
            setError(message);
            toast.error('Gagal memanggil API.');
        } finally {
            setLoading(false);
        }
    };

    // No state needed beyond result/loading/error.

    return (
        <>
            <Head title="REST API" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        REST API Buku
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Endpoint JSON untuk mengelola data buku secara
                        terprogram
                    </p>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Base URL</CardTitle>
                        <CardDescription>
                            Semua endpoint mengembalikan respons JSON.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <code className="block rounded-lg bg-muted px-4 py-3 text-sm break-all">
                            {resolvedBase}
                        </code>
                        <p className="text-sm text-muted-foreground">
                            Total buku saat ini:{' '}
                            <span className="font-medium text-foreground">
                                {totalBooks}
                            </span>{' '}
                            judul.
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Endpoint</CardTitle>
                        <CardDescription>
                            Metode, path, dan deskripsi endpoint yang tersedia
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/40 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Metode
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Path
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Deskripsi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {endpoints.map((endpoint) => (
                                        <tr
                                            key={`${endpoint.method}-${endpoint.path}`}
                                            className="hover:bg-muted/40"
                                            data-test="api-endpoint-row"
                                        >
                                            <td className="px-4 py-3">
                                                <Badge
                                                    className={`rounded-md font-mono ${methodClass[endpoint.method]}`}
                                                >
                                                    {endpoint.method}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {endpoint.path}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {endpoint.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Contoh Request Body</CardTitle>
                            <CardDescription>
                                POST / PUT /api/books
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-emerald-300">
                                {sampleBody}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Contoh Respons</CardTitle>
                            <CardDescription>
                                GET /api/books (200 OK)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-sky-300">
                                {sampleResponse}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Uji Coba Endpoint</CardTitle>
                            <CardDescription>
                                Panggil GET /api/books langsung dari browser
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => void testEndpoint()}
                            disabled={loading}
                            data-test="api-test-button"
                        >
                            {loading ? (
                                <RefreshCw className="size-4 animate-spin" />
                            ) : (
                                <Play className="size-4" />
                            )}
                            {loading ? 'Memuat...' : 'Ambil Data Buku'}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {error && (
                            <p
                                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                                data-test="api-error"
                            >
                                {error}
                            </p>
                        )}

                        {loading && !result && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Spinner />
                                Memanggil API...
                            </div>
                        )}

                        {result && (
                            <pre
                                className="max-h-96 overflow-auto rounded-lg bg-neutral-900 p-4 text-xs text-emerald-300"
                                data-test="api-result"
                            >
                                {result}
                            </pre>
                        )}

                        {!result && !error && !loading && (
                            <p className="text-sm text-muted-foreground">
                                Belum ada hasil. Klik tombol untuk mencoba API.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ApiPage.layout = {
    breadcrumbs: [{ title: 'API', href: '/api' }],
};
