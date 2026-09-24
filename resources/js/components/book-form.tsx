import { Link, useForm } from '@inertiajs/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export type BookPayload = {
    kode_buku: string;
    judul: string;
    penulis: string;
    kategori: string;
    tahun_terbit: string;
    penerbit: string;
};

type LocalErrors = Partial<Record<keyof BookPayload, string>>;

type Props = {
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
    book?: Partial<BookPayload>;
    categories?: string[];
};

const fieldClass = 'mt-1';

export default function BookForm({
    action,
    method,
    submitLabel,
    book,
    categories = [],
}: Props) {
    const [localErrors, setLocalErrors] = useState<LocalErrors>({});

    const { data, setData, processing, errors: serverErrors, submit } =
        useForm<BookPayload>({
            kode_buku: book?.kode_buku ?? '',
            judul: book?.judul ?? '',
            penulis: book?.penulis ?? '',
            kategori: book?.kategori ?? '',
            tahun_terbit: book?.tahun_terbit ? String(book.tahun_terbit) : '',
            penerbit: book?.penerbit ?? '',
        });

    const errors: LocalErrors = { ...serverErrors, ...localErrors };

    const update =
        (field: keyof BookPayload) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            setData(field, event.target.value);
            setLocalErrors((previous) => ({ ...previous, [field]: undefined }));
        };

    const validate = (): LocalErrors => {
        const next: LocalErrors = {};
        const currentYear = new Date().getFullYear() + 1;

        const required = (field: keyof BookPayload, label: string, max: number) => {
            const value = data[field].trim();

            if (value === '') {
                next[field] = `${label} wajib diisi.`;
            } else if (value.length > max) {
                next[field] = `${label} maksimal ${max} karakter.`;
            }
        };

        required('kode_buku', 'Kode buku', 20);
        required('judul', 'Judul', 150);
        required('penulis', 'Penulis', 100);
        required('kategori', 'Kategori', 50);
        required('penerbit', 'Penerbit', 100);

        const year = data.tahun_terbit.trim();

        if (year === '') {
            next.tahun_terbit = 'Tahun terbit wajib diisi.';
        } else if (!/^\d{4}$/.test(year)) {
            next.tahun_terbit = 'Tahun terbit harus 4 digit angka.';
        } else {
            const parsed = Number(year);

            if (parsed < 1900 || parsed > currentYear) {
                next.tahun_terbit = `Tahun terbit antara 1900 - ${currentYear}.`;
            }
        }

        return next;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const next = validate();
        setLocalErrors(next);

        if (Object.keys(next).length > 0) {
            return;
        }

        submit(method, action);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="kode_buku">Kode Buku</Label>
                    <Input
                        id="kode_buku"
                        name="kode_buku"
                        value={data.kode_buku}
                        onChange={update('kode_buku')}
                        className={fieldClass}
                        placeholder="cth. BK001"
                        maxLength={20}
                        required
                        autoFocus
                        data-test="input-kode-buku"
                    />
                    <InputError message={errors.kode_buku} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tahun_terbit">Tahun Terbit</Label>
                    <Input
                        id="tahun_terbit"
                        name="tahun_terbit"
                        type="number"
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        value={data.tahun_terbit}
                        onChange={update('tahun_terbit')}
                        className={fieldClass}
                        placeholder="cth. 2018"
                        required
                        data-test="input-tahun-terbit"
                    />
                    <InputError message={errors.tahun_terbit} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="judul">Judul Buku</Label>
                <Input
                    id="judul"
                    name="judul"
                    value={data.judul}
                    onChange={update('judul')}
                    className={fieldClass}
                    placeholder="cth. Laskar Pelangi"
                    maxLength={150}
                    required
                    data-test="input-judul"
                />
                <InputError message={errors.judul} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="penulis">Penulis</Label>
                    <Input
                        id="penulis"
                        name="penulis"
                        value={data.penulis}
                        onChange={update('penulis')}
                        className={fieldClass}
                        placeholder="cth. Andrea Hirata"
                        maxLength={100}
                        required
                        data-test="input-penulis"
                    />
                    <InputError message={errors.penulis} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="penerbit">Penerbit</Label>
                    <Input
                        id="penerbit"
                        name="penerbit"
                        value={data.penerbit}
                        onChange={update('penerbit')}
                        className={fieldClass}
                        placeholder="cth. Bentang Pustaka"
                        maxLength={100}
                        required
                        data-test="input-penerbit"
                    />
                    <InputError message={errors.penerbit} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input
                    id="kategori"
                    name="kategori"
                    list="kategori-options"
                    value={data.kategori}
                    onChange={update('kategori')}
                    className={fieldClass}
                    placeholder="cth. Novel"
                    maxLength={50}
                    required
                    data-test="input-kategori"
                />
                <datalist id="kategori-options">
                    {categories.map((category) => (
                        <option key={category} value={category} />
                    ))}
                </datalist>
                <InputError message={errors.kategori} />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t pt-5">
                <Button
                    type="submit"
                    disabled={processing}
                    data-test="submit-book-button"
                >
                    {processing && <Spinner />}
                    {submitLabel}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href="/books">Batal</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                    Data divalidasi di sisi klien &amp; server.
                </p>
            </div>
        </form>
    );
}
