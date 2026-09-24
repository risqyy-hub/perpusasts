<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Data Buku Perpustakaan</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #111827;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #111827;
            padding-bottom: 10px;
            margin-bottom: 14px;
        }

        .header h1 {
            font-size: 16px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .meta {
            width: 100%;
            margin-bottom: 14px;
        }

        .meta td {
            padding: 2px 0;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
        }

        table.data th,
        table.data td {
            border: 1px solid #6b7280;
            padding: 5px 6px;
            text-align: left;
            font-size: 10px;
        }

        table.data th {
            background-color: #e5e7eb;
            font-weight: bold;
        }

        table.data tr:nth-child(even) td {
            background-color: #f9fafb;
        }

        .footer {
            margin-top: 16px;
            font-size: 9px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN DATA BUKU PERPUSTAKAAN</h1>
    </div>

    <table class="meta">
        <tr>
            <td width="120">Tanggal Cetak</td>
            <td width="10">:</td>
            <td>{{ $printDate }} {{ $printTime }} WIB</td>
        </tr>
        <tr>
            <td>Total Buku</td>
            <td>:</td>
            <td>{{ $totalBooks }} judul</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th width="30">No</th>
                <th width="70">Kode Buku</th>
                <th>Judul</th>
                <th width="110">Penulis</th>
                <th width="80">Kategori</th>
                <th width="55">Tahun</th>
                <th width="100">Penerbit</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($books as $index => $book)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $book->kode_buku }}</td>
                    <td>{{ $book->judul }}</td>
                    <td>{{ $book->penulis }}</td>
                    <td>{{ $book->kategori }}</td>
                    <td>{{ $book->tahun_terbit }}</td>
                    <td>{{ $book->penerbit }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Belum ada data buku.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dicetak dari sistem PERPUS API &mdash; Sistem Data Buku Perpustakaan
    </div>
</body>
</html>
