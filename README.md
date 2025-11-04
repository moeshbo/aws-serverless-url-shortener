# AWS Serverless URL Shortener API

A highly scalable, cost-effective URL shortener built on AWS serverless technologies. This project is a 100% Infrastructure as Code (IaC) deployment using the AWS SAM CLI.

It provides two simple API endpoints:
* `POST /links`: Creates a new short URL.
* `GET /{shortId}`: Redirects a short URL to its original long URL.

## Project Architecture

![Project Architecture](https://raw.githubusercontent.com/moeshbo/aws-serverless-url-shortener/main/Architecture.jpeg)


## Core AWS Services Used

* **API Gateway:** Provides the public REST API endpoints (`/links` and `/{shortId}`) and routes requests to the correct Lambda function.
* **AWS Lambda:** Contains the business logic (written in Node.js) for creating new links and retrieving existing ones.
* **DynamoDB:** A fully managed NoSQL database used to store the mapping between the short ID and the original long URL.
* **AWS SAM (Serverless Application Model):** Used to define the entire application's infrastructure (the API, functions, database, and permissions) in a `template.yaml` file.
* **CloudWatch:** Used for logging and monitoring the application (e.g., debugging the Lambda functions).
* **IAM:** Defines the security permissions to ensure the Lambda functions have the *least-privilege* access required (e.g., "This function can *only* read from this one table").

## How to Deploy

This project is built to be deployed with the AWS SAM CLI.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/moeshbo/aws-serverless-url-shortener.git
    cd aws-serverless-url-shortener
    ```

2.  **Configure AWS Credentials:**
    Make sure you have the AWS CLI installed and configured:
    ```bash
    aws configure
    ```

3.  **Build the project:**
    ```bash
    sam build
    ```

4.  **Deploy to your AWS account:**
    ```bash
    sam deploy --guided
    ```
    This will walk you through the deployment, create the CloudFormation stack, and output your unique API URL.

## How to Test

Once deployed, you can test the API using `curl` (or an app like Postman).

### Create a new link (`POST /links`)

```bash
# Note: This is the Windows curl command
curl -X POST "YOUR_API_GATEWAY_URL/Prod/links" -H "Content-Type: application/json" -d "{\"longUrl\": \"https://www.google.com\"}"
```

**Success Response:**
```json
{"shortUrl":"YOUR_API_GATEWAY_URL/Prod/aB3xYqZ","longUrl":"https://www.google.com"}
```

### Test the redirect (`GET /{shortId}`)

Take the `shortUrl` from the response and paste it into any web browser. It will redirect you to the original `longUrl`.

https://YOUR_API_GATEWAY_URL/Prod/aB3xYqZ


---

## Author

* **Mohamed Elhabib Ali**
* **LinkedIn:** [Mohamed Elhabib Ali](https://www.linkedin.com/in/moeshabo)
* **GitHub:** [https://github.com/moeshbo](https://github.com/moeshbo)
