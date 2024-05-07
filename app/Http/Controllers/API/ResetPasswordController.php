<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\ResetPasswordRequest;
use App\Models\Employee;
use Ichtrojan\Otp\Otp;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    private $otp;

    public function __construct(){
        $this -> otp = new Otp;
    }

    public function resetPassword(ResetPasswordRequest $request){
        $newOtp = $this -> otp -> validate($request->email, $request->otp);
        if(!$newOtp -> status){
            return response()->json(['error'=> $newOtp]);
        }
        $employee = Employee::where('email', $request->email)->first();
        $password = $request -> password;
        $confirm_password = $request -> confirm_password;
        if($password != $confirm_password){
            return response()->json(['error'=> 'Passwords do not match.']);
        }
        $employee -> update(['password' => Hash::make($password)]);
        $employee -> tokens() -> delete();
        $success['success'] = 'Password successfully reset.';
        return response()->json($success); 
    }
}
