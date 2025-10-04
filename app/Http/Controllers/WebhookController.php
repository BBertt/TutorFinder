<?php

namespace App\Http\Controllers;

use App\Models\TransactionHeader;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle incoming Xendit webhooks.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function handleXendit(Request $request)
    {
        $callbackToken = $request->header('x-callback-token');
        if ($callbackToken !== env('XENDIT_CALLBACK_VERIFICATION_TOKEN')) {
            Log::warning('Xendit Webhook: Invalid callback token.');
            return response()->json(['message' => 'Invalid callback token'], 403);
        }

        $payload = $request->all();
        Log::info('Xendit Webhook Received:', $payload);

        $transaction = TransactionHeader::where('external_id', $payload['external_id'])->first();

        if (!$transaction) {
            Log::error('Xendit Webhook: Transaction not found for external_id: ' . $payload['external_id']);
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if ($payload['status'] === 'PAID' && $transaction->status === 'pending') {
            $transaction->status = 'paid';
            $transaction->paid_at = now();
            $transaction->payment_method = $payload['payment_method'];
            $transaction->payment_channel = $payload['payment_channel'];
            $transaction->save();

            foreach ($transaction->details as $detail) {
                CourseEnrollment::create([
                    'user_id' => $transaction->user_id,
                    'course_id' => $detail->course_id,
                    'enrollment_date' => now(),
                ]);
            }

            Log::info('Xendit Webhook: Successfully processed payment for external_id: ' . $payload['external_id']);
        } else {
            Log::info('Xendit Webhook: Ignoring event for external_id: ' . $payload['external_id'] . ' with status: ' . $payload['status'] . ' and transaction status: ' . $transaction->status);
        }

        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }
}
