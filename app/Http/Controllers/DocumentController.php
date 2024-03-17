<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Department;
use App\Models\DocuTag;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

use function PHPUnit\Framework\isEmpty;

class DocumentController extends Controller
{

    public function getAllDocumentsFromDepartment($name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'],404);
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
            return response()->json(['message' => 'Nema dokumenata.'],404);
        }
        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.'],404);
        }
        return DocumentResource::collection($documentsfromDept);
    }

    public function getDocumentFromDepartment($name, $id)
    {
        $documents = $this->getAllDocumentsFromDepartment($name);
        if (empty($documents)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.'],404);
        }

        foreach ($documents as $doc) {
            if ($doc->id == $id) {
                $document = new Document();
                $document->id = $doc->id;
                $document->title = $doc->title;
                $document->date = $doc->date;
                $document->text = $doc->text;
                $document->format = $doc->format;
                $document->employee_fk = $doc->employee_fk;
                $document->department_fk = $doc->department_fk;

                return response()->json($document);
            }
        }

        return response()->json(['message' => 'Nema tog dokumenta u ovom odeljenju.'],404);
    }

    public function makeDocument(Request $request, $name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'],404);
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
            'text' => 'required',
            'format' => [
                'required',
                Rule::in($format_values)
            ]
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Proverite da li ste popunili sva polja i da li je format ispravno unesen.'],422);
        }

        $employee = auth()->user();
        $employee_fk = $employee->id;
        $date = Carbon::now();

        Document::create([
            'title' => request('title'),
            'date' => $date,
            'text' => request('text'),
            'format' => request('format'),
            'employee_fk' => $employee_fk,
            'department_fk' => $department_fk
        ]);

        return response()->json(['message' => 'Dokument uspesno napravljen.', 200]);
    }

    public function updateDocument(Request $request, $name, $id)
    {
        $document = Document::where('id', $id)->first();
        if($document){
            if($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id){

                $format_values = ['pdf', 'word'];
                $validator = Validator::make($request->only('title', 'text', 'format'), [
                    'title' => 'required',
                    'text' => 'required',
                    'format' => [
                        'required',
                        Rule::in($format_values)
                    ]
                ]);

                if ($validator->fails()) {
                    return response()->json(['message' => 'Proverite da li ste popunili sva polja i da li je format ispravno unesen.'],422);
                }
                
                $date = Carbon::now();
                $document->title = $request->title;
                $document->date = $date;
                $document->text = $request->text;
                $document->format = $request->format;
                $document->update();

                return response()->json(['message' => 'Dokument uspesno izmenjen.', 200]);
            }
            else{
                return response()->json(['message' => 'Ne mozete menjati ovaj dokument.', 403]);
            }
        }else{
            return response()->json(['message' => 'Dokument ne postoji.', 404]);
        }
    }


    public function deleteDocument(Request $request, $name, $id)
    {
        $document = Document::where('id', $id)->first();
        if($document){
            if($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id){
                
                $document->delete();

                return response()->json(['message' => 'Dokument uspesno izbrisan.', 200]);
            }
            else{
                return response()->json(['message' => 'Ne mozete brisati ovaj dokument.', 403]);
            }
        }else{
            return response()->json(['message' => 'Dokument ne postoji.', 404]);
        }
    }

    public function getFilteredDocuments($name, $filter)
    {
        if(empty($filter)) $this->getAllDocumentsFromDepartment($name);

        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'],404);
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
            return response()->json(['message' => 'Nema dokumenata.'],404);
        }

        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if (empty($documentsfromDept)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.'],404);
        }

        $tags = Tag::all();
        if ($tags->isEmpty()) {
            return response()->json(['message' => 'Nema tagova.'],404);
        }
        $tag_id = 0;
        foreach ($tags as $t) {
            if ($t->keyword == $filter) {
                $tag_id = $t->id;
                break;
            }
        }

        $docu_tags = DocuTag::all();
        if ($docu_tags->isEmpty()) {
            return response()->json(['message' => 'Nema trazenog taga za dokument.'],404);
        }
        $documentsfromDeptWithFilter = collect(new Document());
        foreach ($docu_tags as $dt) {
            foreach($documentsfromDept as $docs){
                if ($dt->document_id == $docs->id && $dt->tag_id == $tag_id) {
                    $documentsfromDeptWithFilter->push($docs);
                }
            }
        }
        if ($documentsfromDeptWithFilter->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata sa tim tagom u ovom odeljenju.'],404);
        }

        return DocumentResource::collection($documentsfromDeptWithFilter);
    }

    public function getSearchedDocuments($name, $search)
    {
        if(empty($search)) $this->getAllDocumentsFromDepartment($name);

        $departments = Department::all();
        if ($departments->isEmpty()) {
            return response()->json(['message' => 'Nema odeljenja.'],404);
        }
        $dept_id = 0;
        foreach ($departments as $dept) {
            if ($dept->name == $name) {
                $dept_id = $dept->id;
                break;
            }
        }

        $documents = Document::where('title', 'like', "%{$search}%")->orWhere('text', 'like', "%{$search}%")->get();
        //return $documents;
        if ($documents->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata.'],404);
        }

        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk == $dept_id)
                $documentsfromDept->push($doc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju sa tom pretragom.'],404);
        }

        return DocumentResource::collection($documentsfromDept);
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
