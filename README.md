# My-note-api
note app with MERN stack (backend)


## setup guide ##

.env variables

PORT = port to run on (default is 3000)
MONGO_URI = mongodb database url
SESSION_SECRET = secret key for session
CLIENT_ORIGIN = client origin (url)

* in config/corsOptions.js 
Put client origin (string) in allowedOrigins array.
