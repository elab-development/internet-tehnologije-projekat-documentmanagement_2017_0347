<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Department;
use App\Models\DocuTag;
use App\Models\Employee;
use App\Models\Tag;
use Smalot\PdfParser\Parser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\File;



class DocumentController extends Controller
{

    public function getAllDepartments()
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'No departments.']);
        }
        return $departments;
    }

    public function getAllEmployees()
    {
        $employees = Employee::all();
        if (empty($employees)) {
            return response()->json(['message' => 'No employees, sorry.'], 200);
        }
        $subset = $employees->map(function ($employee) {
            return $employee->only(['id', 'name', 'email', 'department_fk', 'role']);
        });
        return $subset;
    }

    public function getDocumentPath($title, $extension)
    {
        //  $fileName = $title . '.' . $extension;        
        // $filePath = public_path('storage\\' . $fileName);
        // return response()->json(['path' => $filePath]);

        $fileName = $title . '.' . $extension;
        $path = storage_path('app\\public\\' . $fileName);

        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $base64 = base64_encode($file);
        $type = File::mimeType($path);

        return response()->json([
            'base64' => 'data:' . $type . ';base64,' . $base64,
        ]);
    }

    public function getAllTags()
    {
        $tags = Tag::all();
        if (empty($tags)) {
            return response()->json(['message' => 'No tags .']);
        }
        return $tags;
    }

    public function getAllDocuTags()
    {
        $docTags = DocuTag::all();
        if (empty($docTags)) {
            return response()->json(['message' => 'No docu_tags .']);
        }
        return $docTags;
    }
    //+ paginate
    public function getAllDocumentsFromDepartment($name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'No departments.']);
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
            return response()->json(['data' => []]);
        }
        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
                $documentsfromDept->push($doc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['data' => []]);
        }
        return DocumentResource::collection($documentsfromDept);
    }

    public function getDocumentFromDepartment($name, $id)
    {
        $documents = $this->getAllDocumentsFromDepartment($name);
        if (empty($documents)) {
            return response()->json(['message' => 'There are no documents in this department.']);
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


                return response()->json(['data' => $document]);
            }
        }

        return response()->json(['message' => 'Document succesfully loaded.']);
    }

    public function uploadDocument(Request $request, $name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'No departments exist.']);
        }

        $department_fk = 0;
        foreach ($departments as $d) {
            if ($d->name == $name) {
                $department_fk = $d->id;
                break;
            }
        }

        $user = Employee::where('id', (string) $request->userId)->first();

        if ($user->role == 'admin' || $user->department_fk == $department_fk) {
            $request->validate([
                'file' => 'required|file',
            ]);
            $file = $request->file('file');
            if ($file->isValid()) {
                $originalFileName = $file->getClientOriginalName();
                $existingFiles = Storage::files('public');
                $newFileName = $originalFileName;
                $i = 1;
                while (in_array("public\\$newFileName", $existingFiles)) {
                    $extension = $file->getClientOriginalExtension();
                    $fileNameWithoutExtension = pathinfo($originalFileName, PATHINFO_FILENAME);
                    $newFileName = $fileNameWithoutExtension . '_' . $i . '.' . $extension;
                    $i++;
                }
                $path = $file->storeAs('public', $newFileName);
            } else {
                return response()->json(['message' => 'File is not valid.']);
            }
            $path = str_replace('/', '\\', $path);
            $employee = auth()->user();
            $departments = Department::all();
            $department_fk = 0;
            foreach ($departments as $d) {
                if ($d->name == $name) {
                    $department_fk = $d->id;
                    break;
                }
            }
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $text = '';
            $absolutePath = storage_path('app\\public\\') . $request->file('file')->getClientOriginalName();
            if ($extension === 'doc' || $extension === 'docx') {
                $format = 'word';

                $phpWord = IOFactory::load($absolutePath);

                // Extract text from each section and paragraph
                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                            $text .= $element->getText();
                        }
                    }
                }
            } elseif ($extension === 'pdf') {
                $format = 'pdf';
                $pdfParser = new Parser();
                $pdf = $pdfParser->parseFile($file->path());
                $text = $pdf->getText();
            } else {
                return response()->json(['message' => 'Check document format.']);
            }

            $dotIndex = strpos($text, ".");
            $preview = $text;
            if ($dotIndex !== false) {
                $preview = substr($text, 0, $dotIndex + 1);
            }
            $dirtyFileName = $request->file('file')->getClientOriginalName();
            $cleanFileName = pathinfo($dirtyFileName, PATHINFO_FILENAME);
            Document::create([
                'title' => $cleanFileName,
                'date' => Carbon::now(),
                'preview' => $preview,
                'format' => $format,
                'employee_fk' => $employee->id,
                'department_fk' => $department_fk,
                'path' => $absolutePath
            ]);
            $latestDocument = Document::orderBy('date', 'desc')->first();
            //cini mi se da je ovo bolje da izbrisemo
            $tags = $this->getAllTags();
            foreach ($tags as $tag) {
                if (str_contains($text, $tag->keyword) || str_contains($cleanFileName, $tag->keyword)) {
                    DocuTag::create([
                        'document_id' => $latestDocument->id,
                        'tag_id' => $tag->id
                    ]);
                }
            }
            return $latestDocument;
            return response()->json(['message' => 'Document successfully uploaded.']);
        } else {
            return response()->json(['message' => 'You do not have the privilege to upload this document.']);
        }
    }

    
    public function download(Request $request)
    {
        // Define the path to the file
        // $filePath = storage_path("app\\public\\{$filename}");

        $encodedFilePath = $request->query('filePath');
        $filePath = urldecode($encodedFilePath);

        // Check if the file exists
        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        // Return the file as a response to download
        return response()->download($filePath);
    }
    
    public function makeDocument(Request $request, $name)
    {
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'No departments exist.']);
        }

        $department_fk = 0;
        foreach ($departments as $d) {
            if ($d->name == $name) {
                $department_fk = $d->id;
                break;
            }
        }
        if ($request->user()->role == 'admin' || $request->user()->department_fk == $department_fk) {
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
                return response()->json(['message' => 'Check if all fields are filled and if format field is in the correct format.']);
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

                $filePath = storage_path('app\\public\\') . request('title') . '.docx';
                $phpWord->save($filePath, 'Word2007');
                $newlineIndex = strpos(request('text'), "\n");
                $preview = substr(request('text'), 0, $newlineIndex);
                Document::create([
                    'title' => request('title'),
                    'date' => $date,
                    'preview' => $preview,
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
                $pdfPath = storage_path('app\\public\\') . $title . '.pdf';
                file_put_contents($pdfPath, $pdfContent);
                Document::create([
                    'title' => request('title'),
                    'date' => $date,
                    'preview' => substr(request('text'), 0, 80),
                    'format' => request('format'),
                    'employee_fk' => $employee_fk,
                    'department_fk' => $department_fk,
                    'path' => $pdfPath
                ]);
            }
            return response()->json(['message' => 'Document successfuly created.']);
        } else {
            return response()->json(['message' => 'You do not have the privilege to make this document.']);
        }
    }

    // jos nije gotova
    public function updateDocument(Request $request, $id)
    {
        $document = Document::where('id', $id)->first();
        $title = $document->title;
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
                    return response()->json(['message' => 'Check if all fields are filled and if format field is in the correct format.']);
                }

                if (request('format') == 'word') {
                    $filePath = storage_path('app\\public\\') . $title . '.docx';
                    $phpWord = IOFactory::load($filePath);
                    $section = $phpWord->addSection();
                    $phpWord->addTitle(request('title'));
                    $section->addText(request('text'));
                    $newFilePath = storage_path('app\\public\\') . request('title') . '.docx';
                    $phpWord->save($newFilePath, 'Word2007');
                } else {
                    $pdfPath = 'public\\' . request('title');
                    $pdfContent = Storage::get($pdfPath);
                    $newTitle = $request->title;
                    $newContent = $request->text;
                    $html = "<h1>$newTitle</h1><p>$newContent</p>";
                    $dompdf = new Dompdf();
                    $dompdf->loadHtml($pdfContent);
                    $dompdf->loadHtml($html);
                    $dompdf->render();
                    $newPdfContent = $dompdf->output();
                    $pdfPath = storage_path('app\\public\\') . $newTitle . '.pdf';
                    file_put_contents($pdfPath, $newPdfContent);
                }

                $date = Carbon::now();
                $document->title = $request->title;
                $document->date = $date;
                $newlineIndex = strpos(request('text'), "\n");
                $preview = substr(request('text'), 0, $newlineIndex);
                $document->preview = $preview;
                $document->update();

                return response()->json(['message' => 'Document successfully updated.']);
            } else {
                return response()->json(['message' => 'You do not have the right privilege to update the document.']);
            }
        } else {
            return response()->json(['message' => 'Document does not exist.']);
        }
    }


    
    public function renameDocument(Request $request, $name, $id)
    {
        $document = Document::where('id', $id)->first();

        if ($document) {
            if ($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id) {
                $validator = Validator::make($request->only('title'), [
                    'title' => 'required'
                ]);
                
                if ($validator->fails()) {
                    return response()->json(['message' => 'Check if title field is filled.']);
                }

                $filePath = storage_path('app\\public\\') . $document->title;
                $newFilePath = storage_path('app\\public\\') . request('title');
                
                if ($document->format == 'word') {
                    $extension = '.docx';
                    $filePath .= $extension;
                    $newFilePath .= $extension;
                } else {
                    $extension = '.pdf';
                    $filePath .= $extension;
                    $newFilePath .= $extension;
                }
                rename($filePath, $newFilePath);
                
                $date = Carbon::now();
                $document->title = $request->title;
                $document->date = $date;
                $document->path = $newFilePath;
                $document->update();
                
                return response()->json(['message' => 'Document title successfully updated.']);
            } else {
                return response()->json(['message' => 'You do not have the right privilege to update document title.']);
            }
        } else {
            return response()->json(['message' => 'Document does not exist.']);
        }
    }

    public function deleteDocument(Request $request, $name, $id, $userId)
    {
        $document = Document::where('id', $id)->first();
        if (!$document) {
            return response()->json(['message' => 'Document does not exist.']);
        }
        
        if ($document->format == 'pdf') {
            $filePath = 'public\\' . $document->title . '.pdf';
        } else {
            $filePath = 'public\\' . $document->title . '.docx';
        }
        $cleanedPath = str_replace('\\\\', '\\', $filePath);
        
        $user = Employee::where('id', (string) $userId)->first();
        
        if ($user->role == 'admin' || $document->employee_fk == $user->id) {
            if (Storage::exists($cleanedPath)) {
                Storage::delete($cleanedPath);
                DocuTag::where('document_id', $document->id)->delete();
                $document->delete();
                return response()->json(['message' => 'Document successfully deleted.']);
            } else {
                return response()->json(['message' => 'Document is not successfully deleted.']);
            }
        } else {
            return response()->json(['message' => 'You do not have the privilege to delete this document.']);
        }
    }

    
    public function getFilteredDocuments($name, $filter)
    {
        if (empty($filter)) $this->getAllDocumentsFromDepartment($name);
        
        $departments = Department::all();
        if (empty($departments)) {
            return response()->json(['message' => 'No departments.']);
        }
        $dept_id = 0;
        foreach ($departments as $dept) {
            if ($dept->name === $name) {
                $dept_id = $dept->id;
                break;
            }
        }
        
        $documents = Document::all(); //mozda ce morati da se koristi paginate zbog paginacije , nisam sigurna
        if (empty($documents)) {
            return response()->json(['message' => 'No documents.']);
        }

        $documentsfromDept = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->department_fk === $dept_id)
            $documentsfromDept->push($doc);
    }
    if (empty($documentsfromDept)) {
        return response()->json(['message' => 'No documents in this department.']);
    }
    
    $tags = Tag::all();
    if ($tags->isEmpty()) {
            return response()->json(['message' => 'No tags.']);
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
            return response()->json(['message' => 'No tags that match this document.']);
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
            return response()->json(['message' => 'No documents with this tag in this department.']);
        }
        
        return DocumentResource::collection($documentsfromDeptWithFilter);
    }

    public function getSearchedDocuments($name, $search)
    {
        if (empty($search)) $this->getAllDocumentsFromDepartment($name);
        
        $departments = Department::all();
        if ($departments->isEmpty()) {
            return response()->json(['message' => 'No departments.']);
        }
        $dept_id = 0;
        foreach ($departments as $dept) {
            if ($dept->name == $name) {
                $dept_id = $dept->id;
                break;
            }
        }
        
        $documents = Document::all(); //mozda ce morati da se koristi paginate zbog paginacije , nisam sigurna
        if ($documents->isEmpty()) {
            return response()->json(['message' => 'No documents.']);
        }
        
        $filteredDocs = collect(new Document());
        foreach ($documents as $doc) {
            $text = Storage::get($doc->path);
            $title = $doc->title;
            if (str_contains($text, $search) || str_contains($title, $search)) {
                $filteredDocs->push($doc);
            }
        }

        if ($filteredDocs->isEmpty()) {
            return response()->json(['message' => 'No documents that match the search parameter.']);
        }

        $documentsfromDept = collect(new Document());
        foreach ($filteredDocs as $fdoc) {
            if ($fdoc->department_fk == $dept_id)
                $documentsfromDept->push($fdoc);
        }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['message' => 'No documents in this department that match the search parameter.']);
        }
        
        return DocumentResource::collection($documentsfromDept);
    }
    
    public function getDocumentsByAuthor($name, $id)
    {
        
        $departments = Department::all();
        if ($departments->isEmpty()) {
            return response()->json(['message' => 'No departments.']);
        }
        $dept_id = 0;
        foreach ($departments as $dept) {
            if ($dept->name == $name) {
                $dept_id = $dept->id;
                break;
            }
        }
        
        $documents = Document::all(); //mozda ce morati da se koristi paginate zbog paginacije , nisam sigurna
        if ($documents->isEmpty()) {
            return response()->json(['message' => 'No documents.']);
        }
        
        $filteredDocs = collect(new Document());
        foreach ($documents as $doc) {
            if ($doc->employee_fk == $id) {
                $filteredDocs->push($doc);
            }
        }
        if ($filteredDocs->isEmpty()) {
            return response()->json(['message' => 'No documents written by this author.']);
        }

        $documentsfromDept = collect(new Document());
        foreach ($filteredDocs as $fdoc) {
            if ($fdoc->department_fk == $dept_id)
            $documentsfromDept->push($fdoc);
    }
        if ($documentsfromDept->isEmpty()) {
            return response()->json(['message' => 'No documents in this department written by this author.']);
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

// public function renameDocument(Request $request, $name, $id)
// {
//     $document = Document::where('id', $id)->first();
//     $title = $document->title;
//     $path = $document->path;
//     if ($document) {
//         if ($request->user()->role == 'admin' || $document->employee_fk == $request->user()->id) {
    //             $validator = Validator::make($request->only('title'), [
//                 'title' => 'required'
//             ]);

//             if ($validator->fails()) {
    //                 return response()->json(['message' => 'Check if title field is filled.']);
    //             }
    
    //             if ($document->format == 'word') {
        //                 $filePath = storage_path('app\\public\\') . $title . '.docx';
        //                 $filePath = str_replace('/', '\\', $filePath);
        //                 $phpWord = IOFactory::load($filePath);
        //                 $phpWord->addTitle(request('title'));
        //                 $newFilePath = storage_path('app\\public\\') . request('title') . '.docx';
        //                 Storage::delete($path);
        //                 $path = 'public\\' . request('title') . '.docx';
        //                 $phpWord->save($newFilePath, 'Word2007');
        //             } else {
//                 $pdfPath = 'public\\' . request('title');
//                 $pdfContent = Storage::get($pdfPath);
//                 $newTitle = $request->title;
//                 $html = "<h1>$newTitle</h1>";
//                 $dompdf = new Dompdf();
//                 $dompdf->loadHtml($pdfContent);
//                 $dompdf->loadHtml($html);
//                 $dompdf->render();
//                 $newPdfContent = $dompdf->output();
//                 $pdfPath = storage_path('app\\public\\') . $newTitle . '.pdf';
//                 Storage::delete($path);
//                 $path = 'public\\' . $newTitle . 'pdf';
//                 file_put_contents($pdfPath, $newPdfContent);
//             }

//             $date = Carbon::now();
//             $document->title = $request->title;
//             $document->date = $date;
//             $document->path = $path;
//             $document->update();

//             return response()->json(['message' => 'Document title successfully updated.']);
//         } else {
//             return response()->json(['message' => 'You do not have the right privilege to update document title.']);
//         }
//     } else {
//         return response()->json(['message' => 'Document does not exist.']);
//     }
// }
// public function downloadDocument($name, $id)
// {
//     $document = Document::where('id', $id)->first();
//     if (!$document) {
//         return response()->json(['message' => 'Document not found.']);
//     }
//     $basePath = 'C:/xampp/htdocs/laravel domaci/internet-tehnologije-projekat-documentmanagement_2017_0347/storage/app/';
//     $filePath = $basePath . $document->path;
//     if (!Storage::disk('local')->exists($document->path)) {
//         return response()->json(['message' => 'File not found.'], 404);
//     }
//     $fileName = basename($filePath);
//     //$downloadPath = 'C:/xampp/htdocs/laravel domaci/internet-tehnologije-projekat-documentmanagement_2017_0347/storage/app/downloads/' . $fileName;
//     return response()->download($filePath, $fileName);
// }