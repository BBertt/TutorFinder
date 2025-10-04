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
        // 1. Verify the callback token
        $callbackToken = $request->header('x-callback-token');
        if ($callbackToken !== env('XENDIT_CALLBACK_VERIFICATION_TOKEN')) {
            Log::warning('Xendit Webhook: Invalid callback token.');
            return response()->json(['message' => 'Invalid callback token'], 403);
        }

        $payload = $request->all();
        Log::info('Xendit Webhook Received:', $payload);

        // 2. Find the transaction using the external_id
        $transaction = TransactionHeader::where('external_id', $payload['external_id'])->first();

        if (!$transaction) {
            Log::error('Xendit Webhook: Transaction not found for external_id: ' . $payload['external_id']);
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        // 3. Check if the webhook is for a successful payment and the transaction is still pending
        if ($payload['status'] === 'PAID' && $transaction->status === 'pending') {
            // 4. Update the transaction status
            $transaction->status = 'paid';
            $transaction->paid_at = now(); // Assuming you have a paid_at column
            $transaction->payment_method = $payload['payment_method'];
            $transaction->payment_channel = $payload['payment_channel'];
            $transaction->save();

            // 5. Enroll the user in the courses
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

        // 6. Acknowledge the webhook
        return response()->json(['message' => 'Webhook processed successfully'], 200);
    }
}
