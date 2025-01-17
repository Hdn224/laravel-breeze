<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Category;
use App\Models\Material;
use App\Models\Supplier;
use App\Models\Color;
use App\Models\Size;
use App\Models\Review;
use App\Models\Promotion;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// class InventoryController extends Controller
// {
//     public function index(Request $request)
//     {
//         $query = Inventory::with(['product']);

//         if ($request->filled('search')) {
//             $query->whereHas('product', function($q) use ($request) {
//                 $q->where('name', 'like', "%{$request->search}%");
//             });
//         }

//         $inventory = $query->paginate($request->input('per_page', 10));

//         return response()->json($inventory);
//     }
// }
