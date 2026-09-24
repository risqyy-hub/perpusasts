<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the admin profile page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('profile', [
            'user' => [
                'id' => (int) $user?->id,
                'username' => (string) $user?->username,
            ],
        ]);
    }

    /**
     * Update the admin username and/or password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-Z0-9_.]+$/',
                Rule::unique('admins', 'username')->ignore($user->id),
            ],
            'current_password' => ['required', 'string'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ], [
            'username.required' => 'Username wajib diisi.',
            'username.min' => 'Username minimal 3 karakter.',
            'username.max' => 'Username maksimal 50 karakter.',
            'username.regex' => 'Username hanya boleh berisi huruf, angka, titik, dan underscore.',
            'username.unique' => 'Username sudah digunakan.',
            'current_password.required' => 'Password saat ini wajib diisi.',
            'current_password' => 'Password saat ini tidak sesuai.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        if (! Hash::check($validated['current_password'], (string) $user->password)) {
            return back()->withErrors([
                'current_password' => 'Password saat ini tidak sesuai.',
            ]);
        }

        $user->username = $validated['username'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil berhasil diperbarui.',
        ]);

        return redirect()->route('profile');
    }
}
