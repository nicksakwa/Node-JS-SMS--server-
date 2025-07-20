# Hey there! 👋
Here Node JS SMS server

# Nodejs SMS server

 
## Requirements
*  Nodejs
*  Twilio library
    ```bash
    npm install twilio dotenv
    ```
    ```bash
    npm install express
    ```
To execute the JS app in this repository

1.  Navigate to the directory containing the files in your terminal.
2.  Run the desired script using the terminal:
    ```bash
    node smtp-server.js
    ```
   
   
    
Runs the app in the development mode.\
    ```bash
    curl -X POST -H "Content-Type: application/json" \
     -d '{"to": "'"$MY_PHONE_NUMBER"'", "message": "Hello from my Node.js SMS server!"}' \
     http://localhost:3000/send-sms
    ```

    
    
