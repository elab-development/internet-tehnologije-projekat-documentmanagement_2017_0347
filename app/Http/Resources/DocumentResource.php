<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'date' => $this->resource->date,
            'text' => $this->resource->text,
            'format' => $this->resource->format,
            'employee_fk' => $this->resource->employee_fk,
            'department_fk'=> $this->resource->department_fk,
            'path' => $this->resource->path
        ];
    }
}
