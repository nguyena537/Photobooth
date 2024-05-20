CREATE DATABASE app_database;

--\c into app_database

--unique, primary key are constraints, 2 ways to create the constraint. 
--primary key makes the column unique and not null.

CREATE TABLE users_photo(
    
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  
  role VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  PRIMARY KEY(user_id)
);

 
--create extension if not exists "uuid-ossp";
CREATE TABLE todos_photo(
  todo_id SERIAL,

  user_id UUID,
  description VARCHAR(255),
  
  restrictions VARCHAR(255),
  PRIMARY KEY (todo_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);



CREATE TABLE posts_photo(
  post_id SERIAL,
  user_id UUID,
  likes INTEGER DEFAULT 0,
  image VARCHAR(255),


  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(255),
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id) REFERENCES users_photo(user_id)
)


CREATE TABLE comments_photo(
  comment_id SERIAL,

  post_id INTEGER,
  user_id UUID,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comment VARCHAR(255),
  parent_id INTEGER,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (post_id) REFERENCES posts_photo(post_id),
  FOREIGN KEY (user_id) REFERENCES users_photo(user_id)
)

CREATE TABLE likes_photo(
  like_id SERIAL,
  post_id INTEGER,
  user_id UUID,
  PRIMARY KEY (like_id),
  UNIQUE (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts_photo(post_id),
  FOREIGN KEY (user_id) REFERENCES users_photo(user_id)
)

CREATE TABLE friends_photo(
  user_0_id UUID NOT NULL,
  user_1_id UUID NOT NULL,
  PRIMARY KEY (user_0_id, user_1_id),
  FOREIGN KEY (user_0_id) REFERENCES users_photo(user_id),
  FOREIGN KEY (user_1_id) REFERENCES users_photo(user_id)
)

INSERT INTO users (user_name, user_email, user_password, restrictions) VALUES ('henry', 'henryly213@gmail.com', 'kthl8822', 'vegan');

insert into todos (user_id, description) values ('2f99fecb-a819-42a2-b5c8-e0d0f6d1c291', 'clean room'),
('3912a13a-f72c-45df-90e8-a4a2c60f408b', 'do laundry'),
('a9cbcb56-8b52-4b97-804e-d606376bb800', 'do dishes');

/*

CREATE TABLE a (
    id SERIAL PRIMARY KEY,
    favorited_by INTEGER[], -- Array column to store a list of user IDs who favorited the food item
    description TEXT
);

INSERT INTO a (favorited_by, description) VALUES
    ('{1, 2}', 'Description of food item 1'), -- Sample user IDs who favorited the first food item
    ('{2, 3, 4}', 'Description of food item 2'); -- Sample user IDs who favorited the second food item


CREATE TABLE aa (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

INSERT INTO aa (name, description) VALUES
    ('User 1', 'Description of user 1'),
    ('User 2', 'Description of user 2'),
    ('User 3', 'Description of user 3'),
    ('User 4', 'Description of user 4');

SELECT description
FROM a
WHERE 3 = ANY (favorited_by);
*/
