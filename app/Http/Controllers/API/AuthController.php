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

        $employee = Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_fk' => $request->department_fk
        ]);

        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()
            ->json(['data' => $employee, 'access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()
                ->json(['message' => 'Morate biti registrovani.'], 401);
        }

        $employee= Employee::where('email', $request['email'])->firstOrFail();

        $token = $employee->createToken('auth_token')->plainTextToken;

        return response()
            ->json(['message' => 'Uspesno ste se prijavili na server!', 'access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return [
            'message' => 'Dovidjenja! Za ponovni pristup serverskim rutama, molimo Vas da se ponovo ulogujete.'
        ];
    }
}

