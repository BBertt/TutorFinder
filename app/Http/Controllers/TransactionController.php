<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CourseCart;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
use App\Models\Course;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

class TransactionController extends Controller
{
    public function checkout(Request $request)
    {
        $config = new Configuration();
        $config->setApiKey(env('XENDIT_API_KEY'));

        $user = Auth::user();
        $cartItems = CourseCart::where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 400);
        }

        $totalPrice = 0;
        foreach ($cartItems as $item) {
            $totalPrice += $item->course->price;
        }

        $params = [
            'external_id' => 'tutorfinder-' . time(),
            'payer_email' => $user->email,
            'description' => 'Course Purchase',
            'amount' => $totalPrice,
            'success_redirect_url' => route('transaction.success'),
            'failure_redirect_url' => route('transaction.failure'),
        ];

        $apiInstance = new InvoiceApi();
        $invoice = $apiInstance->createInvoice($params);

        $transactionHeader = TransactionHeader::create([
            'user_id' => $user->id,
            'xendit_invoice_id' => $invoice['id'],
            'external_id' => $params['external_id'],
            'total_amount' => $totalPrice,
            'status' => 'pending',
        ]);

        foreach ($cartItems as $item) {
            TransactionDetail::create([
                'transaction_header_id' => $transactionHeader->id,
                'course_id' => $item->course_id,
                'price' => $item->course->price,
            ]);
        }

        CourseCart::where('user_id', $user->id)->delete();

        return response()->json(['invoice_url' => $invoice['invoice_url']]);
    }

    public function success(Request $request)
    {
        // Handle successful payment
        // You can update the transaction status and enroll the user in the course
        return response()->json(['message' => 'Payment successful.']);
    }

    public function failure(Request $request)
    {
        // Handle failed payment
        return response()->json(['message' => 'Payment failed.']);
    }
}