<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $contacts = collect();

        if ($user->role->name === 'tutor') {
            $courseIds = $user->courses()->pluck('id');
            $studentIds = CourseEnrollment::whereIn('course_id', $courseIds)->distinct()->pluck('user_id');
            $contacts = User::whereIn('id', $studentIds)->get();
        } else {
            $courseIds = $user->enrollments()->pluck('course_id');
            $tutorIds = Course::whereIn('id', $courseIds)->distinct()->pluck('user_id');
            $contacts = User::whereIn('id', $tutorIds)->get();
        }


        return Inertia::render('Chat/Index', [
            'contacts' => $contacts,
            'receiver' => null,
            'messages' => [],
        ]);
    }

    public function show(User $receiver)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $contacts = collect();

        if ($user->role->name === 'tutor') {
            $courseIds = $user->courses()->pluck('id');
            $studentIds = CourseEnrollment::whereIn('course_id', $courseIds)->distinct()->pluck('user_id');
            $contacts = User::whereIn('id', $studentIds)->get();
        } else {
            $courseIds = $user->enrollments()->pluck('course_id');
            $tutorIds = Course::whereIn('id', $courseIds)->distinct()->pluck('user_id');
            $contacts = User::whereIn('id', $tutorIds)->get();
        }

        $messages = Chat::with('sender', 'receiver')
            ->where(function ($query) use ($user, $receiver) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $receiver->id);
            })->orWhere(function ($query) use ($user, $receiver) {
                $query->where('sender_id', $receiver->id)
                    ->where('receiver_id', $user->id);
            })->orderBy('created_at', 'asc')->get();

        return Inertia::render('Chat/Index', [
            'contacts' => $contacts,
            'receiver' => $receiver,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, User $receiver)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $chat = Chat::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $receiver->id,
            'message' => $request->message,
        ]);

        return response()->json($chat);
    }

    public function getMessages(User $receiver)
    {
        $user = Auth::user();

        $messages = Chat::with('sender', 'receiver')
            ->where(function ($query) use ($user, $receiver) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $receiver->id);
            })->orWhere(function ($query) use ($user, $receiver) {
                $query->where('sender_id', $receiver->id)
                    ->where('receiver_id', $user->id);
            })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    public function destroy(Chat $message)
    {
        if ($message->sender_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['success' => 'Message deleted']);
    }
}
