<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\CourseCart;
use App\Models\TransactionHeader;
use App\Models\TransactionDetail;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Http;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;

use Illuminate\Foundation\Testing\WithoutMiddleware;

class TransactionTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_user_can_checkout()
    {
        // 1. Create a user and authenticate them
        $user = User::factory()->create();
        $this->actingAs($user);

        // 2. Create a course
        $course = Course::factory()->create(['price' => 100]);

        // 3. Add the course to the user's cart
        CourseCart::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);

        // 4. Mock the Xendit API call
        $config = new Configuration();
        $config->setApiKey('test_api_key');
        $this->mock(InvoiceApi::class, function ($mock) {
            $mock->shouldReceive('createInvoice')->andReturn([
                'id' => 'test_invoice_id',
                'invoice_url' => 'https://checkout.xendit.co/web/invoices/test_invoice_id',
            ]);
        });

        // 5. Call the checkout endpoint
        $response = $this->postJson('/checkout');

        // 6. Assert that the response has a successful status code and contains the invoice URL
        $response->assertStatus(200);
        $response->assertJsonStructure(['invoice_url']);

        // 7. Assert that the transaction records have been created in the database
        $this->assertDatabaseHas('transaction_headers', [
            'user_id' => $user->id,
            'xendit_invoice_id' => 'test_invoice_id',
            'total_amount' => 100,
            'status' => 'pending',
        ]);

        $transactionHeader = TransactionHeader::first();
        $this->assertDatabaseHas('transaction_details', [
            'transaction_header_id' => $transactionHeader->id,
            'course_id' => $course->id,
            'price' => 100,
        ]);

        // 8. Assert that the user's cart is empty
        $this->assertDatabaseMissing('course_carts', [
            'user_id' => $user->id,
        ]);
    }
}
