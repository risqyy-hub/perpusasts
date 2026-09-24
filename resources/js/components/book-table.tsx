import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, BookOpen, Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Book = {
    id: number;
    kode_buku: string;
    judul: string;
    penulis: string;
    kategori: string;
    tahun_terbit: number;
    penerbit: string;
};

export type SortableColumn =
    | 'kode_buku'
    | 'judul'
    | 'penulis'
    | 'kategori'
    | 'tahun_terbit'
    | 'penerbit';

type Props = {
    books: Book[];
    sort: string;
    direction: 'asc' | 'desc';
    startNo: number;
    loading?: boolean;
    onSort: (column: SortableColumn) => void;
    onDelete: (book: Book) => void;
};

const columns: { key: SortableColumn; label: string }[] = [
    { key: 'kode_buku', label: 'Kode Buku' },
    { key: 'judul', label: 'Judul' },
    { key: 'penulis', label: 'Penulis' },
    { key: 'kategori', label: 'Kategori' },
    { key: 'tahun_terbit', label: 'Tahun' },
    { key: 'penerbit', label: 'Penerbit' },
];

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
    if (!active) {
        return <ArrowUpDown className="size-3 opacity-40" />;
    }

    return direction === 'asc' ? (
        <ArrowUp className="size-3 text-blue-600" />
    ) : (
        <ArrowDown className="size-3 text-blue-600" />
    );
}

export default function BookTable({
    books,
    sort,
    direction,
    startNo,
    loading = false,
    onSort,
    onDelete,
}: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">No</th>
                        {columns.map((column) => (
                            <th key={column.key} className="px-4 py-3 font-medium">
                                <button
                                    type="button"
                                    onClick={() => onSort(column.key)}
                                    className="inline-flex cursor-pointer items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    data-test={`sort-${column.key}`}
                                >
                                    {column.label}
                                    <SortIcon
                                        active={sort === column.key}
                                        direction={direction}
                                    />
                                </button>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {loading && (
                        <>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr key={`skeleton-${index}`}>
                                    <td className="px-4 py-4">
                                        <div className="h-4 w-6 animate-pulse rounded bg-muted" />
                                    </td>
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-4">
                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        </td>
                                    ))}
                                    <td className="px-4 py-4">
                                        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
                                    </td>
                                </tr>
                            ))}
                        </>
                    )}

                    {!loading &&
                        books.map((book, index) => (
                            <tr
                                key={book.id}
                                className="transition-colors hover:bg-muted/40"
                                data-test="book-row"
                            >
                                <td className="px-4 py-3 text-muted-foreground">
                                    {startNo + index}
                                </td>
                                <td className="px-4 py-3 font-medium whitespace-nowrap">
                                    {book.kode_buku}
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/books/${book.id}`}
                                        className="font-medium hover:text-blue-600 hover:underline"
                                    >
                                        {book.judul}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">{book.penulis}</td>
                                <td className="px-4 py-3">
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full"
                                    >
                                        {book.kategori}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {book.tahun_terbit}
                                </td>
                                <td className="px-4 py-3">{book.penerbit}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            title="Lihat detail"
                                        >
                                            <Link href={`/books/${book.id}`}>
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            title="Edit buku"
                                        >
                                            <Link href={`/books/${book.id}/edit`}>
                                                <Pencil className="size-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-red-600 hover:text-red-700"
                                            title="Hapus buku"
                                            onClick={() => onDelete(book)}
                                            data-test="delete-book-button"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    {!loading && books.length === 0 && (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-4 py-14 text-center"
                            >
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <BookOpen className="size-9 opacity-60" />
                                    <p className="font-medium text-foreground">
                                        Tidak ada data buku.
                                    </p>
                                    <p className="text-sm">
                                        Coba ubah kata kunci pencarian atau
                                        filter kategori.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>

                <tfoot className={cn('border-t bg-muted/20')}>
                    <tr>
                        <td
                            colSpan={8}
                            className="px-4 py-2 text-xs text-muted-foreground"
                        >
                            Klik judul kolom untuk mengurutkan data.
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
