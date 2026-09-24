<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookApiController extends Controller
{
    /**
     * GET /api/books — list every book (supports ?search=).
     */
    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));

        $query = Book::query()->orderBy('kode_buku');

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($builder) use ($like) {
                $builder->where('kode_buku', 'like', $like)
                    ->orWhere('judul', 'like', $like)
                    ->orWhere('penulis', 'like', $like);
            });
        }

        return response()->json([
            'success' => true,
            'total' => $query->count(),
            'data' => $query->get(),
        ]);
    }

    /**
     * GET /api/books/{id} — show one book.
     */
    public function show(int $id): JsonResponse
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    /**
     * POST /api/books — create a book.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules(), $this->messages());

        $book = Book::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan.',
            'data' => $book,
        ], 201);
    }

    /**
     * PUT /api/books/{id} — update a book.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate($this->rules($book), $this->messages());

        $book->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diperbarui.',
            'data' => $book->fresh(),
        ]);
    }

    /**
     * DELETE /api/books/{id} — delete a book.
     */
    public function destroy(int $id): JsonResponse
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dihapus.',
        ]);
    }

    /**
     * Validation rules for create / update.
     *
     * @return array<string, list<string>|\Illuminate\Validation\Rules\Unique>
     */
    private function rules(?Book $book = null): array
    {
        return [
            'kode_buku' => [
                'required',
                'string',
                'max:20',
                \Illuminate\Validation\Rule::unique('books', 'kode_buku')->ignore($book?->id),
            ],
            'judul' => ['required', 'string', 'max:150'],
            'penulis' => ['required', 'string', 'max:100'],
            'kategori' => ['required', 'string', 'max:50'],
            'tahun_terbit' => ['required', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'penerbit' => ['required', 'string', 'max:100'],
        ];
    }

    /**
     * Indonesian validation messages.
     *
     * @return array<string, string>
     */
    private function messages(): array
    {
        return [
            'kode_buku.required' => 'Kode buku wajib diisi.',
            'kode_buku.unique' => 'Kode buku sudah digunakan oleh buku lain.',
            'judul.required' => 'Judul wajib diisi.',
            'penulis.required' => 'Penulis wajib diisi.',
            'kategori.required' => 'Kategori wajib diisi.',
            'tahun_terbit.required' => 'Tahun terbit wajib diisi.',
            'tahun_terbit.integer' => 'Tahun terbit harus berupa angka.',
            'penerbit.required' => 'Penerbit wajib diisi.',
        ];
    }
}
