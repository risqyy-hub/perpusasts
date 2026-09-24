import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Book = {
    id: number;
    kode_buku: string;
    judul: string;
    penulis: string;
    kategori: string;
    tahun_terbit: number;
    penerbit: string;
};

type Props = {
    book: Book;
};

const fields: { label: keyof Book; labelId: string }[] = [
    { label: 'kode_buku', labelId: 'Kode Buku' },
    { label: 'penulis', labelId: 'Penulis' },
    { label: 'kategori', labelId: 'Kategori' },
    { label: 'tahun_terbit', labelId: 'Tahun Terbit' },
    { label: 'penerbit', labelId: 'Penerbit' },
];

export default function BookShow({ book }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/books/${book.id}`, {
            onFinish: () => {
                setDeleting(false);
                setConfirmOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={`Detail ${book.judul}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Detail Buku
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Informasi lengkap koleksi perpustakaan
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/books">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href={`/books/${book.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit Buku
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmOpen(true)}
                            data-test="delete-detail-button"
                        >
                            <Trash2 className="size-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="rounded-full">
                                {book.kategori}
                            </Badge>
                            <span className="font-mono text-sm text-muted-foreground">
                                {book.kode_buku}
                            </span>
                        </div>
                        <CardTitle className="text-xl">
                            {book.judul}
                        </CardTitle>
                        <CardDescription>
                            Karya {book.penulis}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                            {fields.map((field) => (
                                <div
                                    key={field.label}
                                    className="flex flex-col gap-1 border-b pb-3"
                                >
                                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                                        {field.labelId}
                                    </dt>
                                    <dd
                                        className="font-medium"
                                        data-test={`detail-${field.label}`}
                                    >
                                        {String(book[field.label])}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Hapus Buku"
                message="Apakah Anda yakin ingin menghapus buku ini?"
                confirmLabel="Hapus"
                cancelLabel="Batal"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}

BookShow.layout = {
    breadcrumbs: [
        { title: 'Data Buku', href: '/books' },
        { title: 'Detail Buku', href: '/books/detail' },
    ],
};
