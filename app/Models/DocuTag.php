<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Thiagoprz\CompositeKey\HasCompositeKey;

class DocuTag extends Model
{
    use HasFactory;
    use HasCompositeKey;

    protected $primaryKey = ['docId_fk', 'tagId_fk'];
    protected $fillable = ['docId_fk', 'tagId_fk'];
    public $timestamps = false;
    
    public function document(){
        return $this->belongsTo(Document::class);
    }

    public function tag(){
        return $this->belongsTo(Tag::class);
    }
}

