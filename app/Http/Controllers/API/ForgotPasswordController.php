<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\API\ForgotPasswordRequest;
use App\Notifications\ResetPasswordVerificationNotification;
use App\Models\Employee;

class ForgotPasswordController extends Controller
{
    public function forgotPassword(ForgotPasswordRequest $request){
        $input = $request -> only('email');
        $employee = Employee::where('email', $input)->first();
        $employee -> notify(new ResetPasswordVerificationNotification());
        $success['success'] = true;
        return response()->json($success); 
    }
}
