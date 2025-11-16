<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\CourseCart;
use App\Models\TransactionDetail;
use App\Models\TransactionHeader;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;

class TransactionController extends Controller
{
    public function checkout(CheckoutRequest $request)
    {
        Configuration::setXenditKey(env('XENDIT_API_KEY'));

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
            'external_id' => 'tutorfinder-'.time(),
            'payer_email' => $user->email,
            'description' => 'Course Purchase',
            'amount' => $totalPrice,
            'success_redirect_url' => route('transactions.index'),
            'failure_redirect_url' => route('transactions.failure'),
        ];

        $createInvoiceRequest = new CreateInvoiceRequest($params);
        $apiInstance = new InvoiceApi();
        $invoice = $apiInstance->createInvoice($createInvoiceRequest);

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

        return Inertia::location($invoice['invoice_url']);
    }

    public function cancel(TransactionHeader $transaction)
    {
        $user = Auth::user();
        abort_unless($transaction->user_id === $user->id && $transaction->status === 'pending', 403);
        $transaction->delete();

        return redirect()->back()->with('success', 'Transaction cancelled.');
    }

    public function pay(TransactionHeader $transaction)
    {
        $user = Auth::user();
        abort_unless($transaction->user_id === $user->id && $transaction->status === 'pending', 403);

        Configuration::setXenditKey(env('XENDIT_API_KEY'));
        $params = [
            'external_id' => 'tutorfinder-'.time(),
            'payer_email' => $user->email,
            'description' => 'Course Purchase',
            'amount' => (int) $transaction->total_amount,
            'success_redirect_url' => route('transactions.index'),
            'failure_redirect_url' => route('transactions.failure'),
        ];
        $createInvoiceRequest = new CreateInvoiceRequest($params);
        $apiInstance = new InvoiceApi();
        $invoice = $apiInstance->createInvoice($createInvoiceRequest);

        $transaction->update([
            'xendit_invoice_id' => $invoice['id'],
            'external_id' => $params['external_id'],
        ]);

        return Inertia::location($invoice['invoice_url']);
    }

    public function index()
    {
        $user = Auth::user();
        $transactions = TransactionHeader::where('user_id', $user->id)
            ->with('details.course.user')
            ->latest()
            ->get();

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function failure()
    {
        return Inertia::render('Transaction/Failure', [
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function adminIndex(User $user)
    {
        $transactions = TransactionHeader::where('user_id', $user->id)
            ->with('details.course.user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Transaction/Index', [
            'transactions' => $transactions,
            'viewedUser' => $user,
            'auth' => ['user' => Auth::user()],
        ]);
    }
}
