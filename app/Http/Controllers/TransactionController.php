<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\CourseCart;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

class TransactionController extends Controller
{
    public function checkout(CheckoutRequest $request)
    {
        $config = new Configuration();
        $config->setApiKey(env('XENDIT_API_KEY'));

        $user = Auth::user();
        $cartItemIds = $request->validated()['course_cart_ids'];

        $cartItems = CourseCart::where('user_id', $user->id)
                                ->whereIn('id', $cartItemIds)
                                ->get();

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

        $apiInstance = resolve(InvoiceApi::class);
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
                'price_at_transaction' => $item->course->price,
            ]);
        }

        CourseCart::whereIn('id', $cartItemIds)->where('user_id', $user->id)->delete();

        return response()->json(['invoice_url' => $invoice['invoice_url']]);
    }

    public function success()
    {
        // Handle successful payment
        // You can update the transaction status and enroll the user in the course
        return response()->json(['message' => 'Payment successful.']);
    }

    public function failure()
    {
        // Handle failed payment
        return response()->json(['message' => 'Payment failed.']);
    }

    public function showCheckoutPage()
    {
        $user = Auth::user();
        $cartItems = CourseCart::where('user_id', $user->id)->with('course')->get();

        return Inertia::render('Transaction/Checkout', [
            'cartItems' => $cartItems,
            'auth' => [
                'user' => auth()->user()->load('role'),
            ],
        ]);
    }
}