# SERVER.PY

from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

progress_id = 1 # <--- where in the lecture the user is at
lecture = {
    "1": {
        "id":"1",
        "title":"2:3",
        "video_link":"https://youtu.be/2teP7CIYoII?si=Hqxqy9yFV3lo3lRJ",
        "text":"Watch this video. Try speaking the mnemonic device for 2:3: “nice cup of tea”",
    },
    "2": {
        "id":"2",
        "title":"3:4",
        "video_link":"https://youtu.be/61W9VthQYHQ?si=jLUjyEKTd5ZSWyem",
        "text":"Watch this video. Try speaking the mnemonic device for 3:4: “pass the golden butter”",
    },
    "3": {
        "id":"3",
        "title":"4:5",
        "video_link":"https://youtu.be/2OCfwdANMkk?si=bH8O5W625RRTg4FL",
        "text":"Watch this video. Try speaking the mnemonic device for 4:5: “I'm looking for a home to buy”",
    },
}

@app.route('/')
def home():
    return render_template('home.html') 

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/learn/<id>', methods=['GET'])
def learn(id):
    # global progress_id
    # progress_id += 1
    current_lesson = lecture.get(id)
    lesson_ids = sorted(lecture.keys())
    current_index = lesson_ids.index(id) if id in lesson_ids else 0
    
    prev_lesson = lecture.get(lesson_ids[current_index - 1]) if current_index > 0 else None
    next_lesson = lecture.get(lesson_ids[current_index + 1]) if current_index < len(lesson_ids) - 1 else None

    return render_template('learn.html', current_lesson=current_lesson, prev_lesson=prev_lesson, next_lesson=next_lesson)


if __name__ == '__main__':
   app.run(debug = True, port=5001)
