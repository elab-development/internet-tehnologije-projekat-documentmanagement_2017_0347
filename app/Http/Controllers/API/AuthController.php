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
            return response()->json($validator->errors());
        }

        if($request->role == 'admin' && $request->department_fk != 4){
            return response()->json(['message' => 'Uloga administratora se ne dodeljuje clanovima ovog odeljenja.'], 403);
        }
        
        $employee = Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_fk' => $request->department_fk
        ]);

        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()->json(['data' => $employee, 'access_token' => $token, 'token_type' => 'Bearer']);
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
            return response()->json(['success' => false], 401);
        }

        $employee= Employee::where('email', $request['email'])->firstOrFail();

        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()->json(['success' => true, 'access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Dovidjenja! Za ponovni pristup serverskim rutama, molimo Vas da se ponovo ulogujete.'], 200);
    }
}

