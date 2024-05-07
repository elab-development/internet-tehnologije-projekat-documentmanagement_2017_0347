<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\ForgotPasswordRequest;
use App\Notifications\ResetPasswordVerificationNotification;
use App\Models\Employee;

class ForgotPasswordController extends Controller
{
    public function forgotPassword(ForgotPasswordRequest $request){
        $input = $request -> only('email');
        if(empty($input)){
            return response()->json(['message' => 'Email required.']); 
        }
        $employee = Employee::where('email', $input)->first();
        if(empty($employee)){
            return response()->json(['message' => 'Employee does not exist.']); 
        }
        $employee -> notify(new ResetPasswordVerificationNotification());
        $success['success'] = 'Reset password code successfully sent.';
        return response()->json([$success]); 
    }
}
