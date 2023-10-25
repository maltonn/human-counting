#表示用Webサーバ
import datetime
from flask import Flask, send_from_directory,jsonify

app = Flask(__name__)

# ルートURLでindex.htmlを表示
@app.route('/')
def index():
    return send_from_directory('templates/', 'index.html')

@app.route('/style.css')
def static_css():
    return send_from_directory('templates/', 'style.css')
@app.route('/main.js')
def static_js():
    return send_from_directory('templates/', 'main.js')

@app.route('/log')
def res_log():
    L=[]
    with open ('log.txt','r') as f:
        time_str,id,direction=f.readline().split(',')
        timestamp=datetime.datetime.strptime(time_str, "%d/%m/%Y").timestamp()
        L.append({
            'timestamp':timestamp,
            'direction':direction
        })
    
    return ['a', 'b', 'c']

if __name__ == '__main__':
    app.run(debug=True)
