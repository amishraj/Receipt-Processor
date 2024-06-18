
# Receipt Processor

Webservice built as part of the Receipt Processor challenge by Fetch.

The project structure has two relevant files, app.js and receipts.js. app.js contains the code that runs the server, and receipts.js contains the code for the endpoints.

Technologies Used: Node.JS, Express.JS

A docker file has been included as well.

## How to Run Locally

Make sure you have Docker installed and running.
Clone the Repository and run the following commands from within the directory

First, pull the node:22-alpine image

```bash
docker pull node:22-alpine
```

Next, in the Repo directory, use the following command to build the docker image 

Note: Do not use sudo if you are running the commands in Windows CMD

```bash
sudo docker build -t receipt-processor .
```

Run the following command to build the container

```bash
sudo docker run --name receipt-processor -p 80:3000 -d receipt-processor
```

Use 'docker ps' to verify that the container is running.

You can now access your application by navigating to your server IP, no need to specify the port. Postman is a great tool to test out the API.

For example, I used the following URL 

```bash
http://localhost/
```
