# Import necessary modules
from django.http import HttpResponseBadRequest, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

@api_view(['POST'])
def trainSensor_view(request: Request):
    if request.method == 'POST':
        received_data = request.data
        temperature = received_data['temperature']
        humidity = received_data['humidite']
        voltage = received_data['voltage']
        time = received_data['time']

        data = {'temp': temperature, 'time': time, 'vol': voltage, 'hum': humidity}
        data_df = pd.DataFrame(data)

        # Data Preprocessing
        # Ensure the "time" column is in datetime format
        data_df['time'] = pd.to_datetime(data_df['time'])

        # Check for missing values
        missing_values = data_df.isnull().sum()
        print("Missing Values:\n", missing_values)

        # Fill missing values using forward-fill
        data_df = data_df.fillna(method='ffill')

        # Feature engineering: Create lag features
        data_df['lagged_temperature'] = data_df['temp'].shift(1)
        data_df['lagged_Hum'] = data_df['hum'].shift(1)
        data_df['lagged_voltage'] = data_df['vol'].shift(1)

        X = data_df[['lagged_temperature', 'lagged_Hum']]
        y = data_df['temp']
        X = X.dropna()
        y = y.iloc[X.index]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        print("Model trained successfully!")

        # Save or return the model as needed
        # For simplicity, you can return a success message as JSON
        return JsonResponse({'message': 'Temperature model trained successfully'})
    else:
        return HttpResponseBadRequest("Invalid request method for training the model.")


