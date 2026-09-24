import { Head } from '@inertiajs/react';
import { BookOpen, Building2, Layers, Users } from 'lucide-react';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import StatCard from '@/components/stat-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type CategoryStat = { kategori: string; total: number };
type YearStat = { tahun: number; total: number };
type PublisherStat = { penerbit: string; total: number };

type Props = {
    totalBooks: number;
    totalCategories: number;
    totalAuthors: number;
    totalPublishers: number;
    byCategory: CategoryStat[];
    byYear: YearStat[];
    byPublisher: PublisherStat[];
};

const COLORS = [
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#dc2626',
    '#7c3aed',
    '#0891b2',
    '#db2777',
    '#65a30d',
    '#ea580c',
    '#4f46e5',
];

export default function Statistics({
    totalBooks,
    totalCategories,
    totalAuthors,
    totalPublishers,
    byCategory,
    byYear,
    byPublisher,
}: Props) {
    return (
        <>
            <Head title="Statistik" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Statistik Perpustakaan
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Visualisasi data koleksi buku
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Buku"
                        value={totalBooks}
                        icon={BookOpen}
                    />
                    <StatCard
                        title="Total Kategori"
                        value={totalCategories}
                        icon={Layers}
                    />
                    <StatCard
                        title="Total Penulis"
                        value={totalAuthors}
                        icon={Users}
                    />
                    <StatCard
                        title="Total Penerbit"
                        value={totalPublishers}
                        icon={Building2}
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Buku per Kategori</CardTitle>
                            <CardDescription>
                                Proporsi koleksi berdasarkan kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={byCategory}
                                        dataKey="total"
                                        nameKey="kategori"
                                        innerRadius={55}
                                        outerRadius={95}
                                        paddingAngle={3}
                                        label={(entry) => {
                                            const datum = (
                                                (entry as unknown as {
                                                    payload?: unknown;
                                                }).payload ?? entry
                                            ) as unknown as CategoryStat;
                                            return String(
                                                datum?.kategori ?? 'Kategori',
                                            );
                                        }}
                                    >
                                        {byCategory.map((entry, index) => (
                                            <Cell
                                                key={entry.kategori}
                                                fill={
                                                    COLORS[index % COLORS.length]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle>Buku per Tahun Terbit</CardTitle>
                            <CardDescription>
                                Jumlah judul yang terbit setiap tahun
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={byYear}>
                                    <XAxis
                                        dataKey="tahun"
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
                                        fill="#16a34a"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Penerbit Teratas</CardTitle>
                        <CardDescription>
                            10 penerbit dengan judul buku terbanyak
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/40 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            No
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Penerbit
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Jumlah Buku
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {byPublisher.map((publisher, index) => (
                                        <tr
                                            key={publisher.penerbit}
                                            className="hover:bg-muted/40"
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {publisher.penerbit}
                                            </td>
                                            <td className="px-4 py-3">
                                                {publisher.total}
                                            </td>
                                        </tr>
                                    ))}

                                    {byPublisher.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada data penerbit.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Statistics.layout = {
    breadcrumbs: [{ title: 'Statistik', href: '/statistics' }],
};
