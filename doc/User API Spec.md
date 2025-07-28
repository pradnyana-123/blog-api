This is User API Spec. No special things here
#### Register User
--- 
- data : [ username, email, password ]
- endpoint: POST /api/users/register
### Headers: None
#### API Request :
```json
{
"username": "",
"email": "",
"password": ""
}
```

#### API Response :
```json
{
"id": "",
"username": "",
"email": ""
}
```

### API Response (Failed): 
```json
{
"errors": "User already registered"
}
```

### Login User 
---
- data : [ username, password ]
- endpoint : POST /api/users/login

### API Request :
```json
{
"username": "",
"password": ""
}
```

### Response Body (Success) :
```json
{
	data: {
		"id" :"",
		"username": "",
	}
}
```

### Response Body (failed) :
```json
{
	"errors": "Username or password is wrong"
}
```

