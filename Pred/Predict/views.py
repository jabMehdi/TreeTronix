# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import base64
from datetime import datetime
import json
import pickle

from django.shortcuts import render

# Create your views here.
# Import necessary modules
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
import numpy as np
from dateutil import parser
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
import pandas as pd
from django.views.decorators.csrf import csrf_exempt
import sklearn
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
print(sklearn.__version__)

#------------- Training --------------
@api_view(['POST'])
def trainCom_view(request):
    if request.method == 'POST':
        data = request.data  # Access the data directly
        # Check if data is an array
        if isinstance(data, list):
            # Initialize empty lists to store extracted data
            ComActiveTotal=[]    
            time = []

            # Extract the required fields from each data entry
            for entry in data:
                ComActiveTotal.append(entry['ComActiveTotal'])
                timestamp_ms = entry['time']
                # Convert the timestamp to a human-readable date
                timestamp_s = timestamp_ms / 1000
                time = datetime.fromtimestamp(timestamp_s)

            data = {'time': time,'com': ComActiveTotal}
            data_df = pd.DataFrame(data)

            data_df['timestamp'] = pd.to_datetime(data_df['time'])
            data_df['timestamp_numerical'] = data_df['timestamp'].view('int64')

             # Add column for cumulative mean of com up until the current timestamp
            data_df['cumulative_mean'] = data_df['com'].expanding().mean()

            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            data_df.ffill(inplace=True)

            X = data_df[['timestamp_numerical', 'cumulative_mean']]
            y = data_df[['com']]
            print("Model In phase 2 !.")
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

            model = LinearRegression()

            # Train the model with 'timestamp_numerical' and 'cumulative_mean'
            model.fit(X_train, y_train)
            print("Model trained successfully !.")
            try:
                # Serialize the model to binary data
                model_data = pickle.dumps(model)
                model_data_decoded = model_data.decode('latin1')
                # Serialization test
                print(model_data)
                # Return the binary data as an HTTP response with the correct content type
                response = HttpResponse(model_data_decoded, content_type='application/octet-stream')
                return response
            except Exception as e:
                # Handle any exceptions here
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return HttpResponseBadRequest("Invalid data format. Expecting an array of data.")
    else:
        return HttpResponseBadRequest("Invalid request method for training the model.")

@api_view(['POST'])
def trainHum_view(request):
    if request.method == 'POST':
        data = request.data  # Access the data directly
        # Check if data is an array
        if isinstance(data, list):
            # Initialize empty lists to store extracted data
            temperature = []
            humidity = []
            voltage = []
            time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            data_df['lagged_voltage'] = data_df['vol'].shift(1)

            X = data_df[['lagged_temperature', 'lagged_Hum']]
            y = data_df['hum']
            X = X.dropna()
            y = y.iloc[X.index]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
            model = LinearRegression()
            model.fit(X_train, y_train)
            print("Model trained successfully !.")
            try:
                # Serialize the model to binary data
                model_data = pickle.dumps(model)
                model_data_decoded = model_data.decode('latin1')
                # Serialization test
                print(model_data)
                # Return the binary data as an HTTP response with the correct content type
                response = HttpResponse(model_data_decoded, content_type='application/octet-stream')
                return response
            except Exception as e:
                # Handle any exceptions here
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return HttpResponseBadRequest("Invalid data format. Expecting an array of data.")
    else:
        return HttpResponseBadRequest("Invalid request method for training the model.")

@api_view(['POST'])
def trainVol_view(request):
    if request.method == 'POST':
        data = request.data  # Access the data directly
        # Check if data is an array
        if isinstance(data, list):
            # Initialize empty lists to store extracted data
            temperature = []
            humidity = []
            voltage = []
            time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            data_df['lagged_voltage'] = data_df['vol'].shift(1)

            X = data_df['lagged_voltage'].values.reshape(-1, 1)
            y = data_df['vol']
            nan_indices = ~np.isnan(X).flatten()
            X = X[nan_indices]
            y = y.iloc[nan_indices]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
            model = LinearRegression()
            model.fit(X_train, y_train)
            print("Model trained successfully !.")
            try:
                # Serialize the model to binary data
                model_data = pickle.dumps(model)
                model_data_decoded = model_data.decode('latin1')
                # Serialization test
                print(model_data)
                # Return the binary data as an HTTP response with the correct content type
                response = HttpResponse(model_data_decoded, content_type='application/octet-stream')
                return response
            except Exception as e:
                # Handle any exceptions here
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return HttpResponseBadRequest("Invalid data format. Expecting an array of data.")
    else:
        return HttpResponseBadRequest("Invalid request method for training the model.")


@api_view(['POST'])
def trainTemp_view(request):
    if request.method == 'POST':
        data = request.data  # Access the data directly
        if isinstance(data, list):
            # Initialize empty lists to store extracted data
            temperature = []
            humidity = []
            voltage = []
            time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            data_df['lagged_voltage'] = data_df['vol'].shift(1)

            X = data_df[['lagged_temperature', 'lagged_Hum']]
            y = data_df['temp']
            X = X.dropna()
            y = y.iloc[X.index]
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
            model = LinearRegression()
            model.fit(X_train, y_train)
            print("Model trained successfully!")

            try:
                # Serialize the model to binary data
                model_data = pickle.dumps(model)
                model_data_decoded = model_data.decode('latin1')
                # Return the binary data as an HTTP response with the correct content type
                response = HttpResponse(model_data_decoded, content_type='application/octet-stream')
                return response
            except Exception as e:
                # Handle any exceptions here
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return HttpResponseBadRequest("Invalid data format. Expecting an array of data.")
    else:
        return HttpResponseBadRequest("Invalid request method for training the model.")

#------------- Testing --------------
@api_view(['POST'])
def test_temperature_model_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            #------------ Data END -----------

            # Perform the test
            X_test = data_df[['lagged_temperature', 'lagged_Hum']].dropna()            
            predictions = loaded_model.predict(X_test)
            data_df.loc[X_test.index, 'temperature_predictions'] = predictions

            for i in X_test.index:
                print(f"Prediction at {data_df.loc[i, 'time']}: {data_df.loc[i, 'temperature_predictions']} \n END")
            
            # Convert the DataFrame to JSON
            result = data_df.to_json(orient='records')

            return JsonResponse({
                'status': 'success',
                'result': result
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })

@api_view(['POST'])
def test_humidite_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            #------------ Data END -----------
            X_test = data_df[['lagged_temperature', 'lagged_Hum']].dropna()
            predictions = loaded_model.predict(X_test)
            data_df.loc[X_test.index, 'humidity_predictions'] = predictions
            for i in X_test.index:
                print(f"Prediction at {data_df.loc[i, 'time']}: {data_df.loc[i, 'humidity_predictions']}")
                print("\n END")
            
            # Convert the DataFrame to JSON
            result = data_df.to_json(orient='records')

            return JsonResponse({
                'status': 'success',
                'result': result
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })

@api_view(['POST'])
def test_voltage_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_voltage'] = data_df['vol'].shift(1)
            #------------ Data END -----------

            X_test_data = data_df['lagged_voltage'].dropna()
            X_test_index = X_test_data.index # Save the index
            X_test = X_test_data.values.reshape(-1, 1) # Reshape to 2D array
            predictions = loaded_model.predict(X_test)
            data_df.loc[X_test_index, 'voltage_predictions'] = predictions # Use saved index here
            for i in X_test_index:
                print(f"Prediction at {data_df.loc[i, 'time']}: {data_df.loc[i, 'voltage_predictions']}")
                print("\n END")
            # Convert the DataFrame to JSON
            result = data_df.to_json(orient='records')

            return JsonResponse({
                'status': 'success',
                'result': result
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })

@api_view(['POST'])
def test_Com_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            # Check if data is an array
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
                ComActiveTotal=[]    
                time = []

            # Extract the required fields from each data entry
            for entry in data:
                ComActiveTotal.append(entry['ComActiveTotal'])
                timestamp_ms = entry['time']
                # Convert the timestamp to a human-readable date
                timestamp_s = timestamp_ms / 1000
                time = datetime.fromtimestamp(timestamp_s)

            data = {'time': time,'com': ComActiveTotal}
            data_df = pd.DataFrame(data)

            data_df['timestamp'] = pd.to_datetime(data_df['time'])
            data_df['timestamp_numerical'] = data_df['timestamp'].view('int64')

             # Add column for cumulative mean of com up until the current timestamp
            data_df['cumulative_mean'] = data_df['com'].expanding().mean()

            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)
            data_df = data_df.fillna(method='ffill')

                # Shuffle the DataFrame rows
            data_df = data_df.sample(frac=1)

            #------------ Data END -----------

            X_test = data_df[['timestamp_numerical', 'cumulative_mean']]
            predictions = loaded_model.predict(X_test)
            data_df.loc[X_test.index, 'predictions'] = predictions
            for i in X_test.index:
                print(f"Prediction at {data_df.loc[i, 'time']}: {data_df.loc[i, 'predictions']}")
                print("\n END")
            # Convert the DataFrame to JSON
            result = data_df.to_json(orient='records')

            return JsonResponse({
                'status': 'success',
                'result': result
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })
    
#------------- Predictions --------------
def predict_temperature(model, data_df, prediction_date):
    # Check if the prediction_date exists in the dataset
    if prediction_date in data_df['time'].values:
      # Case 1: Prediction date is in the dataset
       # Find the most recent available date in the dataset
        most_recent_date = data_df['time'].max()
        # Extract the last 5 available data points for temperature, humidity, and voltage
        last_5_values = data_df[data_df['time'] <= most_recent_date].tail(5)
        lagged_temperature = data_df[data_df['time'] == prediction_date]['lagged_temperature'].values[0]
        lagged_humidity = data_df[data_df['time'] == prediction_date]['lagged_Hum'].values[0]
    else:
        # Case 2: Prediction date is not in the dataset, use most recent available data
        most_recent_date = data_df[data_df['time'] <= prediction_date]['time'].max()
        # Extract the last 5 values for temperature, humidity, and voltage
        last_5_values = data_df[data_df['time'] <= most_recent_date].tail(5)
        lagged_temperature = last_5_values['lagged_temperature'].mean()
        lagged_humidity = last_5_values['lagged_Hum'].mean()

    # Create a new row with the extracted lagged values
    new_row = pd.DataFrame({'lagged_temperature': [lagged_temperature],
                            'lagged_Hum': [lagged_humidity]}, index=[prediction_date])


    if new_row.isnull().values.any():
      # Handle NaN values, for example, by filling them with the mean of their respective columns
      new_row.fillna(data_df.select_dtypes(include=np.number).mean(), inplace=True)
    # Predict the temperature for the new date
    predicted_temperature = model.predict(new_row)
    predicted_temperature_list = predicted_temperature.tolist()
    return predicted_temperature_list

@api_view(['POST'])
def predict_temperature_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            prediction_date_str = request_data.get('date')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            #------------ Data END -----------  
            

            # Convert the prediction_date_str to a datetime object
            prediction_date = parser.parse(prediction_date_str)
            
            # Call the predict_temperature function to make predictions
            predicted_temperature = predict_temperature(loaded_model, data_df, prediction_date)
           

            return JsonResponse({
                'status': 'success',
                'predicted_temperature': predicted_temperature
                
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })


def predict_humidity(model, data_df, prediction_date):
    if prediction_date in data_df['time'].values:
        # Case 1: Prediction date is in the dataset
        most_recent_date = data_df['time'].max()
        last_5_values = data_df[data_df['time'] <= most_recent_date].tail(5)
        lagged_temperature = data_df[data_df['time'] == prediction_date]['lagged_temperature'].values[0]
        lagged_humidity = data_df[data_df['time'] == prediction_date]['lagged_Hum'].values[0]
    else:
        # Case 2: Prediction date is not in the dataset, use most recent available data
        most_recent_date = data_df[data_df['time'] <= prediction_date]['time'].max()
        last_5_values = data_df[data_df['time'] <= most_recent_date].tail(5)
        lagged_temperature = last_5_values['lagged_temperature'].mean()
        lagged_humidity = last_5_values['lagged_Hum'].mean()

    new_row = pd.DataFrame({'lagged_temperature': [lagged_temperature],
                            'lagged_Hum': [lagged_humidity]}, index=[prediction_date])

    if new_row.isnull().values.any():
      # Handle NaN values, for example, by filling them with the mean of their respective columns
      new_row.fillna(data_df.select_dtypes(include=np.number).mean(), inplace=True)
    # Predict humidity using only temperature and humidity
    predicted_humidity = model.predict(new_row[['lagged_temperature', 'lagged_Hum']])
    predicted_humidity_list = predicted_humidity.tolist()
    return predicted_humidity_list

@api_view(['POST'])
def predict_humidity_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            prediction_date_str = request_data.get('date')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_temperature'] = data_df['temp'].shift(1)
            data_df['lagged_Hum'] = data_df['hum'].shift(1)
            #------------ Data END -----------  
            

            # Convert the prediction_date_str to a datetime object
            prediction_date = parser.parse(prediction_date_str)

            # Call the predict_temperature function to make predictions
            predicted_humidity = predict_humidity(loaded_model, data_df, prediction_date)
     

            return JsonResponse({
                'status': 'success',
                'predicted_humidity': predicted_humidity
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })


def predict_voltage(model, data_df, prediction_date):
    # Convert the 'time' column to datetime format
    data_df['time'] = pd.to_datetime(data_df['time'])
    # If the exact timestamp doesn't exist in the data,
    # find the last timestamp that is less than prediction_date
    if prediction_date not in data_df['time'].values:
        previous_date = data_df[data_df['time'] < prediction_date].time.max()
        if pd.isnull(previous_date): # if there are no previous dates in the dataset
            print("Exact timestamp not found in the data. Using the timestamp closest to prediction_date.")
            # Use the mean of all past values
            lagged_voltage = data_df['lagged_voltage'].mean()
        else:
            print("Timestamp is available in the data.")
            lagged_voltage = data_df[data_df['time'] == previous_date]['lagged_voltage'].values[0]
    else:
        print("Timestamp is exactly in the data.")
        lagged_voltage = data_df[data_df['time'] == prediction_date]['lagged_voltage'].values[0]
    # Reshape the data to 2D
    lagged_voltage = np.array([lagged_voltage]).reshape(1, -1)
    # Predict the voltage for the new date
    predicted_voltage = model.predict(lagged_voltage)
    predicted_voltage_list = predicted_voltage.tolist()
    return predicted_voltage_list


@api_view(['POST'])
def predict_voltage_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            prediction_date_str = request_data.get('date')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
             temperature = []
             humidity = []
             voltage = []
             time = []

            # Extract the required fields from each data entry
            for entry in data:
                temperature.append(entry['tempValues'])
                humidity.append(entry['humValues'])
                voltage.append(entry['voltage'])
                time.append(entry['time'])

            data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
            data_df = pd.DataFrame(data)
            
            # Data Preprocessing
            # Ensure the "time" column is in datetime format
            data_df['time'] = pd.to_datetime(data_df['time'])

            # Check for missing values
            missing_values = data_df.isnull().sum()
            print("Missing Values:\n", missing_values)

            # Fill missing values using forward-fill
            data_df.ffill(inplace=True)

            # Feature engineering: Create lag features
            data_df['lagged_voltage'] = data_df['vol'].shift(1)
            #------------ Data END -----------  
            

            # Convert the prediction_date_str to a datetime object
            prediction_date = parser.parse(prediction_date_str)

            # Call the predict_temperature function to make predictions
            predicted_voltage = predict_voltage(loaded_model, data_df, prediction_date)

            return JsonResponse({
                'status': 'success',
                'predicted_voltage': predicted_voltage
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })


def predict_Com(model, data_df, prediction_date):
    # Create a DataFrame with the provided date
    input_data = pd.DataFrame(
        {'timestamp': [prediction_date]},
        index=[prediction_date]  # Set the index to the prediction date
    )
    input_data['timestamp_numerical'] = input_data['timestamp'].view('int64')

    # Calculate the cumulative mean up to the provided date
    cumulative_mean = data_df[data_df['timestamp'] <= prediction_date]['com'].mean()
    input_data['cumulative_mean'] = cumulative_mean

    if input_data.isnull().values.any():
      # Handle NaN values, for example, by filling them with the mean of their respective columns
      input_data.fillna(data_df.select_dtypes(include=np.number).mean(), inplace=True)
    # Predict consumption at the provided date
    prediction = model.predict(input_data[['timestamp_numerical', 'cumulative_mean']])
    prediction_list = prediction.tolist()
    return prediction_list


@api_view(['POST'])
def predict_Com_view(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body.decode('utf-8'))
            # Extract the 'model' and 'data' fields from the JSON data
            data = request_data.get('data')
            prediction_date_str = request_data.get('date')
            model_base64 = request_data.get('model')

            #------------ Model -----------
            if model_base64 is None:
                return JsonResponse({
                'status': 'error',
                'message': 'Model data is missing or empty'
                })
            model_bytes = base64.b64decode(model_base64)
            loaded_model = pickle.loads(model_bytes)
            #------------ End Model -----------

            #------------ Data -----------
            # Check if data is an array
            if isinstance(data, list):
            # Initialize empty lists to store extracted data
                ComActiveTotal=[]    
                time = []

            # Extract the required fields from each data entry
            for entry in data:
                ComActiveTotal.append(entry['ComActiveTotal'])
                timestamp_ms = entry['time']
                # Convert the timestamp to a human-readable date
                timestamp_s = timestamp_ms / 1000
                time = datetime.fromtimestamp(timestamp_s)

            data = {'time': time,'com': ComActiveTotal}
            data_df = pd.DataFrame(data)

            data_df['timestamp'] = pd.to_datetime(data_df['time'])
            data_df['timestamp_numerical'] = data_df['timestamp'].view('int64')

             # Add column for cumulative mean of com up until the current timestamp
            data_df['cumulative_mean'] = data_df['com'].expanding().mean()


            data_df.ffill(inplace=True)

            #------------ Data END ----------- 
            

            # Convert the prediction_date_str to a datetime object
            prediction_date = parser.parse(prediction_date_str)
            # Convert the prediction date to match the DataFrame format
            prediction_date = pd.to_datetime(prediction_date)
            # Call the predict_temperature function to make predictions
            predicted_consumption = predict_Com(loaded_model, data_df, prediction_date)
            return JsonResponse({
                'status': 'success',
                'predicted_consumption': predicted_consumption
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })
#--------------------------------------