import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, BookOpen, CalendarClock, Layers, Users } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import StatCard from '@/components/stat-card';

type Book = {
    id: number;
    kode_buku: string;
    judul: string;
    penulis: string;
    kategori: string;
    tahun_terbit: number;
    penerbit: string;
};

type CategoryStat = {
    kategori: string;
    total: number;
};

type DashboardProps = {
    totalBooks: number;
    totalCategories: number;
    totalAuthors: number;
    latestYear: number | null;
    categoryStats: CategoryStat[];
    latestBooks: Book[];
};

export default function Dashboard({
    totalBooks,
    totalCategories,
    totalAuthors,
    latestYear,
    categoryStats,
    latestBooks,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ringkasan data perpustakaan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/books/create">
                            Tambah Buku Baru
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Buku"
                        value={totalBooks}
                        icon={BookOpen}
                        hint="Seluruh judul tersimpan"
                    />
                    <StatCard
                        title="Kategori"
                        value={totalCategories}
                        icon={Layers}
                        hint="Kategori unik"
                    />
                    <StatCard
                        title="Penulis"
                        value={totalAuthors}
                        icon={Users}
                        hint="Penulis unik"
                    />
                    <StatCard
                        title="Tahun Terbit Terbaru"
                        value={latestYear ?? '-'}
                        icon={CalendarClock}
                        hint="Tahun terjauh"
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-5">
                    <Card className="rounded-2xl shadow-sm xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Distribusi Kategori</CardTitle>
                            <CardDescription>
                                Jumlah buku per kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryStats}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="kategori"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        width={30}
                                    />
                                    <Tooltip />
                                    <Bar
                                        dataKey="total"
                                        name="Buku"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm xl:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Buku Terbaru</CardTitle>
                                <CardDescription>
                                    5 data buku terakhir
                                </CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/books">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-y bg-muted/40 text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">
                                                Kode
                                            </th>
                                            <th className="px-6 py-3 font-medium">
                                                Judul
                                            </th>
                                            <th className="px-6 py-3 font-medium">
                                                Penulis
                                            </th>
                                            <th className="px-6 py-3 font-medium">
                                                Kategori
                                            </th>
                                            <th className="px-6 py-3 font-medium">
                                                Tahun
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {latestBooks.map((book) => (
                                            <tr
                                                key={book.id}
                                                className="transition-colors hover:bg-muted/40"
                                                data-test="latest-book-row"
                                            >
                                                <td className="px-6 py-3 font-medium whitespace-nowrap">
                                                    {book.kode_buku}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <Link
                                                        href={`/books/${book.id}`}
                                                        className="hover:text-blue-600 hover:underline"
                                                    >
                                                        {book.judul}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-3">
                                                    {book.penulis}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-full"
                                                    >
                                                        {book.kategori}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3">
                                                    {book.tahun_terbit}
                                                </td>
                                            </tr>
                                        ))}

                                        {latestBooks.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-10 text-center text-muted-foreground"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <BarChart3 className="size-8 opacity-60" />
                                                        Belum ada data buku.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
