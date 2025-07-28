This is post API spec
## Create Post 
---
- data : [ title, content, excerpt, status, slug ]
- endpoint : POST /api/posts
- headers : Authorization

## API Request :
```json
{
	"title": "",
	"content": "",
	"excerpt": "",
	"status": "",
	"slug": ""
}
```

## API Response (Success) :
```json
{
	"data": {
		"id": "",
		"title": "",
		"content": "",
		"excerpt": "",
		"status": "",
		"slug": ""
	}
}
```

## API Response (Failed) :
```json
{
	"errors": "Invalid data"
}
```

## Get All Post From User
---
- Endpoint : GET /api/posts/users/:userId
- headers : Authorization

### API Response :
```json
{
	"data": [
		{
			"id": "",
			"title": "",
			"content": "",
			"excerpt": "",
			"status": "",
			"slug": ""
		},
		{
			"id": "",
			"title": "",
			"content": "",
			"excerpt": "",
			"status": "",
			"slug": ""
		},	
	]
}
```

## Get Single Post From User
---
- Endpoint : GET /api/post/:postId
- Headers : Authorization

### API Response (Success) :
```json
{
	"data": {
		"id": "",
		"title": "",
		"content": "",
		"excerpt": "",
		"status": "",
		"slug": ""
	}
}
```

## Get All Post from the user itself
---
- Headers : Authorization
- Endpoint : GET /api/post

### API Response ( Success ) :
```json
{
	"data": [
		{
			"id": "",
			"title": "",
			"content": "",
			"excerpt": "",
			"status": "",
			"slug": ""
		},
		{
			"id": "",
			"title": "",
			"content": "",
			"excerpt": "",
			"status": "",
			"slug": ""
		}
	]
}
```

## Update post 
---
- Data : [ title, content, excerpt, status, slug ]
- Headers : Authorization
- Endpoint : PATCH /api/post/:postId

### API Request :
```json
{
	"title": "",
	"content": "",
	"excerpt": "",
	"status": "",
	"slug": ""
}
```

### API Response (Success) :
```json
{
	"data": {
		"id": "",
		"title": "",
		"content": "",
		"excerpt": "",
		"status": "",
		"slug": ""		
	}
}
```

### API Response (Invalid data) :
```json
{
	"errors": "Invalid data"
}
```

### API Response (Post not found) :
```json
{
	"errors": "Post not found"
}
```

## Delete Post
---
- data : [ user_id, post_id ]
- headers : Authorization

### API Response (Success) :
```json
{
	"data": "Post deleted successfully"
}
```

### API Response (Post not found) :
```json
{
	"errors": "Post not found"
}
```

