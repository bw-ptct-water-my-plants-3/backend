# --backend--
----------------------
## .env vars
### SECRET (jwt sig)
SECRET="buildWeek"

### PORT 
PORT="5000"

## End Points (URL is https://bw-ptct-water-my-plants-3.herokuapp.com/ )
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

(GET)/users/:user_id/plants/
-Request all plants for specific user

(GET)/users/:user_id/plants/:id
-Request for a specific plant under a specific user

(POST)/users/:user_id/plants/
-Request to add a plant (obviously on logged on user)
-Request uses user_id params
-Request fields nickname, species, h2oFrequency, image 

(DELETE)/users/:user_id/plants/:id/
-Request to delete specific plant under a specific user
-Request uses user_id and id (plant id) params

(PUT)/users/:user_id/plants/:id/
-Request to change/update a specific plant under a specific user
-Request uses user_id and id (plant) params
-Request fields nickname, species, h2oFrequency (required) image(optional)