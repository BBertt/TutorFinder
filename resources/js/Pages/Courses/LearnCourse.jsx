
import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import axios from 'axios';
import VideoPlayer from '@/Components/VideoPlayer';

function LearnCourse({ course, progress: initialProgress, last_watched_lesson_id }) {
    const findLesson = (lessonId) => {
        for (const section of course.sections) {
            for (const lesson of section.lessons) {
                if (lesson.id === lessonId) {
                    return lesson;
                }
            }
        }
        return course.sections[0].lessons[0];
    };

    const [currentLesson, setCurrentLesson] = React.useState(findLesson(last_watched_lesson_id));
    const [progress, setProgress] = React.useState(initialProgress);

    const handleVideoEnded = () => {
        axios.post(`/course-progress/${currentLesson.id}`, {
            course_id: course.id,
        }).then(() => {
            const newProgress = [...progress];
            const progressIndex = newProgress.findIndex(p => p.course_lesson_id === currentLesson.id);
            if (progressIndex > -1) {
                newProgress[progressIndex].is_completed = true;
            } else {
                newProgress.push({ course_lesson_id: currentLesson.id, is_completed: true });
            }
            setProgress(newProgress);
        });
    };

    return (
        <div>
            <Head title={course.title} />
            <div className="flex flex-col md:flex-row h-screen">
                <div className="w-full md:w-1/4 bg-white border-r overflow-y-auto">
                    <div className="p-4 bg-gray-200">
                        <h2 className="text-xl font-bold">Course Content</h2>
                    </div>
                    <ul>
                        {course.sections.map((section) => (
                            <li key={section.id} className="mb-4">
                                <h3 className="text-lg font-bold p-4">{section.title}</h3>
                                <ul>
                                    {section.lessons.map((lesson, index) => (
                                        <li key={lesson.id} className={`p-4 cursor-pointer ${currentLesson.id === lesson.id ? 'bg-gray-300' : ''}`}>
                                            <div onClick={() => setCurrentLesson(lesson)}>
                                                Episode {index + 1}: {lesson.title}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-3/4 p-4 overflow-y-auto">
                    <div>
                        <VideoPlayer videoUrl={currentLesson.s3_video_url || currentLesson.video_url} onVideoEnded={handleVideoEnded} />
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                            <div className="flex items-center mt-4">
                                <img
                                    className="w-10 h-10 rounded-full mr-4"
                                    src={
                                        course.user.profile_image_url ||
                                        "/assets/icons/profile.svg"
                                    }
                                    alt={course.user.first_name}
                                />
                                <Link href={`/tutors/${course.user.id}`} className="text-lg font-bold">{course.user.first_name} {course.user.last_name}</Link>
                            </div>
                            <p className="text-gray-600 mt-4">{currentLesson.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

LearnCourse.layout = (page) => <Layout children={page} />;

export default LearnCourse;
