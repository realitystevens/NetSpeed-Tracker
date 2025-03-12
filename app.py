import speedtest
from speedtest import ConfigRetrievalError 
from flask import Flask, render_template, jsonify


app = Flask(__name__)
speedtest_history = []

def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        upload_speed = st.upload() / 1_000_000  # Convert to Mbps
        ping = st.results.ping

        result = {
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping, 2)
        }
    except ConfigRetrievalError as config_error:
        result = {
            "download": "Error retrieving configuration: {config_error}",
            "upload": "Error retrieving configuration: {config_error}",
            "ping": "Error retrieving configuration: {config_error}",
        }
    except Exception as e:
        result = {
            "download": "Error running speedtest: {e}",
            "upload": "Error running speedtest: {e}",
            "ping": "Error running speedtest: {e}",
        }

    return result



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/speedtest', methods=['GET'])
def speedtest_api():
    result = run_speedtest()
    speedtest_history.append(result)
    return jsonify(result)


@app.route('/api/history', methods=['GET'])
def history_api():
    return jsonify(speedtest_history)






if __name__ == '__main__':
    app.run(debug=True)
