This is Comment API Spec

## Create Comment
---
- Data : [ authorName, authorEmail, commenText ]
- Headers : Authorization
- Endpoint : POST /api/post/:postId/comments

### API Request :
```json
{
	"authorName": "",
	"authorEmail": "",
	"commentText": ""
}
```

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"authorName": "",
		"authorEmail": "",
		"commentText": ""
	}
}
```

### API Response ( Post not found ) :
```json
{
	"errors": "Post not found"
}
```

### API Response ( User not found ) :
```json
{
	"errors": "User not found"
}
```

### API Resopnse ( Invalid data ) : 
```json
{
	"errors": "Invalid data"
}
```


## Get Comments from specific Post 
---
- Headers : Authorization
- Endpoint : GET /api/posts/:postId/comments

### API Response ( Success ) :
```json
{
	"data": [
		{
			"id": "",
			"authorName": "",
			"authorEmail": "",
			"commentText": ""
		},
		{
			"id": "",
			"authorName": "",
			"authorEmail": "",
			"commentText": ""
		}
	]
}
```

## Get Comment from specific Comment ID
---
- Headers : Authorization
- Endpoint : GET /api/comments/:commentId

### API Response ( Success ) :  
```json
{
	"data": {
		"id": "",
		"authorName": "",
		"authorEmail": "",
		"commentText": ""
	}
}
```

## Update Comment
---
- Data : [ authorName, authorEmail, commentText ]
- Headers : Authorization
- Endpoint : PATCH /api/comments/:commentId

### API Request :
```json
{
	"authorName": "",
	"authorEmail": "",
	"commentText": ""
}
```

### API Response ( Success ) : 
```json
{
	"data": {
		"id": "",
		"authorName": "",
		"authorEmail": "",
		"commentText": ""
	}
}
```

### API Response ( Comment not found ) :
```json
{
	"errors": "Comment not found"
}
```

### API Response ( Invalid data ) : 
```json
{
	"errors": "Invalid data"
}
```

## Delete Comment 
---
- Headers : Authorization
- Endpoint : PATCH /api/comments/:commentId

### API Request :
```json
{
	"isDeleted": boolean
}
```

### API Response ( Success ) : 
```json
{
	"data": "Comment deleted successfully"
}
```

### API Response ( Invalid data ) : 
```json
{
	"errors": "Invalid data"
}
```

### API Response ( Comment Not Found ) :
```json
{
	"errors": "Comment not found"
}
```