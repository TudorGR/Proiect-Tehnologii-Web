from flask import Flask, Blueprint, render_template, send_from_directory, jsonify, request
import os
import sqlite3
import datetime

# Definirea Blueprint-ului pentru fișierele statice
static_files_bp = Blueprint('static_files', __name__)

# Rută pentru a servi fișiere statice din directorul rădăcină al aplicației
@static_files_bp.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.getcwd()  # Directorul rădăcină al aplicației Flask
    return send_from_directory(root_dir, filename)

# Definirea obiectului Flask
app = Flask(__name__, template_folder='.')

@app.route('/api/problems')
def get_problems():
    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()

    # Execută o interogare pentru a obține toate problemele din baza de date
    cursor.execute('SELECT * FROM Problems;')
    
    # Extrage toate rândurile (problemele) din rezultatul interogării
    problems = cursor.fetchall()

    # Închide conexiunea cu baza de date
    conn.close()

    # Returnează lista de probleme obținute din baza de date
    return problems



@app.route('/deleteProblem',methods=['POST'])
def deleteProblem():
    data=request.json
    problemNumber = data.get("problemNumber")


    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM Problems WHERE id = ?", (problemNumber,))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Stergere reușită!'})


@app.route('/addProblem',methods=['POST'])
def addProblem():
    data=request.json
    numeProblema = data.get("numeProblema")
    ID = data.get("ID")
    descriere= data.get("descriere")
    dificultate= data.get("dificultate")
    categorie= data.get("categorie")

    print(numeProblema+" va fi adaugat")

    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()
    
    cursor.execute("INSERT INTO Problems (id,titlu,descriere,dificultate,categorie) VALUES (?,?,?,?,?)", (ID,numeProblema,descriere,dificultate,categorie))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Adaugare reușită!'})




@app.route('/update_problem', methods=['POST'])
def update_problem():
    data=request.json
    problemNumber = data.get("problemNumber")
    cod = data.get('cod')
    timp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ID=data.get('ID')

    print(data)
    
    # Conectați-vă la baza de date
    conn = sqlite3.connect('server.db')
    cursor = conn.cursor()


    # Executați instrucțiunea SQL de actualizare
    cursor.execute("INSERT INTO attempts (id_problema, cod, timp, id_user) VALUES (?, ?, ?,?)", (problemNumber, cod, timp,ID))

    # Comiteți schimbările și închideți conexiunea cu baza de date
    conn.commit()
    conn.close()

    # Returnează un mesaj JSON de confirmare
    return jsonify({'message': 'Actualizare reușită!'})


# Ruta pentru pagina de dashboard a elevului
@app.route('/pages/student/student_dashboard.html')
def student_dashboard():
    problems = get_problems()
    return render_template('pages/student/student_dashboard.html', problems=problems)

@app.route('/pages/admin_dashboard.html')
def admin_dashboard():
    problems = get_problems()
    return render_template('pages/admin_dashboard.html', problems=problems)



# Ruta pentru a servi fișiere statice din directorul 'pages'
@app.route('/pages/<path:filename>')
def pages(filename):
    return send_from_directory(os.path.join(app.root_path, 'pages'), filename)

@app.route('/javascript/<path:filename>')
def javascript(filename):
    return send_from_directory(os.path.join(app.root_path, 'javascript'), filename)

# Înregistrarea Blueprint-ului pentru fișierele statice în aplicația principală
app.register_blueprint(static_files_bp)

# Rularea aplicației Flask
if __name__ == '__main__':
    app.run(debug=True)
