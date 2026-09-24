<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (DB::table('books')->orderBy('id')->get() as $b) {
    echo $b->id.' | '.$b->kode_buku.' | '.$b->judul.' | cover='.var_export($b->cover, true).PHP_EOL;
}
echo 'total='.DB::table('books')->count().PHP_EOL;
