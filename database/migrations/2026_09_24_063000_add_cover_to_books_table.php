<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add a nullable cover column for book cover photos.
 *
 * Purely additive: no columns are dropped and existing rows keep their data.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('books', 'cover')) {
            return;
        }

        Schema::table('books', function (Blueprint $table): void {
            $table->string('cover')->nullable()->after('penerbit');
        });
    }

    /**
     * Reverse the migrations (never drops data on a live table).
     */
    public function down(): void
    {
        // Intentionally left empty: this project must never drop columns/tables.
    }
};
