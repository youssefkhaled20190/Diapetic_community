from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Load the machine learning model
model = pickle.load(open('Model.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    # Extract input data from request
    data = request.get_json()
    
    # Preprocess input data
    glucose = data.get("Glucose")
    bloodPressure = data.get("BloodPressure")
    skinThickness = data.get("SkinThickness")
    insulin = data.get("Insulin")
    bmi = data.get("BMI")
    pregnancies = data.get("Pregnancies")
    pedigree = data.get("DiabetesPedigreeFunction")
    age = data.get("Age")
    
    PlasmaGlucoseMEAN = 107.85686666666666
    PlasmaGlucoseSTD = 31.98197465181089
    DiastolicBloodPressureMEAN = 71.22066666666667
    DiastolicBloodPressureSTD = 16.758716036531574
    TricepsThicknessMEAN = 28.814
    TricepsThicknessSTD = 14.555715781922968
    SerumInsulinMEAN = 137.85213333333334
    SerumInsulinSTD = 133.06825195901257
    BMIMEAN = 31.509646041017334
    BMISTD = 9.758999734051898
    PregnanciesMIN = 0
    PregnanciesMAX = 14
    DiabetesPedigreeMIN = 0.078043795
    DiabetesPedigreeMAX = 2.301594189
    
    PlasmaGlucoseZscore = (float(glucose) - PlasmaGlucoseMEAN) / PlasmaGlucoseSTD
    DiastolicBloodPressureZscore = (float(bloodPressure) - DiastolicBloodPressureMEAN) / DiastolicBloodPressureSTD
    TricepsThicknessZscore = (float(skinThickness) - TricepsThicknessMEAN) / TricepsThicknessSTD
    SerumInsulinZscore = (float(insulin) - SerumInsulinMEAN) / SerumInsulinSTD
    BMIZscore = (float(bmi) - BMIMEAN) / BMISTD
    Pregnancies_scaled = (float(pregnancies) - PregnanciesMIN) / (PregnanciesMAX - PregnanciesMIN)
    DiabetesPedigree_scaled = (float(pedigree) - DiabetesPedigreeMIN) / (DiabetesPedigreeMAX - DiabetesPedigreeMIN)
    logAge = np.log(float(age))
    
    features = pd.DataFrame([{"log_Age": logAge, "zscore_glucose": PlasmaGlucoseZscore, "zscore_pressure": DiastolicBloodPressureZscore, "zscore_thick": TricepsThicknessZscore, "zscore_insulin": SerumInsulinZscore,
                               "zscore_bmi": BMIZscore, "minMaxPreg": Pregnancies_scaled, "minMaxPedigree": DiabetesPedigree_scaled }])
    
    # Make prediction
    prediction = model.predict(features)
    
    # Return the prediction result
    if prediction[0] == 0:
        result = "Negative"
    elif prediction[0] == 1:
        result = "Positive"
    
    return jsonify({'prediction': result})

if __name__ == '__main__':

    app.run(debug=True)
