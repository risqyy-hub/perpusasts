<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class ExportController extends Controller
{
    /**
     * Export all books as an Excel file (data_buku.xlsx).
     */
    public function excel(): BinaryFileResponse
    {
        $books = Book::orderBy('kode_buku')->get();

        $path = tempnam(sys_get_temp_dir(), 'buku_');
        $path = $path ?: sys_get_temp_dir().'/buku.xlsx';

        $writer = new Writer();
        $writer->openToFile($path);

        $writer->addRow(Row::fromValues([
            'No',
            'Kode Buku',
            'Judul',
            'Penulis',
            'Kategori',
            'Tahun Terbit',
            'Penerbit',
        ]));

        foreach ($books as $index => $book) {
            $writer->addRow(Row::fromValues([
                $index + 1,
                (string) $book->kode_buku,
                (string) $book->judul,
                (string) $book->penulis,
                (string) $book->kategori,
                (int) $book->tahun_terbit,
                (string) $book->penerbit,
            ]));
        }

        $writer->close();

        return response()
            ->download($path, 'data_buku.xlsx', [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend(true);
    }

    /**
     * Export all books as a PDF report (laporan_data_buku.pdf).
     */
    public function pdf(): Response
    {
        $books = Book::orderBy('kode_buku')->get();

        $pdf = Pdf::loadView('exports.laporan_buku', [
            'books' => $books,
            'totalBooks' => $books->count(),
            'printDate' => now()->translatedFormat('d F Y'),
            'printTime' => now()->format('H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('laporan_data_buku.pdf');
    }
}
