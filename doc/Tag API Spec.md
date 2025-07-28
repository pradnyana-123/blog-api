This is Tag API Spec

## Create Tag 
---
- Data : [ tagName ]
- Headers : Authorization
- Endpoint : POST /api/tags
- Role : 

### API Request :
```json
{
	"tagName": ""
}
```

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"tagName": ""
	}
}
```

## Get All Tag
---
- Headers : Authorization
- Endpoint : GET /api/tags

### API Response ( Success ) :
```json
{
	"data": [
		{
			"id": "",
			"tagName": "",
		},
		{
			"id": "",
			"tagName": "",
		},	
	]
}

```

## Get Single Tag from Post 
---
- Headers : Authorization
- Endpoint : GET /api/tags/post/:postId

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"tagName": "",
	}
}
```

## Update Tag
---
- Data : [ tagName ]
- Headers: Authorization
- Endpoint : PATCH /api/tags/:tagId

### API Request :
```json
{
	"tagName": "",
	
}
```

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"tagName": "",
	}
}
```

### API Response ( Tag not found ) :
```json
{
	"errors": "Tag not found"
}
```

### API Response ( Invalid data ) :
```json
{
	"errors": "Invalid data"
}
```


## Delete Tag
---
- Headers : Authorization
- Endpoint : PATCH /api/tags/delete/:tagId

### API Response ( Success ) : 
```json
{
	"data": "Tag deleted successfully"
}
```

### API Response ( Tag not found ) :
```json
{
	"errors": "Tag not found"
}
```

