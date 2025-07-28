### User :
- id VARCHAR / UUID 
- first_name VARCHAR(100)
- last_name VARCHAR(100) optional
- email VARCHAR(100) unique
- password VARCHAR(100)
- bio TEXT 
- registration_date TIMESTAMP()
---
### Posts :
- id VARCHAR / UUID
- author_id VARCHAR
- title VARCHAR(50)
- content TEXT
- excerpt VARCHAR(150)
- publish_date TIMESTAMP()
- last_updated TIMESTAMP()
- status ENUM
- slug VARCHAR(100)
---
### Category :
- id VARCHAR
- category_name VARCHAR(50)
- description TEXT
---
### PostCategory :
- id VARCHAR
- postId VARCHAR
- categoryId VARCHAR
---
### Tag :
- id VARCHAR
- name VARCHAR(50)
---
### PostTag : 
- id VARCHAR
- postId VARCHAR
- tagId VARCHAR
---
### Comments :
- id VARCHAR
- postId VARCHAR
- author_name VARCHAR(100)
- author_email VARCHAR(100)
- comment_text TEXT
- comment_date TIMESTAMP()
- parent_comment_id VARCHAR

