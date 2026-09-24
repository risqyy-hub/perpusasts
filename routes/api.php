<?php

use App\Http\Controllers\Api\BookApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — RESTful book endpoints (JSON in / JSON out)
|--------------------------------------------------------------------------
*/

Route::prefix('books')->group(function () {
    Route::get('/', [BookApiController::class, 'index']);
    Route::post('/', [BookApiController::class, 'store']);
    Route::get('/{id}', [BookApiController::class, 'show'])->whereNumber('id');
    Route::put('/{id}', [BookApiController::class, 'update'])->whereNumber('id');
    Route::delete('/{id}', [BookApiController::class, 'destroy'])->whereNumber('id');
});
