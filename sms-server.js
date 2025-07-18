require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser'); // To parse incoming POST request bodies

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number
const myPhoneNumber = process.env.MY_PHONE_NUMBER;         // Your actual phone number for sending tests

// Initialize Twilio client
const client = new twilio(accountSid, authToken);

// Middleware to parse URL-encoded bodies (for incoming webhooks)
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware to parse JSON bodies (if you're sending JSON to your API endpoints)
app.use(bodyParser.json());

// --- 1. Endpoint for Sending SMS ---
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).send('Recipient number and message are required.');
  }

  try {
    const sms = await client.messages.create({
      body: message,
      to: to,         // Text this number (e.g., +1234567890)
      from: twilioPhoneNumber // From a valid Twilio number
    });

    console.log(`SMS sent! Message SID: ${sms.sid}`);
    res.status(200).send(`SMS sent successfully! Message SID: ${sms.sid}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send(`Error sending SMS: ${error.message}`);
  }
});

// --- 2. Endpoint for Receiving SMS (Twilio Webhook) ---
// This is the URL you'll configure in your Twilio phone number's webhook settings
app.post('/sms-webhook', (req, res) => {
  const incomingMessageBody = req.body.Body; // The text content of the incoming message
  const incomingFromNumber = req.body.From; // The phone number that sent the message

  console.log(`Incoming SMS from ${incomingFromNumber}: ${incomingMessageBody}`);

  // Create a TwiML response to send a reply back
  const twiml = new twilio.twiml.MessagingResponse();

  // Simple auto-reply logic
  if (incomingMessageBody.toLowerCase().includes('hello')) {
    twiml.message(`Hi there! You said: "${incomingMessageBody}". How can I help you?`);
  } else if (incomingMessageBody.toLowerCase().includes('status')) {
    twiml.message('Your request is being processed. Please wait.');
  } else {
    twiml.message(`Thanks for your message from ${incomingFromNumber}. I received: "${incomingMessageBody}"`);
  }

  // Send the TwiML response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Basic route for home page (optional, for checking if server is running)
app.get('/', (req, res) => {
    res.send('Node.js SMS Server is running. Use /send-sms to send and /sms-webhook to receive.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`SMS server running on http://localhost:${PORT}`);
  console.log('To send a test SMS from your code: POST to /send-sms with { "to": "YOUR_PERSONAL_NUMBER", "message": "Your test message" }');
  console.log('To test receiving SMS, you\'ll need to expose this server to the internet using ngrok.');
});