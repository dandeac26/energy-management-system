import pika
import time
import json
from datetime import datetime
import argparse

default_device_id = "5c2494a3-1140-4c7a-991a-a1a2561c6bc2"


def read_sensor_data(file_path):
    with open(file_path, "r") as file:
        return [float(line.strip()) for line in file.readlines()]


def send_measurement(channel, device_id, measurement_value):
    timestamp = int(time.time() * 1000)  # Current timestamp in milliseconds
    data = {
        "timestamp": timestamp,
        "device_id": device_id,
        "measurement_value": measurement_value,
    }
    json_data = json.dumps(data)

    channel.basic_publish(exchange="", routing_key="Measurements", body=json_data)
    print(f" [Success] Sent: {json_data}")


def main(device_id, file_path):
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="Measurements")

    sensor_data = read_sensor_data(file_path)

    try:
        for measurement_value in sensor_data:
            send_measurement(channel, device_id, measurement_value)
            time.sleep(10)
    except KeyboardInterrupt:
        pass
    finally:
        connection.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RabbitMQ Transmitter")
    parser.add_argument(
        "device_id", help="Device ID", nargs="?", default=default_device_id
    )

    args = parser.parse_args()

    sensors_path = "sensors.csv"

    main(args.device_id, sensors_path)
