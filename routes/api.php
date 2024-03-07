<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\DocumentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        return auth()->user();
    });
    Route::get('/documents/{name}', [DocumentController::class, 'getAllDocumentsFromDepartment']);
    Route::get('/documents/{name}/{id}', [DocumentController::class, 'getDocumentFromDepartment']);
    Route::post('/documents/{name}', [DocumentController::class, 'makeDocument']);
    Route::put('/documents/{name}/{id}', [DocumentController::class, 'updateDocument']);
    Route::delete('/documents/{name}/{id}', [DocumentController::class, 'deleteDocument']);
    Route::resource('documents', DocumentController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
});

