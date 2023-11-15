import pika
import os
import sys
import json

from flask import Flask, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import psycopg2

app = Flask(__name__)

# Replace these values with your actual database information
db_user = "your_postgres_user"
db_password = "your_postgres_password"
db_host = "localhost"
db_port = "5432"
db_name = "your_database_name"

# Construct the connection string
connection_string = (
    f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
)

# Create the engine
engine = create_engine(connection_string)

Base = declarative_base()


class Monitor(Base):
    __tablename__ = "monitor"
    id = Column(Integer, primary_key=True)
    timestamp_value = Column(String(50))
    deviceId = Column(String(200))
    measurement = Column(String(40))


Base.metadata.create_all(engine)
print("Table 'monitor' created successfully.")
Session = sessionmaker(engine)


@app.route("/api/monitor", methods=["POST"])
def create_monitor():
    data = request.get_json()
    deviceId = data["deviceId"]
    measurement = data["measurement"]
    timestamp_value = data["timestamp_value"]
    try:
        session = Session()
        new_monitor = Monitor(timestamp_value=timestamp_value)
        new_monitor = Monitor(deviceId=deviceId)
        new_monitor = Monitor(measurement=measurement)

        session.add(new_monitor)
        session.commit()
        return {
            "id": new_monitor.id,
            "timestamp_value": new_monitor.timestamp_value,
            "deviceId": new_monitor.deviceId,
            "measurement": new_monitor.measurement,
            "message": f"Successfully monitored device {deviceId}.",
        }, 201
    except Exception as e:
        print(f"The error '{e}' occurred.")
        return {"error": "An error occurred while monitoring a device."}, 500


@app.route("/api/monitor", methods=["GET"])
def get_all_entries():
    try:
        session = Session()
        entries = session.query(Monitor).all()
        if entries:
            result = []
            for entry in entries:
                result.append(
                    {
                        "id": entry.id,
                        "timestamp_value": entry.timestamp_value,
                        "deviceId": entry.deviceId,
                        "measurement": entry.measurement,
                    }
                )
            return jsonify(result)
        else:
            return jsonify({"error": f"Entries not found."}), 404
    except Exception as e:
        print(f"The error '{e}' occurred.")
        return {"error": "An error occurred while getting all entries."}, 500


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="Measurements")

    def callback(ch, method, properties, body):
        data = json.loads(body.decode("utf-8"))
        timestamp = data.get("timestamp")
        device_id = data.get("device_id")
        measurement_value = data.get("measurement_value")

        print(
            f"timestamp: {timestamp}\ndevice_id: {device_id}\nmeasurement_value: {measurement_value}\n"
        )

    channel.basic_consume(
        queue="Measurements", auto_ack=True, on_message_callback=callback
    )

    print(" [*] Waiting for messages...")
    channel.start_consuming()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
