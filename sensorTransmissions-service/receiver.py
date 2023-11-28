import pika
import os
import sys
import json
import threading
import signal
import time

from flask import Flask, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

import psycopg2

app = Flask(__name__)


def signal_handler(signal, frame):
    print("\nStopping the program...")
    sys.exit(0)


def flask_run():
    app.run(debug=True, host="0.0.0.0", use_reloader=False, use_debugger=False)


db_user = "postgres"
db_password = "root"
db_host = "postgres-mon"
db_port = "5432"
db_name = "monitor_db"

connection_string = (
    f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
)

engine = create_engine(connection_string)

Base = declarative_base()


class Monitor(Base):
    __tablename__ = "monitor"
    id = Column(Integer, primary_key=True)
    timestamp_value = Column(String(50))
    deviceId = Column(String(200), unique=True)
    measurement = Column(String(40))
    max_measurement = Column(String(10))


Base.metadata.create_all(engine)
print("Table 'monitor' created successfully.")
Session = sessionmaker(engine)


@app.route("/api/monitor", methods=["POST"])
def create_monitor():
    data = request.get_json()
    deviceId = data["deviceId"]
    measurement = data["measurement"]
    timestamp_value = data["timestamp_value"]
    max_measurement = data["max_measurement"]
    try:
        session = Session()
        new_monitor = Monitor(
            deviceId=deviceId,
            measurement=measurement,
            timestamp_value=timestamp_value,
            max_measurement=max_measurement,
        )

        session.add(new_monitor)
        session.commit()
        return {
            "id": new_monitor.id,
            "timestamp_value": new_monitor.timestamp_value,
            "deviceId": new_monitor.deviceId,
            "measurement": new_monitor.measurement,
            "max_measurement": new_monitor.max_measurement,
            "message": f"Successfully monitored device {deviceId}.",
        }, 201
    except Exception as e:
        print(f"The error '{e}' occurred.")
        return {"error": "An error occurred while monitoring a device."}, 500


def create_local_monitor(deviceId, measurement, timestamp_value, max_measurement):
    try:
        session = Session()
        new_monitor = Monitor(
            deviceId=deviceId,
            measurement=measurement,
            timestamp_value=timestamp_value,
            max_measurement=max_measurement,
        )

        session.add(new_monitor)
        session.commit()
        return {
            "id": new_monitor.id,
            "timestamp_value": new_monitor.timestamp_value,
            "deviceId": new_monitor.deviceId,
            "measurement": new_monitor.measurement,
            "max_measurement": new_monitor.max_measurement,
            "message": f"Successfully monitored device {deviceId}.",
        }, 201
    except Exception as e:
        print(f"The error '{e}' occurred.")
        return {"error": "An error occurred while monitoring a device."}, 500


def delete_monitor(deviceId):
    try:
        session = Session()
        # Query the database to find the monitor with the given deviceId
        monitor_to_delete = session.query(Monitor).filter_by(deviceId=deviceId).first()

        if monitor_to_delete:
            # Delete the monitor
            session.delete(monitor_to_delete)
            session.commit()
            return {
                "message": f"Monitor with deviceId {deviceId} deleted successfully."
            }, 200
        else:
            return {"error": f"Monitor with deviceId {deviceId} not found."}, 404

    except SQLAlchemyError as e:
        print(f"The error '{e}' occurred.")
        session.rollback()
        return {
            "error": "An error occurred while deleting a device from monitoring db."
        }, 500
    finally:
        session.close()


def update_monitor(timestamp, deviceId, measurement_value):
    try:
        session = Session()
        # Find the monitor with the specified deviceId
        monitor_to_update = session.query(Monitor).filter_by(deviceId=deviceId).first()

        if monitor_to_update:
            # Convert existing timestamp to datetime
            previous_timestamp = datetime.utcfromtimestamp(
                int(monitor_to_update.timestamp_value) / 1000.0
            )

            # Convert new timestamp to datetime
            new_timestamp = datetime.utcfromtimestamp(timestamp / 1000.0)

            # Check if the new timestamp is 1 hour more than the previous timestamp
            if new_timestamp - previous_timestamp >= timedelta(minutes=1):
                # Update timestamp and set measurement to 0
                monitor_to_update.timestamp_value = str(int(timestamp))
                monitor_to_update.measurement = "0"
                print(
                    f"Timestamp and measurement for device {deviceId} updated successfully (1 hour difference)."
                )
            else:
                monitor_to_update.measurement = str(
                    round(
                        float(monitor_to_update.measurement) + float(measurement_value),
                        5,
                    )
                )
                print(f"Measurement for device {deviceId} updated successfully.")

            session.commit()

    except SQLAlchemyError as e:
        print(f"The error '{e}' occurred.")
        session.rollback()
    finally:
        session.close()


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
                        "max_measurement": entry.max_measurement,
                    }
                )
            return jsonify(result)
        else:
            return jsonify({"error": f"Entries not found."}), 404
    except Exception as e:
        print(f"The error '{e}' occurred.")
        return {"error": "An error occurred while getting all entries."}, 500


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = connection.channel()
    channel_sync = connection.channel()

    channel.queue_declare(queue="Measurements")
    channel_sync.queue_declare(queue="Sync", durable=True)

    def sync_callback(ch, method, properties, body):
        data = json.loads(body.decode("utf-8"))
        operation = data.get("operation")
        device_id = data.get("deviceId")
        max_measurement = data.get("max_measurement")

        print(
            f"operation: {operation}\ndevice_id: {device_id}\nmax_measurement: {max_measurement}\n"
        )

        timestamp = int(time.time() * 1000)
        with app.app_context():
            if operation == "insert":
                create_monitor_response = create_local_monitor(
                    device_id, 0, timestamp, max_measurement
                )
                print(create_monitor_response)
            elif operation == "delete":
                delete_monitor(device_id)

    def callback(ch, method, properties, body):
        data = json.loads(body.decode("utf-8"))
        timestamp = data.get("timestamp")
        device_id = data.get("device_id")
        measurement_value = data.get("measurement_value")

        print(
            f"timestamp: {timestamp}\ndevice_id: {device_id}\nmeasurement_value: {measurement_value}\n"
        )

        update_monitor(timestamp, device_id, measurement_value)

    channel.basic_consume(
        queue="Measurements", auto_ack=True, on_message_callback=callback
    )
    channel_sync.basic_consume(
        queue="Sync", auto_ack=True, on_message_callback=sync_callback
    )

    print(" [*] Waiting for messages...")
    channel_sync.start_consuming()
    channel.start_consuming()


if __name__ == "__main__":
    time.sleep(15)
    try:
        # make Ctrl+C work
        signal.signal(signal.SIGINT, signal_handler)

        # Create a separate thread for the main() function
        main_thread = threading.Thread(target=main)

        # Start the Flask thread
        flask_thread = threading.Thread(target=flask_run)

        # Starting threads
        main_thread.start()
        flask_thread.start()

        # stopping threads
        main_thread.join()
        flask_thread.join()

    except SystemExit:
        print("Exiting the program.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        pass
