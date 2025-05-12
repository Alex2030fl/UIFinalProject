# SERVER.PY

from flask import Flask,redirect, url_for, session
from flask import render_template
from flask import Response, request, jsonify
import random
app = Flask(__name__)

app.secret_key = 'your_secret_key'

progress_id = 1 # <--- where in the lecture the user is at
lecture = {
    "1": {
        "id":"1",
        "title":"2:3",
        "video_link":"https://youtu.be/2teP7CIYoII?si=Hqxqy9yFV3lo3lRJ",
        "text":"Watch this video. As you watch, tap your hands onto your lap along with the blue and yellow spots. Try speaking the mnemonic device for 2:3:",
        "mnemonic":"“nice cup of tea”"
    },
    "2": {
        "id":"2",
        "title":"3:4",
        "video_link":"https://youtu.be/61W9VthQYHQ?si=jLUjyEKTd5ZSWyem",
        "text":"Watch this video. As you watch, tap your hands onto your lap along with the teal and red spots. Try speaking the mnemonic device for 3:4:",
        "mnemonic": "“pass the golden butter”"
    },
    "3": {
        "id":"3",
        "title":"4:5",
        "video_link":"https://youtu.be/2OCfwdANMkk?si=bH8O5W625RRTg4FL",
        "text":"Watch this video. As you watch, tap your hands onto your lap along with the red and teal spots. Try speaking the mnemonic device for 4:5:",
        "mnemonic": "“I'm looking for a home to buy”"
    },
}
questions = [
    {"question": "Listen to this song: What polyrhythm do you hear?", "options": ["3:4", "2:3", "2:5"], "answer": "2:3", "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092433517%3Fsecret_token%3Ds-59tSheMNF11&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"},
    {"question": "Listen to this song: What polyrhythm do you hear?", "options": ["2:3", "3:4", "2:5"], "answer": "2:5", "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092434474%3Fsecret_token%3Ds-j4i2OlZ5yXm&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"},
    {"question": "Listen to this song: What polyrhythm do you hear?", "options": ["5:4", "3:5", "3:4"], "answer": "3:4", "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092435086%3Fsecret_token%3Ds-UvMsF2aVPKo&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"},
    {"question": "Listen to this song: What polyrhythm do you hear?", "options": ["3:5", "2:3", "2:5"], "answer": "3:5", "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092435479%3Fsecret_token%3Ds-deVlJBZrxFj&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"}
]

match_quizzes = [
    {
        "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092456344%3Fsecret_token%3Ds-2wACIXme6qu&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
        "answer": ["1:1", "1:2", "1:3", "2:3"]
    },
    {
        "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092456485%3Fsecret_token%3Ds-Z3g0VqsWy5g&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
        "answer": ["3:1", "3:2", "3:4", "5:4"]
    },
    {
        "media": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2092456611%3Fsecret_token%3Ds-zbOx94mNuls&color=%237c4585&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
        "answer": ["4:1", "4:2", "3:4", "4:4"]
    }
]

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<id>', methods=['GET'])
def learn(id):
    # global progress_id
    # progress_id += 1
    current_lesson = lecture.get(id)
    lesson_ids = sorted(lecture.keys())
    current_index = lesson_ids.index(id) if id in lesson_ids else 0
    
    prev_lesson = lecture.get(lesson_ids[current_index - 1]) if current_index > 0 else None
    next_lesson = lecture.get(lesson_ids[current_index + 1]) if current_index < len(lesson_ids) - 1 else None

    # return render_template('learn.html', current_lesson=current_lesson, prev_lesson=prev_lesson, next_lesson=next_lesson)
    return render_template('learn.html', 
                         current_lesson=current_lesson, 
                         prev_lesson=prev_lesson, 
                         next_lesson=next_lesson,
                         lecture=lecture,
                         questions=questions,
                         match_quizzes=match_quizzes)


@app.route('/quiz/<int:qnum>', methods=['GET', 'POST'])
def quiz(qnum):
    if qnum >= len(questions):
        return redirect(url_for('result'))

    if qnum == 0 and request.method == 'GET':
        session['answers'] = []

    if request.method == 'POST':
        selected = request.form.get('option')
        answers = session.get('answers', [])

        if len(answers) <= qnum:
            answers.extend([None] * (qnum + 1 - len(answers)))

        answers[qnum] = selected
        session['answers'] = answers

        if qnum == len(questions) - 1:
            return redirect(url_for('result'))
        else:
            return redirect(url_for('quiz', qnum=qnum + 1))

    # return render_template('quiz.html', question=questions[qnum], qnum=qnum, total=len(questions))
    return render_template('quiz.html', 
                         question=questions[qnum], 
                         qnum=qnum, 
                         total=len(questions),
                         lecture=lecture,
                         questions=questions,
                         match_quizzes=match_quizzes)


@app.route('/learning')
def learning():
    return render_template('learning.html')

@app.route('/match-order/<int:quiz_id>', methods=['GET', 'POST'])
def match_order(quiz_id):
    if quiz_id >= len(match_quizzes):
        return redirect(url_for('match_results', quiz_id=len(match_quizzes) - 1))

    question = match_quizzes[quiz_id]
    options = question["answer"].copy()
    random.shuffle(options)

    # Only reset at the beginning
    if quiz_id == 0 and request.method == 'GET':
        session['answers'] = []

    if request.method == 'POST':
        # Read ordered answers from the form
        user_answers = request.form.getlist('answers[]')  # Full ordered list from drag-and-drop
        correct_answers = match_quizzes[quiz_id]["answer"]

        # Compare answers in order
        score = sum(1 for i in range(min(len(correct_answers), len(user_answers))) if user_answers[i] == correct_answers[i])
        session[f"match_quiz_{quiz_id}_score"] = score

        # Store for display or review (optional)
        all_match_answers = session.get('answers', [])
        if len(all_match_answers) <= quiz_id:
            all_match_answers.extend([None] * (quiz_id + 1 - len(all_match_answers)))
        all_match_answers[quiz_id] = user_answers
        session['answers'] = all_match_answers

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({
                'success': True,
                'redirect_url': url_for('match_results', quiz_id=quiz_id)
            })
        # Go to results page after quiz completion
        return redirect(url_for('match_results', quiz_id=quiz_id))

    # return render_template('match_quiz.html', question=question, options=options, quiz_id=quiz_id)
    return render_template('match_quiz.html',
                           question=question,
                           options=options,
                           quiz_id=quiz_id,
                           qnum=quiz_id,
                           match_quizzes=match_quizzes,
                           total=len(match_quizzes))


@app.route('/match-results/<int:quiz_id>')
def match_results(quiz_id):
    # Get score from session
    score = session.get(f'match_quiz_{quiz_id}_score')

    # If score is not found, redirect back to the quiz
    if score is None:
        return redirect(url_for('match_order', quiz_id=quiz_id))

    # Total answers in the current quiz
    total = len(match_quizzes[quiz_id]['answer'])

    # Check if there's a next quiz (quiz_id is not the last one)
    if quiz_id + 1 < len(match_quizzes):
        next_quiz_url = url_for('match_order', quiz_id=quiz_id + 1)
        message = "Redirecting to the next quiz..."
    else:
        next_quiz_url = url_for('home')  # Redirect to home if no more quizzes
        message = "Done with all quizzes, redirecting home..."

    # Render results page with score and redirect information
    return render_template('match_results.html', score=score, total=total, quiz_id=quiz_id, next_quiz_url=next_quiz_url, message=message)

@app.route('/result')
def result():
    answers = session.get('answers', [])
    score = 0
    quiz_id = 1

    if answers and len(answers) == len(questions):
        score = sum(1 for i in range(len(answers)) if answers[i] == questions[i]['answer'])

    total = len(questions)
    session['score'] = score

    return render_template('results.html', score=score, total=total, quiz_id=0)

if __name__ == '__main__':
   app.run(debug = True, port=5001)
