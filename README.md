## Overview
The Crime Prediction App is an innovative solution that helps Law enforcement agencies in tackling most affected crime areas effectively. By harnessing various machine learning algorithms, it enables timely intervention and proper resource allocation. This app analyzes historical crime trends of cities like New York, Chicago and predicts future crime rates.

## Features

- <b>Login page:</b> User can create, login account, user data will be saved in the database.
- <b>Switch Map Layers:</b> User can change map layers (eg, Streets, Satellite, etc.)
- <b>Crime Analysis:</b> The app provides a new way to analyze crimes using graphs displayed alongside the map.
- <b>Crime Prediction:</b> The prediction results for the selected city are displayed, making it easy for users to analyze future crimes graphically.

Here's the System Architecture Diagram of this Application:
<p align="center">
<img src="Extra/sys_arch.drawio.png" alt="flowchart" style="height: 500px">
</p>

#### Technology Stack

HTML, CSS, Javascript, Python, Flask, Mysql, Machine Learning, REST APIs, Mapbox API

## How It Works
- Frontend:
The frontend is built using modern web technologies such as HTML5, CSS, Javascript. It provides a user-friendly interface for interacting with the app. By integrating [Mapbox APIs](https://docs.mapbox.com/), it enables the visualization of crime Hotspots and clusters on 3D map. Also, used libraries like Chart.js, which enhance the visualization of crime data through charts and graphs.

Here’s a sneak peek of the frontend: 

This is the user's login page. Here, you can login and create your new account and even change the password of your account.
<p align="center">
<img src="Extra/frontend_1.png" alt="Image 1" style="height: 250px; width: 400px"><br>
Fig. 1. User Login Page
</p>


After logging in, you’ll be automatically redirected to the main page. If you click the user icon in the top right corner, your account information will slide out. From there, you can edit your account details if needed
<p align="center">
<img src="Extra/frontend_2.png" alt="Image 2" style="height: 250px; width: 400px">&nbsp&nbsp
<img src="Extra/frontend_8.png" alt="Image 2" style="height: 250px; width: 200px"><br>
Fig. 2. Main Page
</p>
 
<p align="center">
<img src="Extra/frontend_3.png" alt="Image 1" style="height: 250px; width: 400px">&nbsp&nbsp
<img src="Extra/frontend_4.png" alt="Image 1" style="height: 250px; width: 400px"><br>
<img src="Extra/frontend_5.png" alt="Image 1" style="height: 250px; width: 400px">&nbsp&nbsp
<img src="Extra/frontend_6.png" alt="Image 1" style="height: 250px; width: 400px"><br>
Fig 3. Crime Analysis Section
</p>

<p align="center">
<img src="Extra/frontend_7.png" alt="flowchart" style="height: 250px; width: 400px"><br>
Fig.4 Crime Prediction Section
</p>

- Backend:
The backend is built using Python Flask web framework which is responsible for handling the incoming requests from clients (such as create user, check user, authenticate, change password etc.) and maintaining user database, model inference, and returning the analysis or prediction results. 


- Database:
The MySQL database in our application serves as the central repository for user-related data. It stores information about users, authentication credentials, and other profile details. Database is connected through SSH tunneling protocol. The SSH tunnel ensures that communication between servers is securely encrypted. It establishes a protected channel over an insecure network, preventing eavesdropping or interception of sensitive data"

This database is maintained in the Local Machine through ssh tunneling
<p align="center">
<img src="Extra/database.png" alt="flowchart" style="height: 200px; ">
</p>

- Prediction Results:
Once the backend processes the data, it returns the prediction results to the frontend.
The frontend displays this information to the user.

