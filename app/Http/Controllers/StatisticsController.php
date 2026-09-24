<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    /**
     * Show library statistics used by the charts and summary tables.
     */
    public function index(): Response
    {
        $byCategory = Book::select('kategori', DB::raw('COUNT(*) as total'))
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->orderBy('kategori')
            ->get()
            ->map(fn ($row) => [
                'kategori' => (string) $row->kategori,
                'total' => (int) $row->total,
            ])
            ->values();

        $byYear = Book::select('tahun_terbit', DB::raw('COUNT(*) as total'))
            ->groupBy('tahun_terbit')
            ->orderBy('tahun_terbit')
            ->get()
            ->map(fn ($row) => [
                'tahun' => (int) $row->tahun_terbit,
                'total' => (int) $row->total,
            ])
            ->values();

        $byPublisher = Book::select('penerbit', DB::raw('COUNT(*) as total'))
            ->groupBy('penerbit')
            ->orderByDesc('total')
            ->orderBy('penerbit')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'penerbit' => (string) $row->penerbit,
                'total' => (int) $row->total,
            ])
            ->values();

        return Inertia::render('statistics', [
            'totalBooks' => Book::count(),
            'totalCategories' => Book::distinct()->count('kategori'),
            'totalAuthors' => Book::distinct()->count('penulis'),
            'totalPublishers' => Book::distinct()->count('penerbit'),
            'byCategory' => $byCategory,
            'byYear' => $byYear,
            'byPublisher' => $byPublisher,
        ]);
    }
}
