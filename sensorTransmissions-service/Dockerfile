# Use an official Python runtime as a parent image
FROM python:3.11.2-slim

# Set the working directory in the container
WORKDIR /app

# Copy the contents of the current directory into the container
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Define environment variable
ENV NAME World

# Run your Python script when the container launches
CMD ["python", "receiver.py"]
