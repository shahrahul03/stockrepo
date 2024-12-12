from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
from tensorflow import keras
from keras.models import load_model


from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from the React frontend

# Load the pre-trained Keras model
model = load_model('StockPredictionsModel.kerass')

# Define a route to fetch stock data
@app.route('/stock-data', methods=['GET'])
def get_stock_data():
    stock_symbol = request.args.get('stockSymbol', 'GOOG')
    start = '2012-01-01'
    end = '2024-11-30'

    try:
        data = yf.download(stock_symbol, start=start, end=end)
        data.reset_index(inplace=True)
        data_json = data.to_dict(orient='records')
        return jsonify(data_json)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Define a route to predict stock prices
@app.route('/predict', methods=['POST'])
def predict():
    try:
        stock_data = request.json.get('stockData')

        # Convert the stock data into a DataFrame
        df = pd.DataFrame(stock_data)

        # Prepare the data for prediction
        data_train = df['Close'][0:int(len(df)*0.80)]
        data_test = df['Close'][int(len(df)*0.80):]

        scaler = MinMaxScaler(feature_range=(0, 1))
        data_test_scaled = scaler.fit_transform(data_test.values.reshape(-1, 1))

        x, y = [], []
        for i in range(100, len(data_test_scaled)):
            x.append(data_test_scaled[i-100:i])
            y.append(data_test_scaled[i, 0])

        x = np.array(x)
        y = np.array(y)

        # Make predictions
        predictions = model.predict(x)
        predictions = predictions * scaler.scale_

        # Return predictions as response
        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=6000)
