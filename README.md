# Nest JS Product Ordering System

#### How to start the app

Make sure the .env.example file is there,
Run this `cp .env.example .env`
Just write the command: `docker compose up`
and you will be good to go.

#### What's in this application

* In the api module, you will find the endpoints that aggregates data based on the required logic
* You can use the app.http application to check them but make sure you have installed the rest client extension on vscode
* the initdb initializes the database

#### Challenges I faced

The biggest challenge was to work with redis... the `ioredis` or `redis` in general is a very error prone piece of software. It can broke very easily and doesn't give meaningful error messages as well

#### My perception
The experience with developing node application with typescript has been great for me as I love typed languages. NestJS is a nice modular framework. I can do well with its actual wrappers. Handling db and asynchrony was a quite a piece of cake.
