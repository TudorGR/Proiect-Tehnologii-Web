from flask import Flask, Blueprint, render_template, send_from_directory, jsonify, request
import os
import sqlite3
import datetime
import logging

# Configurare logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# Blueprint pentru fișiere statice
static_files_bp = Blueprint('static_files', __name__)

# Ruta pentru servirea fișierelor statice din directorul principal
@static_files_bp.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.getcwd()  # Directorul rădăcină al aplicației Flask
    return send_from_directory(root_dir, filename)

# Definirea obiectului Flask
app = Flask(__name__, template_folder='.')

# Rute pentru pagini HTML
@app.route('/')
def home():
    return send_from_directory('pages', 'index.html')

@app.route('/pages/student/student_dashboard.html')
def student_dashboard():
    problems = get_problems()
    return render_template('pages/student/student_dashboard.html', problems=problems)

@app.route('/pages/teacher_dashboard.html')
def teacher_dashboard():
    classes = get_classes()
    problems=get_problems_unverified();
    return render_template('pages/teacher_dashboard.html', classes=classes,problems=problems)

@app.route('/pages/admin_dashboard.html')
def admin_dashboard():
    problems = get_problems_unverified()
    users = get_users()
    classes = get_classes()
    return render_template('pages/admin_dashboard.html', problems=problems, users=users, classes=classes)

# Rute pentru servirea fișierelor statice din directoarele 'pages' și 'javascript'
@app.route('/pages/<path:filename>')
def pages(filename):
    return send_from_directory(os.path.join(app.root_path, 'pages'), filename)

@app.route('/javascript/<path:filename>')
def javascript(filename):
    return send_from_directory(os.path.join(app.root_path, 'javascript'), filename)

# Rute API

@app.route('/api/classes')
def get_classes():
    return query_db('SELECT * FROM Classes;')

@app.route('/api/users')
def get_users():
    return query_db('SELECT * FROM Users;')

@app.route('/api/problems')
def get_problems():
    return query_db('SELECT * FROM Problems where verified=1;')

@app.route('/api/problemsUnverified')
def get_problems_unverified():
    return query_db('SELECT * FROM Problems where verified=0;')

@app.route('/api/getProblemCode', methods=['POST'])
def getProblemCode():
    data = request.json
    id_user = data.get('id_user')
    id_problema = data.get('id_problema')
    result = query_db('SELECT cod FROM attempts WHERE id_user = ? AND id_problema = ?', [id_user, id_problema])
    if result:
        return jsonify({'code': result})
    else:
        return jsonify({'error': 'No code found'}), 404
    

@app.route('/api/getComments', methods=['POST'])
def get_comments_for_problem():
    data = request.json
    problem_id=data.get('id_problem')
    query = "SELECT * FROM Comments WHERE id_problem = ?"
    comments = query_db(query, (problem_id,))
    return jsonify(comments)


@app.route('/api/studentAttempts', methods=['POST'])
def get_student_attempts():
    data = request.json
    student_id = data.get('student_id')
    
    if student_id is None:
        return jsonify({'error': 'student_id is required'}), 400
    
    query = "SELECT * FROM Attempts WHERE id_user = ?"
    results = query_db(query, (student_id,))
    attempts = [{'id': row[0], 'id_problema': row[1], 'timp': row[2], 'cod': row[3]} for row in results]
    return jsonify(attempts)

# Funcție generală pentru interogări
def query_db(query, args=(), one=False):
    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    cursor.execute(query, args)
    rv = cursor.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv



# Rute pentru adăugare, ștergere și actualizare entități
@app.route('/addProblem', methods=['POST'])
def addProblem():
    return modify_db(
        "INSERT INTO Problems (id, titlu, descriere, dificultate, categorie,verified) VALUES (?, ?, ?, ?, ?,0)",
        "Problema cu ID-ul: {} a fost adaugata.",
        ('ID', 'numeProblema', 'descriere', 'dificultate', 'categorie')
    )

@app.route('/addComment', methods=['POST'])
def addComment():
    return modify_db(
        "INSERT INTO Comments (content, id_user,id_problem) VALUES (?, ?, ?)",
        "Comentariul a fost adaugat.",
        ('content', 'id_user', 'id_problem')
    )

@app.route('/addStudentToClass', methods=['POST'])
def addStudentToClass():
    return modify_db(
        "INSERT INTO Students_Classes (student_id,class_id) VALUES (?, ?)",
        "Problema cu ID-ul: {} a fost adaugata.",
        ('student_id','class_id')
    )

@app.route('/deleteProblem', methods=['POST'])
def deleteProblem():
    return modify_db(
        "DELETE FROM Problems WHERE id = ?",
        "Problema cu ID-ul: {} a fost stearsa.",
        ('ID',)
    )

@app.route('/addClass', methods=['POST'])
def addClass():
    return modify_db(
        "INSERT INTO Classes (id, nume,prof_id) VALUES (?, ?,?)",
        "Clasa cu ID-ul: {} a fost adaugata.",
        ('ID', 'nume','prof_id')
    )

@app.route('/deleteClass', methods=['POST'])
def deleteClass():
    return modify_db(
        "DELETE FROM Classes WHERE id = ?",
        "Clasa cu ID-ul: {} a fost stearsa.",
        ('ID',)
    )

@app.route('/addUser', methods=['POST'])
def addUser():
    return modify_db(
        "INSERT INTO Users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
        "Userul cu ID-ul: {} a fost adaugat.",
        ('ID', 'name', 'email', 'password', 'role')
    )

@app.route('/deleteUser', methods=['POST'])
def deleteUser():
    return modify_db(
        "DELETE FROM Users WHERE id = ?",
        "Userul cu ID-ul: {} a fost sters.",
        ('ID',)
    )

@app.route('/update_problem', methods=['POST'])
def update_problem():
    data = request.json
    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO attempts (id_problema, cod, timp, id_user) VALUES (?, ?, ?, ?)",
        (data.get('problemNumber'), data.get('cod'), datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data.get('ID'))
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Actualizare reușită!'})

@app.route('/checkUserClass', methods=['POST'])
def checkUserClass():
    data = request.json
    student_id = data.get('student_id')
    class_id = data.get('class_id')

    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    
    query = "SELECT 1 FROM Students_Classes WHERE student_id = ? AND class_id = ?"
    cursor.execute(query, (student_id, class_id))
    result = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return jsonify({'exists': result is not None})


@app.route('/api/classStudentCounts', methods=['POST'])
def get_class_student_counts():
    data = request.json
    prof_id = data.get('prof_id')
    
    if prof_id is None:
        return jsonify({'error': 'prof_id is required'}), 400
    
    query = '''
        SELECT Classes.id, Classes.nume, COUNT(Students_Classes.student_id) as student_count
        FROM Classes
        LEFT JOIN Students_Classes ON Classes.id = Students_Classes.class_id
        WHERE Classes.prof_id = ?
        GROUP BY Classes.id;
    '''
    results = query_db(query, (prof_id,))
    class_student_counts = [{'id': row[0], 'name': row[1], 'student_count': row[2]} for row in results]
    return jsonify(class_student_counts)


    

# Funcție generală pentru modificarea bazei de date
def modify_db(query, log_message, fields):
    data = request.json
    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    values = tuple(data.get(field) for field in fields)
    cursor.execute(query, values)
    conn.commit()
    conn.close()
    return jsonify({'message': 'Operațiune reușită!'})

# Înregistrarea blueprint-ului pentru fișiere statice
app.register_blueprint(static_files_bp)

# Rularea aplicației Flask
if __name__ == '__main__':
    print("Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)")
    app.run(debug=True)
