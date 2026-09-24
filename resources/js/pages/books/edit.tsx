import { Head } from '@inertiajs/react';
import BookForm, { type BookPayload } from '@/components/book-form';
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
    categories: string[];
};

export default function BookEdit({ book, categories }: Props) {
    const initial: BookPayload = {
        kode_buku: book.kode_buku,
        judul: book.judul,
        penulis: book.penulis,
        kategori: book.kategori,
        tahun_terbit: String(book.tahun_terbit),
        penerbit: book.penerbit,
    };

    return (
        <>
            <Head title={`Edit ${book.judul}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Buku
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data buku dengan kode {book.kode_buku}
                    </p>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Formulir Edit Buku</CardTitle>
                        <CardDescription>
                            Kode buku harus unik di seluruh koleksi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BookForm
                            action={`/books/${book.id}`}
                            method="put"
                            submitLabel="Perbarui Buku"
                            book={initial}
                            categories={categories}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BookEdit.layout = {
    breadcrumbs: [
        { title: 'Data Buku', href: '/books' },
        { title: 'Edit Buku', href: '/books/edit' },
    ],
};
