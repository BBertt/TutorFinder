<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_header_id',
        'course_id',
        'price_at_transaction',
    ];

    public function header()
    {
        return $this->belongsTo(TransactionHeader::class, 'transaction_header_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}