import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { FileDown, FileText, PlusCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import BookTable, {
    type Book,
    type SortableColumn,
} from '@/components/book-table';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { downloadFile } from '@/lib/export';

type Filters = {
    search: string;
    kategori: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type Props = {
    books: Paginated<Book>;
    categories: string[];
    filters: Filters;
};

export default function BooksIndex({ books, categories, filters }: Props) {
    const [searchInput, setSearchInput] = useState(filters.search);
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    const applyFilters = (overrides: Partial<Filters>) => {
        const merged = { ...filters, ...overrides };
        const query: Record<string, string> = {
            sort: merged.sort,
            direction: merged.direction,
            per_page: String(merged.per_page),
        };

        if (merged.search.trim() !== '') {
            query.search = merged.search.trim();
        }

        if (merged.kategori !== '') {
            query.kategori = merged.kategori;
        }

        setLoading(true);
        router.get('/books', query, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        applyFilters({ search: searchInput });
    };

    const handleSort = (column: SortableColumn) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        applyFilters({ sort: column, direction });
    };

    const goToPage = (url: string) => {
        setLoading(true);
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(`/books/${deleteTarget.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const handleExport = (href: string, title: string) => {
        void toast.promise(downloadFile(href), {
            loading: `Menyiapkan ${title}...`,
            success: (filename: string) => `${filename} berhasil diunduh.`,
            error: (error: unknown) =>
                error instanceof Error
                    ? error.message
                    : `${title} gagal diunduh.`,
        });
    };

    return (
        <>
            <Head title="Data Buku" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Buku
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola seluruh koleksi buku perpustakaan
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handleExport('/export/excel', 'Export Excel')
                            }
                            data-test="export-excel-button"
                        >
                            <FileDown className="size-4" />
                            Export Excel
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handleExport('/export/pdf', 'Export PDF')
                            }
                            data-test="export-pdf-button"
                        >
                            <FileText className="size-4" />
                            Export PDF
                        </Button>
                        <Button asChild size="sm" data-test="add-book-button">
                            <Link href="/books/create">
                                <PlusCircle className="size-4" />
                                Tambah Buku
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-1 min-w-56 items-center gap-2"
                        data-test="search-form"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                placeholder="Cari kode, judul, penulis, penerbit..."
                                className="pl-9"
                                data-test="search-input"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={loading}
                            data-test="search-button"
                        >
                            {loading && <Spinner />}
                            Cari
                        </Button>
                    </form>

                    <Select
                        value={filters.kategori || 'all'}
                        onValueChange={(value) =>
                            applyFilters({
                                kategori: value === 'all' ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger
                            className="w-44"
                            data-test="filter-kategori"
                        >
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={String(filters.per_page)}
                        onValueChange={(value) =>
                            applyFilters({ per_page: Number(value) })
                        }
                    >
                        <SelectTrigger
                            className="w-40"
                            data-test="filter-per-page"
                        >
                            <SelectValue placeholder="Per halaman" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size} / halaman
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-medium text-foreground">
                                {books.from ?? 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-medium text-foreground">
                                {books.to ?? 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-medium text-foreground">
                                {books.total}
                            </span>{' '}
                            buku
                        </p>
                        {loading && (
                            <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Spinner className="size-3.5" />
                                Memuat data...
                            </span>
                        )}
                    </div>

                    <BookTable
                        books={books.data}
                        sort={filters.sort}
                        direction={filters.direction}
                        startNo={books.from ?? 1}
                        loading={loading}
                        onSort={handleSort}
                        onDelete={setDeleteTarget}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
                        <p className="text-sm text-muted-foreground">
                            Halaman{' '}
                            <span className="font-medium text-foreground">
                                {books.current_page}
                            </span>{' '}
                            dari{' '}
                            <span className="font-medium text-foreground">
                                {books.last_page}
                            </span>
                        </p>

                        <nav
                            className="flex flex-wrap items-center gap-1"
                            aria-label="Navigasi halaman"
                            data-test="pagination"
                        >
                            {books.links.map((link, index) => (
                                <Button
                                    key={`${link.label}-${index}`}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="min-w-9 px-2"
                                    disabled={!link.url || loading}
                                    onClick={() =>
                                        link.url && goToPage(link.url)
                                    }
                                    data-test="pagination-link"
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                title="Hapus Buku"
                message="Apakah Anda yakin ingin menghapus buku ini?"
                confirmLabel="Hapus"
                cancelLabel="Batal"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
}

BooksIndex.layout = {
    breadcrumbs: [{ title: 'Data Buku', href: '/books' }],
};
