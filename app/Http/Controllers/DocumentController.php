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
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Dompdf\Dompdf;
use Smalot\PdfParser\Parser;

class DocumentController extends Controller
{

    public function getAllDepartments(){
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'], 404);
        }
        return $departments;
    }

    public function getAllDocumentsFromDepartment($name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'], 404);
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
            return response()->json(['data' => []], 200);
        }
        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['data'=> []], 200);
        }
        return DocumentResource::collection($documentsfromDept);
    }

    public function getDocumentFromDepartment($name, $id)
    {
        $documents = $this->getAllDocumentsFromDepartment($name);
        if (empty($documents)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.'], 200);
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
              

                return response()->json(['data'=> $document]);
            }
        }

        return response()->json(['message' => 'Nema tog dokumenta u ovom odeljenju.'], 404);
    }

    public function makeDocument(Request $request, $name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'], 404);
        }

        $department_fk = 0;
        foreach ($departments as $d) {
            if ($d->name == $name) {
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
            return response()->json(['message' => 'Proverite da li ste popunili sva polja i da li je format ispravno unesen.'], 422);
        }

        $employee = auth()->user();
        $employee_fk = $employee->id;
        $date = Carbon::now();
        $filePath = null;

        if (request('format') == 'word') {
            $phpWord = new PhpWord();
            $section = $phpWord->addSection();
            $phpWord->addTitle(request('title'));
            $section->addText(request('text'));

            $filePath = storage_path('app/public/') . request('title') . '.docx';
            $phpWord->save($filePath, 'Word2007');
            Document::create([
                'title' => request('title'),
                'date' => $date,
                'text' =>substr(request('text'),0, 80) ,
                'format' => request('format'),
                'employee_fk' => $employee_fk,
                'department_fk' => $department_fk,
                'path' => $filePath
            ]);
        } else {
            $title = $request->input('title');
            $text = $request->input('text');
            $html = "<h1>$title</h1><p>$text</p>";
            $dompdf = new Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->render();
            $pdfContent = $dompdf->output();
            $pdfPath = storage_path('app/public/') . $title . '.pdf';
            file_put_contents($pdfPath, $pdfContent);
            Document::create([
                'title' => request('title'),
                'date' => $date,
                'text' =>substr(request('text'),0, 80) ,
                'format' => request('format'),
                'employee_fk' => $employee_fk,
                'department_fk' => $department_fk,
                'path' => $pdfPath
            ]);}


        return response()->json(['message' => 'Dokument uspesno napravljen.', 200]);
    }
    /*
    public function getFile(Request $request, $id){
        $document = Document::where('id', $id)->first();
        $title = $document -> title;
        if(request('format') == 'word'){
            $filePath = storage_path('app/public/') . $title . '.docx';
            return $filePath;
            $phpWord = IOFactory::load($filePath);
            $sections = $phpWord->getSections();
            foreach ($sections as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                        $textWord = $element->getText();
                    }
                }
            }
        }else{
            $pdfPath = 'public/' . request('title');
            $parser = new Parser();
            $pdf = $parser->parseFile($pdfPath);
            $pages = $pdf->getPages();
            $pdfText = '';
            foreach ($pages as $page) {
                $pdfText .= $page->getText();
            }
            $document -> text = $pdfText;
        }
    }
    */

    public function updateDocument(Request $request ,$id)
    {
        $document = Document::where('id', $id)->first();
        $title = $document -> title;
        $format_values = ['pdf', 'word'];
        if ($document) {
            if ($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id) {
                $validator = Validator::make($request->only('title', 'text', 'format'), [
                    'title' => 'required',
                    'text' => 'required',
                    'format' => [
                        'required',
                        Rule::in($format_values)
                    ]
                ]);

                if ($validator->fails()) {
                    return response()->json(['message' => 'Proverite da li ste popunili sva polja i da li je format ispravno unesen.'], 422);
                }

                if (request('format') == 'word') {
                    $filePath = storage_path('app/public/') . $title . '.docx';
                    $filePath = str_replace('/', '\\', $filePath);
                    $phpWord = IOFactory::load($filePath);
                    $section = $phpWord->addSection();
                    $phpWord->addTitle(request('title'));
                    $section->addText(request('text'));
                    $newFilePath = storage_path('app/public/') . request('title'). '.docx';
                    $phpWord->save($newFilePath, 'Word2007');
                } else {
                    $pdfPath = 'public/' . request('title');
                    $pdfContent = Storage::get($pdfPath);
                    $newTitle = $request->title;
                    $newContent = $request->text;
                    $html = "<h1>$newTitle</h1><p>$newContent</p>";
                    $dompdf = new Dompdf();
                    $dompdf->loadHtml($pdfContent);
                    $dompdf->loadHtml($html);
                    $dompdf->render();
                    $newPdfContent = $dompdf->output();
                    $pdfPath = storage_path('app/public/') . $newTitle . '.pdf';
                    file_put_contents($pdfPath, $newPdfContent);
                }

                $date = Carbon::now();
                $document->title = $request->title;
                $document->date = $date;
                $document->text = $request->text;
                $document->update();

                return response()->json(['message' => 'Dokument uspesno izmenjen.', 200]);
            } else {
                return response()->json(['message' => 'Ne mozete menjati ovaj dokument.', 403]);
            }
        } else {
            return response()->json(['message' => 'Dokument ne postoji.', 404]);
        }
    }

    
    public function deleteDocument(Request $request, $name, $id)
    {
        $document = Document::where('id', $id)->first();
        $filePath = '';
        if($document->format == 'pdf'){
            $filePath = storage_path('app/public/') . $document -> title . '.pdf';
        }else{
            $filePath = storage_path('app/public/') . $document -> title . '.docx';
        }
        $cleanedPath = str_replace('\\\\', '\\', $filePath);
        $cleanedPath = str_replace('/', '\\', $cleanedPath);
        if ($document) {
            if ($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id) {
                if (file_exists($cleanedPath)) {
                    unlink($filePath);
                    $document->delete();
                    return response()->json(['message' => 'Dokument uspesno izbrisan.', 200]);
                }else{
                    return response()->json(['message' => 'Dokument nije uspesno izbrisan.', 200]);
                }
            } else {
                return response()->json(['message' => 'Ne mozete brisati ovaj dokument.', 200]);
            }
        } else {
            return response()->json(['message' => 'Dokument ne postoji.', 200]);
        }
    }


    public function getFilteredDocuments($name, $filter)
    {
        if (empty($filter)) $this->getAllDocumentsFromDepartment($name);

        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'Nema odeljenja.'], 404);
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
            return response()->json(['message' => 'Nema dokumenata.'], 404);
        }

        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if (empty($documentsfromDept)) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju.'], 404);
        }

        $tags = Tag::all();
        if ($tags->isEmpty()) {
            return response()->json(['message' => 'Nema tagova.'], 404);
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
            return response()->json(['message' => 'Nema trazenog taga za dokument.'], 404);
        }
        $documentsfromDeptWithFilter = collect(new Document());
        foreach ($docu_tags as $dt) {
            foreach ($documentsfromDept as $docs) {
                if ($dt->document_id == $docs->id && $dt->tag_id == $tag_id) {
                    $documentsfromDeptWithFilter->push($docs);
                }
            }
        }
        if ($documentsfromDeptWithFilter->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata sa tim tagom u ovom odeljenju.'], 404);
        }

        return DocumentResource::collection($documentsfromDeptWithFilter);
    }

    public function getSearchedDocuments($name, $search)
    {
        if (empty($search)) $this->getAllDocumentsFromDepartment($name);

        $departments = Department::all();
        if ($departments->isEmpty()) {
            return response()->json(['message' => 'Nema odeljenja.'], 404);
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
            return response()->json(['message' => 'Nema dokumenata.'], 404);
        }

        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk == $dept_id)
                $documentsfromDept->push($doc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['message' => 'Nema dokumenata u ovom odeljenju sa tom pretragom.'], 404);
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
