import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    user: {
        id: number;
        username: string;
    };
};

type ProfilePayload = {
    username: string;
    current_password: string;
    password: string;
    password_confirmation: string;
};

type LocalErrors = Partial<Record<keyof ProfilePayload, string>>;

export default function Profile({ user }: Props) {
    const [localErrors, setLocalErrors] = useState<LocalErrors>({});

    const { data, setData, put, processing, errors: serverErrors, reset } =
        useForm<ProfilePayload>({
            username: user.username,
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const errors: LocalErrors = { ...serverErrors, ...localErrors };

    const update = (field: keyof ProfilePayload, value: string) => {
        setData(field, value);
        setLocalErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const validate = (): LocalErrors => {
        const next: LocalErrors = {};

        if (data.username.trim() === '') {
            next.username = 'Username wajib diisi.';
        } else if (data.username.trim().length < 3) {
            next.username = 'Username minimal 3 karakter.';
        } else if (data.username.trim().length > 50) {
            next.username = 'Username maksimal 50 karakter.';
        }

        if (data.current_password === '') {
            next.current_password = 'Password saat ini wajib diisi.';
        }

        if (data.password !== '') {
            if (data.password.length < 8) {
                next.password = 'Password baru minimal 8 karakter.';
            }

            if (data.password !== data.password_confirmation) {
                next.password_confirmation =
                    'Konfirmasi password baru tidak cocok.';
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

        put('/profile', {
            preserveScroll: true,
            onSuccess: () =>
                reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Profil Saya" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Profil Saya
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola akun administrator perpustakaan
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="rounded-2xl shadow-sm lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Informasi Akun</CardTitle>
                            <CardDescription>
                                Detail akun yang sedang masuk
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-3 text-center">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-xl">
                                    {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">
                                    {user.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Administrator
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                                <ShieldCheck className="size-3.5" />
                                Password tersimpan ter-hash (bcrypt)
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Ubah Profil</CardTitle>
                            <CardDescription>
                                Ganti username atau kata sandi. Kosongkan field
                                password bila tidak ingin mengubahnya.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                                noValidate
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="username">
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <UserRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            name="username"
                                            value={data.username}
                                            onChange={(event) =>
                                                update(
                                                    'username',
                                                    event.target.value,
                                                )
                                            }
                                            className="pl-9"
                                            autoComplete="username"
                                            maxLength={50}
                                            required
                                            data-test="input-profile-username"
                                        />
                                    </div>
                                    <InputError message={errors.username} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Password Saat Ini
                                    </Label>
                                    <div className="relative">
                                        <PasswordInput
                                            id="current_password"
                                            name="current_password"
                                            value={data.current_password}
                                            onChange={(event) =>
                                                update(
                                                    'current_password',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="current-password"
                                            placeholder="Wajib untuk menyimpan perubahan"
                                            data-test="input-current-password"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Password Baru
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(event) =>
                                                update(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                            placeholder="Biarkan kosong jika tidak diganti"
                                            data-test="input-new-password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi Password Baru
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(event) =>
                                                update(
                                                    'password_confirmation',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                            placeholder="Ulangi password baru"
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t pt-5">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="save-profile-button"
                                    >
                                        {processing && <Spinner />}
                                        <KeyRound className="size-4" />
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [{ title: 'Profil', href: '/profile' }],
};
