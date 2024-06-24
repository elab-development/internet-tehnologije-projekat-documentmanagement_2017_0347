<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\ResetPasswordController;

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
Route::get('/departments', [DocumentController::class, 'getAllDepartments']);
Route::get('/employees', [DocumentController::class, 'getAllEmployees']);
Route::get('/tags', [DocumentController::class, 'getAllTags']);
Route::get('/docuTags', [DocumentController::class, 'getAllDocuTags']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function (Request $request) {
        return auth()->user();
    });
    Route::get('/documents/{name}', [DocumentController::class, 'getAllDocumentsFromDepartment']);
    Route::get('/documents/{name}/{id}', [DocumentController::class, 'getDocumentFromDepartment']);
    Route::post('/documents/{name}/upload', [DocumentController::class, 'uploadDocument']);
    Route::post('/documents/{name}/make', [DocumentController::class, 'makeDocument']);
    Route::get('/documents/download', [DocumentController::class, 'download']);
    Route::put('/documents/{name}/{id}/update', [DocumentController::class, 'updateDocument']);
    Route::put('/documents/{name}/{id}/rename', [DocumentController::class, 'renameDocument']);
    Route::delete('/documents/{name}/{id}/{userId}/delete', [DocumentController::class, 'deleteDocument']);
    Route::get('/documents/{name}/filter/{filter?}', [DocumentController::class, 'getFilteredDocuments']);
    Route::get('/documents/{name}/author/{id}', [DocumentController::class, 'getDocumentsByAuthor']);
    Route::get('/documents/{name}/search/{search?}', [DocumentController::class, 'getSearchedDocuments']);
    Route::resource('documents', DocumentController::class);
    Route::get('/documents/path/{title}/{extension}', [DocumentController::class, 'getDocumentPath']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route::get('/documents/{name}/download/{id}', [DocumentController::class, 'downloadDocument']);