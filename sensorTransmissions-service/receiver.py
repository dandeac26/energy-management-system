import pika
import os
import sys
import json
from queue import Queue
import threading
import signal
import time

# import asyncio
import socketio
import logging

# import websockets

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import BigInteger

from datetime import datetime, timedelta

import psycopg2


logging.basicConfig(filename="app.log", level=logging.INFO)

app = Flask(__name__)
CORS(app)

message_queue = Queue()


def signal_handler(signal, frame):
    print("\nStopping the program...")
    sys.exit(0)


def flask_run():
    app.run(debug=True, host="0.0.0.0", use_reloader=False, use_debugger=False)


db_user = "postgres"
db_password = "root"
db_host = "postgres-mon"  # DOCKER
# db_host = "localhost"  # TEST
db_port = "5432"
db_name = "monitor_db"

connection_string = (
    f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
)

engine = create_engine(connection_string)

Base = declarative_base()


def log_update_to_file(data):
    with open("update_log.txt", "a") as file:
        file.write(json.dumps(data) + "\n")


# connected_clients = set()


# async def notify_clients(message, connected_clients):
#     # Send the message to all connected clients
#     for websocket in connected_clients:
#         await websocket.send(message)


# async def handler(websocket, path, connected_clients):
#     # Handle incoming connections and messages here
#     connected_clients.add(websocket)
#     try:
#         while True:
#             message = await websocket.recv()
#             # Process the message and send a response if needed
#             data = {"notification": "You have a new message!", "content": message}
#             await notify_clients(json.dumps(data), connected_clients)
#     finally:
#         # Remove the client when the connection is closed
#         connected_clients.remove(websocket)


# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()


# SOCKETIO TRY

sio = socketio.Server(cors_allowed_origins="*")


# Wrap the Flask app with Socket.IO WSGI application
socketio_app = socketio.WSGIApp(sio, app)

from threading import Lock

connected_clients = {}

# connected_clients_lock = Lock()


# def process_message_queue():
#     while True:
#         message = message_queue.get()
#         broadcast_message(message)
#         message_queue.task_done()


def test_emit():
    try:
        sio.emit("message", {"test": "data"})
        logging.info("Test emit successful")
    except Exception as e:
        logging.error("Test emit failed: %s", str(e))


@sio.event
def connect(sid, environ):
    print("Client connected:", sid)
    problems = False

    try:
        session = Session()
        # Query the database to find the monitor with the given deviceId
        monitors = session.query(Monitor).all()

        # List to hold devices that meet the condition
        devices_to_check = []

        # Iterate over each monitor and check the condition
        for monitor in monitors:
            max_measurement_float = float(monitor.max_measurement)
            measurement_float = float(monitor.measurement)

            if measurement_float >= max_measurement_float:
                devices_to_check.append(monitor)
                problems = True

    except SQLAlchemyError as e:
        print(f"The error '{e}' occurred.")
        session.rollback()
        return {
            "error": "An error occurred while deleting a device from monitoring db."
        }, 500
    finally:
        session.close()

    if problems == True:
        for device in devices_to_check:
            notification_message = {
                "notification": "Alert",
                "content": f"Device {device.deviceId} exceeded maximum hourly consumption!\nMax: {device.max_measurement}\nCurrent reading: {device.measurement}",
            }
            sio.emit(
                "message",
                notification_message,
                to=sid,
            )
    problems = False
    # with connected_clients_lock:
    # with connected_clients_lock:
    connected_clients[sid] = sid
    logging.info("Client connected: %s", sid)


@sio.event
def disconnect(sid):
    print("Client disconnected:", sid)
    # with connected_clients_lock:
    # with connected_clients_lock:
    connected_clients.pop(sid, None)
    logging.info("Client disconnected: %s", sid)


def send_message(data, sid):
    # with connected_clients_lock:
    if sid in connected_clients:
        sio.emit("message", data, to=sid)
    else:
        print(f"Client with sid {sid} not found.")


# def broadcast_message(data):
#     sio.emit("message", data, to=sid)


def broadcast_message(data):
    # with connected_clients_lock:
    for sid in connected_clients.keys():
        logging.info("Client iterated: %s\n", sid)
        print("reached broadcast, sid is: " + sid + "and data: " + str(data))
        sio.emit(
            "message",
            {"notification": "BROADCAST!", "content": "BROADCAST to the server."},
            to=sid,
        )
        sio.emit("message", data, to=sid)


# def broadcast_message(data):
#     # with connected_clients_lock:
#     for sid in connected_clients.keys():
#         logging.info("Broadcasting to SID: %s", sid)
#         try:
#             sio.emit("message", {"data": "Broadcast data"}, to=sid)
#             logging.info("Broadcast successful to SID: %s", sid)
#         except Exception as e:
#             logging.error("Error broadcasting to SID: %s, Error: %s", sid, str(e))


class Monitor(Base):
    __tablename__ = "monitor"
    id = Column(Integer, primary_key=True)
    timestamp_value = Column(String(50))
    deviceId = Column(String(200), unique=True)
    measurement = Column(String(40))
    max_measurement = Column(String(10))


class Measurements_tb(Base):
    __tablename__ = "measurements_tb"
    id = Column(Integer, primary_key=True)
    timestamp_value = Column(String(50))
    deviceId = Column(String(200))
    measurement = Column(String(40))


Base.metadata.create_all(engine)
print("Table 'monitor' created successfully.")
Session = sessionmaker(engine)

latest_measurements = {}


# @app.route("/latest-measurements", methods=["GET"])
# def get_latest_measurements():
#     # print("MESSAGE!!!\n\n" + jsonify(latest_measurements))
#     return jsonify(latest_measurements)


# @app.route("/latest-measurements/<device_id>/<formattedDate>", methods=["GET"])
# def get_latest_measurements(device_id):
#     try:
#         session = Session()
#         measurements = (
#             session.query(Measurements_tb).filter_by(deviceId=device_id).all()
#         )

#         result = [
#             {
#                 "id": measurement.id,
#                 "timestamp_value": measurement.timestamp_value,
#                 "deviceId": measurement.deviceId,
#                 "measurement": measurement.measurement,
#             }
#             for measurement in measurements
#         ]

#         return jsonify(result)
#     except SQLAlchemyError as e:
#         print(f"The error '{e}' occurred.")
#         session.rollback()
#         return {"error": "An error occurred while fetching the measurements."}, 500
#     finally:
#         session.close()


@app.route("/measurements/<device_id>/<formattedDate>", methods=["GET"])
def get_latest_measurements(device_id, formattedDate):
    try:
        # Convert the formattedDate string to a datetime object (start of day)
        start_of_day = datetime.strptime(formattedDate, "%Y-%m-%d")
        # Calculate end of the day as the start of the next day
        end_of_day = start_of_day + timedelta(days=1)

        session = Session()
        # Update the query
        measurements = (
            session.query(Measurements_tb)
            .filter_by(deviceId=device_id)
            .filter(
                func.to_timestamp(
                    func.cast(Measurements_tb.timestamp_value, BigInteger) / 1000
                )
                >= start_of_day,
                func.to_timestamp(
                    func.cast(Measurements_tb.timestamp_value, BigInteger) / 1000
                )
                < end_of_day,
            )
            .all()
        )

        result = [
            {
                "id": measurement.id,
                "timestamp_value": measurement.timestamp_value,
                "deviceId": measurement.deviceId,
                "measurement": measurement.measurement,
            }
            for measurement in measurements
        ]

        return jsonify(result)
    except SQLAlchemyError as e:
        print(f"The error '{e}' occurred.")
        session.rollback()
        return {"error": "An error occurred while fetching the measurements."}, 500
    finally:
        session.close()


@app.route("/test_emit")
def test_emit_route():
    try:
        sio.emit("test_message", {"data": "test data"})
        return "Emit attempted", 200
    except Exception as e:
        return f"Emit failed: {e}", 500


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
            if new_timestamp - previous_timestamp >= timedelta(seconds=60):  # 21
                if float(monitor_to_update.measurement) >= float(
                    monitor_to_update.max_measurement
                ):
                    notification_message = {
                        "notification": "Alert",
                        "content": f"Device {monitor_to_update.deviceId} exceeded maximum hourly consumption!\nMax: {monitor_to_update.max_measurement}\nCurrent reading: {monitor_to_update.measurement}",
                    }
                    # broadcast_message(notification_message)
                    # message_queue.put(notification_message)
                    # log_update_to_file(notification_message)
                    latest_measurements[deviceId] = {
                        "measurement": monitor_to_update.measurement,
                        "timestamp": timestamp,
                    }

                insert_measurement_value = str(
                    round(
                        float(monitor_to_update.measurement) + float(measurement_value),
                        5,
                    )
                )

                insert_reading(deviceId, insert_measurement_value, timestamp)
                print("\nreached 1 minute\n")
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


def insert_reading(deviceId, measurement, timestamp_value):
    try:
        session = Session()
        new_measurement = Measurements_tb(
            deviceId=deviceId,
            measurement=measurement,
            timestamp_value=timestamp_value,
        )

        session.add(new_measurement)
        session.commit()
        print(f"New measurement inserted for device {deviceId}.")
    except Exception as e:
        print(f"The error '{e}' occurred.")
        session.rollback()
    finally:
        session.close()


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters("rabbitmq")
    )  # DOCKER

    # connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))  # TEST
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


def socket_run():
    # process_message_queue()
    import eventlet

    # eventlet.monkey_patch(
    eventlet.wsgi.server(eventlet.listen(("", 5001)), socketio_app)


def process_updates():
    last_size = 0
    while True:
        current_size = os.path.getsize("update_log.txt")
        if current_size > last_size:
            with open("update_log.txt", "r") as file:
                file.seek(last_size)
                for line in file:
                    data = json.loads(line.strip())
                    broadcast_message(data)  # Or any other processing
            last_size = current_size
        time.sleep(1)  # Poll every 1 second (adjust as needed)


if __name__ == "__main__":
    # time.sleep(35)
    try:
        # Websockets
        # asyncio.run(main())

        # make Ctrl+C work

        signal.signal(signal.SIGINT, signal_handler)

        # queue_processor_thread = threading.Thread(target=process_message_queue)
        # queue_processor_thread.start()

        # Create a separate thread for the main() function
        main_thread = threading.Thread(target=main)

        # Start the Flask thread
        flask_thread = threading.Thread(target=flask_run)

        socket_thread = threading.Thread(target=socket_run)

        # Starting threads
        main_thread.start()
        flask_thread.start()
        socket_thread.start()

        # file_processor_thread = threading.Thread(target=process_updates)
        # file_processor_thread.start()

        # process_updates()
        # stopping threads
        main_thread.join()
        flask_thread.join()
        socket_thread.join()
    except SystemExit:
        print("Exiting the program.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        pass
