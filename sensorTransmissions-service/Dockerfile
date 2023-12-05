# Use an official Python runtime as a parent image
FROM python:3.11.2-slim


RUN apt-get update && apt-get install -y wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Set the working directory in the container
WORKDIR /app

RUN apt-get update && apt-get install -y gcc

# Copy the contents of the current directory into the container
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Define environment variable
ENV NAME World

# Run your Python script when the container launches
CMD ["dockerize", "-wait", "tcp://rabbitmq:5672", "-timeout", "60s","python", "receiver.py"]
