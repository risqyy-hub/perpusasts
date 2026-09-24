<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Sortable columns whitelist.
     *
     * @var list<string>
     */
    private const SORTABLE = ['id', 'kode_buku', 'judul', 'penulis', 'kategori', 'tahun_terbit', 'penerbit'];

    /**
     * List books with real database search, filter, sort, and pagination.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $kategori = trim((string) $request->query('kategori', ''));
        $sort = (string) $request->query('sort', 'id');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->query('per_page', 10);

        if (! in_array($sort, self::SORTABLE, true)) {
            $sort = 'id';
        }

        if (! in_array($perPage, [5, 10, 25, 50], true)) {
            $perPage = 10;
        }

        $query = Book::query();

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($builder) use ($like) {
                $builder->where('kode_buku', 'like', $like)
                    ->orWhere('judul', 'like', $like)
                    ->orWhere('penulis', 'like', $like)
                    ->orWhere('penerbit', 'like', $like);
            });
        }

        if ($kategori !== '') {
            $query->where('kategori', $kategori);
        }

        $query->orderBy($sort, $direction)
            ->orderBy('id', $direction);

        $books = $query->paginate($perPage)->withQueryString();

        $categories = Book::distinct()->orderBy('kategori')->pluck('kategori')
            ->map(fn ($value) => (string) $value)
            ->values();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form to create a book.
     */
    public function create(): Response
    {
        return Inertia::render('books/create', [
            'categories' => $this->categories(),
        ]);
    }

    /**
     * Store a newly created book.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules(), $this->messages());

        Book::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Buku "'.$validated['judul'].'" berhasil ditambahkan.',
        ]);

        return redirect()->route('books.index');
    }

    /**
     * Show a single book.
     */
    public function show(Book $book): Response
    {
        return Inertia::render('books/show', [
            'book' => $book,
        ]);
    }

    /**
     * Show the form to edit a book.
     */
    public function edit(Book $book): Response
    {
        return Inertia::render('books/edit', [
            'book' => $book,
            'categories' => $this->categories(),
        ]);
    }

    /**
     * Update an existing book.
     */
    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate($this->rules($book), $this->messages());

        $book->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Buku "'.$validated['judul'].'" berhasil diperbarui.',
        ]);

        return redirect()->route('books.index');
    }

    /**
     * Delete a book.
     */
    public function destroy(Book $book): RedirectResponse
    {
        $judul = (string) $book->judul;

        $book->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Buku "'.$judul.'" berhasil dihapus.',
        ]);

        return redirect()->route('books.index');
    }

    /**
     * Validation rules, with kode_buku made unique across the table.
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
                Rule::unique('books', 'kode_buku')->ignore($book?->id),
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
            'kode_buku.max' => 'Kode buku maksimal 20 karakter.',
            'kode_buku.unique' => 'Kode buku sudah digunakan oleh buku lain.',
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 150 karakter.',
            'penulis.required' => 'Penulis wajib diisi.',
            'penulis.max' => 'Penulis maksimal 100 karakter.',
            'kategori.required' => 'Kategori wajib diisi.',
            'kategori.max' => 'Kategori maksimal 50 karakter.',
            'tahun_terbit.required' => 'Tahun terbit wajib diisi.',
            'tahun_terbit.integer' => 'Tahun terbit harus berupa angka.',
            'tahun_terbit.min' => 'Tahun terbit tidak boleh kurang dari 1900.',
            'tahun_terbit.max' => 'Tahun terbit tidak boleh lebih dari '.(now()->year + 1).'.',
            'penerbit.required' => 'Penerbit wajib diisi.',
            'penerbit.max' => 'Penerbit maksimal 100 karakter.',
        ];
    }

    /**
     * Existing categories, for select inputs.
     *
     * @return list<string>
     */
    private function categories(): array
    {
        return Book::distinct()->orderBy('kategori')->pluck('kategori')
            ->map(fn ($value) => (string) $value)
            ->values()
            ->all();
    }
}
