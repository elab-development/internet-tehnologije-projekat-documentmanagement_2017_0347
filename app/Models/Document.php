<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $timestamps = false;

    public function documentTagsDocument(){
        return $this->hasMany(DocuTag::class);
    }

    public function usersDocument(){
        return $this->belongsTo(Employee::class, 'employee_fk');
    }

    public function departmentsDocument(){
        return $this->belongsTo(Department::class, 'department_fk');
    } 
}

