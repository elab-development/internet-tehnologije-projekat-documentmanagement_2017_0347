<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\Employee;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string',
            'role' => 'required|string',
            'department_fk' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([ 'success' => false,$validator->errors()]);
        }

        if($request->role == 'admin' && $request->department_fk != 4){
            return response()->json(['success' => false,'message' => 'Admin role cannot be given to members of this department.']);
        }
        
        $employee = Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_fk' => $request->department_fk
        ]);


        return response()->json(['success' => true,'empId' => $employee->id, 'token_type' => 'Bearer']);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->jsopn(['success' => false], 401);
        }

        $employee= Employee::where('email', $request['email'])->firstOrFail();

        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()->json(['success' => true, 'empId'=>$employee->id ,'access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Goodbye. To work with the DMS sevice again, please log in.'], 200);
    }
}

