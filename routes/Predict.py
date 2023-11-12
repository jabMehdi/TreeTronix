import pandas as pd
import numpy as np
import pymongo
from sklearn.linear_model import LinearRegression

def load_and_preprocess_data(sensor_type):
    # Connect to your MongoDB database
    client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
    db = client["usina"]  # Replace with your database name
    collection = db["sensors"]  # Replace with your collection name
    
    # Fetch data from the collection
    cursor = collection.find({"type": sensor_type})

    # Convert the cursor to a list of dictionaries
    data_list = list(cursor)

    if not data_list:
        print("No data found for sensor type: {}".format(sensor_type))
        return None
    
    # Concatenate the "data" arrays from the list of dictionaries
    data = [entry["data"] for entry in data_list]

    # Flatten the list of arrays and convert it to a DataFrame
    data_df = pd.DataFrame([item for sublist in data for item in sublist])
    
    # Ensure the "time" column is in datetime format
    data_df['time'] = pd.to_datetime(data_df['time'])
    
    # Check for missing values
    missing_values = data_df.isnull().sum()
    print("Missing Values:\n", missing_values)

    # Fill missing values using forward-fill
    data_df = data_df.fillna(method='ffill')

    # Feature engineering: Create lag features
    data_df['lagged_temperature'] = data_df['tempValues'].shift(1)
    data_df['lagged_Hum'] = data_df['humValues'].shift(1)
    data_df['lagged_voltage'] = data_df['voltage'].shift(1)

    return data_df
def train_model(data_df, target_variable):
    # Define your features (X) and target variable (y)
    if target_variable == 'temperature':
        X = data_df[['lagged_temperature', 'lagged_Hum']]
        y = data_df['tempValues']
        X = X.dropna()
        y = y.iloc[X.index]
    elif target_variable == 'humidity':
        X = data_df[['lagged_temperature', 'lagged_Hum']]
        y = data_df['humValues']
        X = X.dropna()
        y = y.iloc[X.index]
    elif target_variable == 'voltage':
       X = data_df['lagged_voltage'].values.reshape(-1, 1)
       y = data_df['voltage']
       nan_indices = ~np.isnan(X).flatten()
       X = X[nan_indices]
       y = y.iloc[nan_indices]
    else:
        raise ValueError("Invalid target variable. Please choose 'temperature', 'humidity', or 'voltage'.")

    print("target variable choice was : {}".format(target_variable))
    # Filter out rows with NaN values in X and update y accordingly


    # Initialize the Linear Regression model
    model = LinearRegression()



    # Train the model
    model.fit(X, y)

    return model

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

    return predicted_temperature

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

    return predicted_humidity

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
            lagged_voltage = data_df['voltage'].mean()
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
    return predicted_voltage

def main():
    sensor_type = input("Enter the sensor type: ")

    if sensor_type != "AN-103A":
        print("With this sensor type, you can only predict 'voltage'.")
        target_variable = 'voltage'
    else:
        target_variable = input("Enter the target variable (temperature, humidity, voltage): ")

    prediction_date_str = input("Enter the prediction date (yyyy-mm-dd hh:mm:ss): ")
    prediction_date = pd.to_datetime(prediction_date_str)

    # Load and preprocess data directly from the database
    data_df = load_and_preprocess_data(sensor_type)

    if data_df is None:
        return

    model = train_model(data_df, target_variable)

    # Choose the prediction function based on the target variable
    if target_variable == 'temperature':
        predicted_value = predict_temperature(model, data_df, prediction_date)
    elif target_variable == 'humidity':
        predicted_value = predict_humidity(model, data_df, prediction_date)
    elif target_variable == 'voltage':
        predicted_value = predict_voltage(model, data_df, prediction_date)
    else:
        print("Invalid target variable choice. Please choose from 'temperature', 'humidity', or 'voltage'.")
        return

    print("Predicted %s for %s: %s" % (target_variable, prediction_date, predicted_value))


if __name__ == '__main__':
    main()
