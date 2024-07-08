# import matplotlib.pyplot as plt
# import pandas as pd

# # Load the data
# data = pd.read_csv('CrimePrediction/Dataset/2001_2012(2).csv', usecols = ['STATE', 'YEAR', 'DISTRICT', 'TOTAL IPC CRIMES'])


# # Filter out Uttar Pradesh
# data = data[data["DISTRICT"] == "TOTAL"]
# data = data.groupby('STATE')
# data = data.get_group('UTTAR PRADESH')
# print(data.head(50))

# # Plot graph
# data.plot(kind="bar", x="YEAR", y="TOTAL IPC CRIMES", title="Total IPC Crimes Reported", xlabel="YEAR", ylabel="Number of Crimes", figsize=(10, 6))

# # plt.xlabel('Year')
# # plt.ylabel('Total Crimes')

# # plt.title('Total Crimes per Year')
# plt.show()

##################################################LINEAR REGRESSION##############################################################

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import sys, json

# Read data
data = pd.read_csv('PythonFlask/static/Data/crimes_2001_2012.csv', usecols = ['STATE', 'YEAR', 'DISTRICT','MURDER', 'TOTAL IPC CRIMES'])

# req_data = json.loads(sys.argv[1])
req_data = {'country':'India'}

if 'state' in req_data:
     name = req_data['state']
     data = data[data["STATE"] == name]
     data = data[data["DISTRICT"] == 'TOTAL']

elif 'district' in req_data:
     name = req_data["district"]
     data = data[data["DISTRICT"] == name]
     data = data.groupby("YEAR").sum().reset_index()
elif 'country' in req_data:
     name = req_data['country']
     data = data[data["DISTRICT"] == 'TOTAL']
     data = data.groupby("YEAR").sum().reset_index()

state = 'India'
start = 2001
end = 2022

# Filter out state 

# Group by year and sum the total crimes


# Split the data into input and output variables
X = data["YEAR"].values.reshape(-1, 1) # Input variable
y = data["TOTAL IPC CRIMES"].values.reshape(-1, 1)  # Output variable

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, shuffle=False)

# # Create and fit a linear regression model
# model = LinearRegression()
# model.fit(X_train, y_train)

# # # Predict the number of crimes in 2022
# X_pred = np.arange(start, end).reshape(-1, 1) # Input variable for prediction

# y_pred = model.predict(X_pred)
# print(f"The predicted number of crimes in {state} in {start} to {end} is {y_pred.flatten()}")
# print(model.score(X_pred,y_pred))

# # Evaluate the model on the testing set
# y_test_pred = model.predict(X_test)
# mse = mean_squared_error(y_test, y_test_pred)
# rmse = np.sqrt(mse)
# mae = mean_absolute_error(y_test, y_test_pred)
# r2 = r2_score(y_test, y_test_pred)

# print("The R-squared of the model is:", r2)
# print(f"The root mean squared error of the model on the testing set is {rmse:.0f}")
# print(f"The mean absolute error of the model on the testing set is {mae:.0f}")
# # Plot the actual and predicted values
# plt.scatter(X, y, color='black', label="Actual")
# plt.plot(X_pred, y_pred, color="blue", label="Predicted")
# plt.xlabel("Year")
# plt.ylabel("Total IPC Crimes")
# plt.title(f"Crime Prediction in {state} using Linear Regression")
# plt.legend()
# plt.show()

# # #########################################POLYNOMIAL REGRESSION####################################################
# from sklearn.preprocessing import PolynomialFeatures

# # Create and fit a polynomial regression model of degree 2
# poly = PolynomialFeatures(degree=2)
# X_poly = poly.fit_transform(X_train)
# model_poly = LinearRegression()
# model_poly.fit(X_poly, y_train)
# X_pred = np.arange(start, end).reshape(-1, 1)
# # Predict the number of crimes from 20 2022 using the polynomial model
# X_pred_poly = poly.transform(sc_X.transform(X_pred))
# y_pred_poly = sc_y.inverse_transform(model_poly.predict(X_pred_poly))
# print(f"The predicted number of crimes in {state} in {start} to {end} using the polynomial model is {y_pred_poly.flatten()}")

# X_test_scaled = poly.transform(sc_X.transform(X_test))
# y_test_pred_poly =  sc_y.inverse_transform(model_poly.predict(X_test_scaled))

# mse = mean_squared_error(y_test, y_test_pred_poly)
# rmse = np.sqrt(mse)
# mae = mean_absolute_error(y_test, y_test_pred_poly)
# r2 = r2_score(y_test, y_test_pred_poly)

# print("The R-squared of the model is:", r2)
# print(f"The mean absolute error of the model on the testing set is {mae:.0f}")
# print(f"The root mean squared error of the model on the testing set is {rmse:.0f}")

# plt.scatter(X, y)
# plt.plot(X, y, color="blue", label="Actual")
# plt.plot(X_pred,  y_pred_poly, color="red", label="Predicted")
# plt.xlabel("Year")
# plt.ylabel("Total IPC Crimes")
# plt.title(f"Crime Prediction in {state} using Polynomial Regression")
# plt.legend()
# plt.show()


#############################################SVR############################################################

# from sklearn.svm import SVR # Import SVR class
# from sklearn.preprocessing import StandardScaler


# sc_X = StandardScaler()
# sc_y = StandardScaler()
# X_train = sc_X.fit_transform(X_train)
# y_train = sc_y.fit_transform(y_train)

# # Create and fit an SVR model with RBF kernel
# model_svr = SVR(kernel="rbf")
# model_svr.fit(X_train, y_train)

# # Predict the number of crimes using the SVR model
# x = np.arange(start, end).reshape(-1, 1)
# X_scaled = sc_X.transform(x)  # Input variable for prediction
# y_pred_svr = sc_y.inverse_transform(model_svr.predict(X_scaled).reshape(-1, 1)) # Output variable for prediction
# # print(f"The predicted number of crimes in {state} from {start} to {end} using the SVR model are {y_pred_svr}")

# # Evaluate the model on the testing set
# y_test_pred_svr = sc_y.inverse_transform(model_svr.predict(sc_X.transform(X_test)).reshape(-1, 1))
# mse_svr = mean_squared_error(y_test, y_test_pred_svr)
# rmse_svr = np.sqrt(mse_svr)
# rmse=round(rmse_svr, ndigits=3)
# mae = mean_absolute_error(y_test, y_test_pred_svr)

# r2 = r2_score(y_test, y_test_pred_svr)
# r2=round(r2, ndigits=3) 

# str_X = ", ".join(map(str, X.flatten()))
# str_y = ", ".join(map(str,y.flatten()))

# Output = {"Actual": { "X": [str_X], "y":[str_y] }, "Predicted": {"X_Pred": np.arange(start, end), "y_pred":y_pred_svr.flatten()}, "MAE":mae, "RMS":rmse, "RSQ":r2} 


# print(Output)


# # plt.scatter(X, y)
# # plt.plot(X, y, color="blue", label="Actual")
# # plt.plot(x,  y_pred_svr, color="red", label="Predicted")
# # plt.xlabel("Year")
# # plt.ylabel("Total IPC Crimes")
# # plt.title(f"Crime Prediction in {state} using Polynomial Regression")
# # plt.legend()
# # plt.show()



############################################################


from sklearn.ensemble import RandomForestRegressor


from sklearn.preprocessing import StandardScaler

sc_X = StandardScaler()
sc_y = StandardScaler()
X_train = sc_X.fit_transform(X_train)
y_train = sc_y.fit_transform(y_train)

# Create and fit an Random Forest model

model = RandomForestRegressor( max_features=0.5,
                n_estimators=1000,
                     max_depth=15, min_samples_leaf=10
                     )
model.fit(X_train, y_train.ravel())


# Predict the number of crimes using the SVR model
x = np.arange(start, end).reshape(-1, 1)
X_scaled = sc_X.transform(x)  # Input variable for prediction
y_pred_rnd = sc_y.inverse_transform(model.predict(X_scaled).reshape(-1, 1)) # Output variable for prediction
# print(f"The predicted number of crimes in {state} from {start} to {end} using the SVR model are {y_pred_svr}")

# Evaluate the model on the testing set
y_test_pred_rnd = sc_y.inverse_transform(model.predict(sc_X.transform(X_test)).reshape(-1, 1))
mse_rnd = mean_squared_error(y_test, y_test_pred_rnd)
rmse_rnd = np.sqrt(mse_rnd)
rmse=round(rmse_rnd, ndigits=3)
mae = mean_absolute_error(y_test, y_test_pred_rnd)

r2 = r2_score(y_test, y_test_pred_rnd)
r2=round(r2, ndigits=3) 

str_X = ", ".join(map(str, X.flatten()))
str_y = ", ".join(map(str,y.flatten()))

Output = {"Actual": { "X": [str_X], "y":[str_y] }, "Predicted": {"X_Pred": np.arange(start, end), "y_pred":y_pred_rnd.flatten()}, "MAE":mae, "RMS":rmse, "RSQ":r2} 


print(Output)


# plt.scatter(X, y)
# plt.plot(X, y, color="blue", label="Actual")
# plt.plot(x,  y_pred_svr, color="red", label="Predicted")
# plt.xlabel("Year")
# plt.ylabel("Total IPC Crimes")
# plt.title(f"Crime Prediction in {state} using Polynomial Regression")
# plt.legend()
# plt.show()

############################################################################

