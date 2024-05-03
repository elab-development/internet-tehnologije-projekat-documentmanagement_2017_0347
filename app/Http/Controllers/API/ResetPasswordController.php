<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Notifications\ResetPasswordRequest;
use App\Models\Employee;
use Otp;
use Hash;

class ResetPasswordController extends Controller
{
    private $otp;

    public function __construct(){
        $this -> otp = new Otp;
    }

    public function resetPassword(){
        $newOtp = $this -> otp -> validate($request->email, $request->otp);
        if(!$newOtp -> status){
            return response()->json(['error'=> $newOtp]);
        }
        $employee = Employee::where('email', $request->email)->first();
        $employee -> update(['password' => Hash::make($request->password)]);
        $employee -> tokens() -> delete();
        $success['success'] = true;
        return response()->json($success); 
    }
}
