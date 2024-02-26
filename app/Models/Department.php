<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $timestamps = false;

    public function usersDepartment(){
        return $this->hasMany(User::class);
    }

    public function documentsDepartment(){
        return $this->hasMany(Document::class);
    }
}

