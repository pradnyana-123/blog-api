This is category API Spec

## Create Category 
---
- Data : []
- Headers : Authorization
- Endpoint : POST /api/categories

### API Request :
```json
{
	"categoryName": "",
	"description": ""
}
```

### API Response (Success) :
```json
{
	"data": {
		"id": "",
		"categoryName": "",
		"description": ""
	}
}
```

### API Response ( Category already exists ) :
```json
{
	"errors": "Category already exists"
}
```

### API Response ( Invalid Data ) :
```json
{
	"errors": "Invalid data"
}
```

## Get All Categories 
---
- Headers : Authorization
- Endpoint : GET /api/categories

### API Response ( Success ) :
```json
{
	"data": [
		{
			"id": "",
			"categoryName": "",
			"description": ""
		},
		{
			"id": "",
			"categoryName": "",
			"description": ""
		},	
	]
}

```

## Get Categories from post 
---
- Headers : Authorization
- Endpoint : GET /api/categories/post/:postId

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"categoryName": "",
		"description": ""
	}
}
```

## Update Category 
---
- Data : [ categoryName, description ]
- Headers: Authorization
- Endpoint : PATCH /api/categories/:categoryId

### API Request :
```json
{
	"categoryName": "",
	"description": ""	
}
```

### API Response ( Success ) :
```json
{
	"data": {
		"id": "",
		"categoryName": "",
		"description": ""		
	}
}
```

### API Response ( Category not found ) :
```json
{
	"errors": "Category not found"
}
```

### API Response ( Invalid data ) :
```json
{
	"errors": "Invali data"
}
```


## Delete Category 
---
- Data : [ categoryId ]
- Headers : Authorization
- Endpoint : PATCH /api/categories/delete/:categoryId

### API Response ( Success ) : 
```json
{
	"data": "Category deleted successfully"
}
```

### API Response ( Category not found ) :
```json
{
	"errors": "Category not found"
}
```

