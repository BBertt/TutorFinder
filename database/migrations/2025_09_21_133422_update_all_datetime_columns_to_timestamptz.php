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
        Schema::table('roles', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->timestampTz('email_verified_at')->nullable()->change();
            $table->date('date_of_birth')->change();
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
        });
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->timestampTz('failed_at')->useCurrent()->change();
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('courses', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('course_sections', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('course_lessons', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('course_enrollments', function (Blueprint $table) {
            $table->timestampTz('enrollment_date')->change();
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('course_carts', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('course_reviews', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('transaction_headers', function (Blueprint $table) {
            $table->timestampTz('transaction_date')->change();
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('chats', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('forums', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('certifications', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
        Schema::table('forum_replies', function (Blueprint $table) {
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->change();
            $table->dateTime('date_of_birth')->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
        });
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->timestamp('failed_at')->useCurrent()->change();
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('courses', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('course_sections', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('course_lessons', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('course_enrollments', function (Blueprint $table) {
            $table->timestamp('enrollment_date')->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('course_carts', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('course_reviews', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('tutor_reviews', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('transaction_headers', function (Blueprint $table) {
            $table->timestamp('transaction_date')->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('chats', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('forums', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('certifications', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
        Schema::table('forum_replies', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
    }
};
