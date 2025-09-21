<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transaction_headers', function (Blueprint $table) {
            $table->string('xendit_invoice_id')->nullable()->after('user_id');
            $table->string('external_id')->nullable()->after('xendit_invoice_id');
            $table->decimal('total_amount', 10, 2)->after('external_id');
            $table->dropColumn('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_headers', function (Blueprint $table) {
            $table->dropColumn('xendit_invoice_id');
            $table->dropColumn('external_id');
            $table->dropColumn('total_amount');
            $table->timestamp('transaction_date')->after('user_id');
        });
    }
};