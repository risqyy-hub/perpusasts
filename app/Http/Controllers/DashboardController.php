<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard with statistics, chart data, and latest books.
     */
    public function index(): Response
    {
        $categoryStats = Book::select('kategori', DB::raw('COUNT(*) as total'))
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->orderBy('kategori')
            ->get()
            ->map(fn (Book $book) => [
                'kategori' => (string) $book->kategori,
                'total' => (int) $book->total,
            ])
            ->values();

        return Inertia::render('dashboard', [
            'totalBooks' => Book::count(),
            'totalCategories' => Book::distinct()->count('kategori'),
            'totalAuthors' => Book::distinct()->count('penulis'),
            'latestYear' => Book::max('tahun_terbit'),
            'categoryStats' => $categoryStats,
            'latestBooks' => Book::orderByDesc('id')->take(5)->get()->map(fn (Book $book) => [
                'id' => $book->id,
                'kode_buku' => (string) $book->kode_buku,
                'judul' => (string) $book->judul,
                'penulis' => (string) $book->penulis,
                'kategori' => (string) $book->kategori,
                'tahun_terbit' => (int) $book->tahun_terbit,
                'penerbit' => (string) $book->penerbit,
            ]),
        ]);
    }
}
