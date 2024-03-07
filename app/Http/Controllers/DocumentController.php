<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

use function PHPUnit\Framework\isEmpty;

class DocumentController extends Controller
{

    public function getAllDocumentsFromDepartment($name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.']);
        }
        $dept_id = 0;
        foreach ($departments as $dept) {
            if ($dept->name === $name) {
                $dept_id = $dept->id;
                break;
            }
        }
        $documents = Document::all();
        if (empty($documents)) {
            return response()->json(['message' => 'Nema dokumanata.']);
        }
        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if (empty($documentsfromDept)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.']);
        }
        return DocumentResource::collection($documentsfromDept);
    }

    public function getDocumentFromDepartment($name, $id)
    {
        $documents = $this->getAllDocumentsFromDepartment($name);
        if (empty($documents)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.']);
        }

        foreach ($documents as $doc) {
            if ($doc->id == $id) {
                $document = new Document();
                $document->id = $doc->id;
                $document->title = $doc->title;
                $document->text = $doc->text;
                $document->format = $doc->format;
                $document->employee_fk = $doc->employee_fk;
                $document->department_fk = $doc->department_fk;

                return $document;
            }
        }

        return response()->json(['message' => 'Nema tog dokumenta u ovom odeljenju.']);
    }

    public function makeDocument(Request $request, $name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.']);
        }

        $department_fk = 0;
        foreach($departments as $d){
            if($d->name == $name){
                $department_fk = $d->id;
                break;
            }
        }

        $format_values = ['pdf', 'word'];
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'date' => 'required|date_format:Y-m-d H:i:s',
            'text' => 'required',
            'format' => [
                'required',
                Rule::in($format_values)
            ]
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Proverite da li ste popunili sva polja i da li su datum i format ispravno uneseni.']);
        }

        $employee = auth()->user();
        $employee_fk = $employee->id;

        $document =  Document::create([
            'title' => request('title'),
            'date' => request('date'),
            'text' => request('text'),
            'format' => request('format'),
            'employee_fk' => $employee_fk,
            'department_fk' => $department_fk
        ]);

        return $document;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        //
    }
}
