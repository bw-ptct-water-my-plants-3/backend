# --backend--
----------------------
## .env vars
### SECRET (jwt sig)
SECRET="buildWeek"

### PORT 
PORT="5000"

## End Points
--------------------
### Auth (login)/(register)
(POST)/auth/login
-Required fields: {username, password}

(POST)/auth/register
-Required fields: {username, password, phoneNumber}

### Users (data)

(GET)/users/
-Request all users from database table

(GET)/users/:id
-Request specific user data from table
-Requires id parameters

(PUT)/users/:id
-Requires id parameters, and {password, phoneNumber)
-Request changes via req.body on specific user

### Plants
