<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Book extends Model
{
    protected $table = 'books';

    protected $fillable = [
        'kode_buku',
        'judul',
        'penulis',
        'kategori',
        'tahun_terbit',
        'penerbit',
        'cover',
    ];

    /**
     * The table does not have timestamp columns.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Attributes appended to every serialization (web + API JSON).
     *
     * @var list<string>
     */
    protected $appends = ['cover_url'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tahun_terbit' => 'integer',
        ];
    }

    /**
     * Resolve the cover into a browser-usable URL.
     *
     * Stores may contain a relative path (covers/xyz.jpg) or a full URL
     * supplied through the JSON API.
     */
    public function getCoverUrlAttribute(): ?string
    {
        $cover = $this->cover;

        if ($cover === null || $cover === '') {
            return null;
        }

        if (str_starts_with($cover, 'http://')
            || str_starts_with($cover, 'https://')
            || str_starts_with($cover, 'data:')) {
            return $cover;
        }

        return Storage::url($cover);
    }
}
