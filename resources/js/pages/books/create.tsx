import { Head } from '@inertiajs/react';
import BookForm from '@/components/book-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    categories: string[];
};

export default function BookCreate({ categories }: Props) {
    return (
        <>
            <Head title="Tambah Buku" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Tambah Buku
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tambahkan judul baru ke koleksi perpustakaan
                    </p>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Formulir Buku Baru</CardTitle>
                        <CardDescription>
                            Lihat pratinjau kategori yang sudah ada pada kolom
                            kategori.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BookForm
                            action="/books"
                            method="post"
                            submitLabel="Simpan Buku"
                            categories={categories}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BookCreate.layout = {
    breadcrumbs: [
        { title: 'Data Buku', href: '/books' },
        { title: 'Tambah Buku', href: '/books/create' },
    ],
};
