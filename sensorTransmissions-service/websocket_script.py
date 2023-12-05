import socketio
import time

# Create a Socket.IO client
sio = socketio.Client()

# Define the URL of the Socket.IO server
socketio_server_url = "http://localhost:3000"  # Change to your server's URL and port


@sio.event
def connect():
    print("Connected to Socket.IO server")


@sio.event
def disconnect():
    print("Disconnected from Socket.IO server")


def send_message_every_10_seconds():
    while True:
        try:
            sio.emit("message", {"data": "Hello from Python script!"})
            print("Message sent")
        except Exception as e:
            print(f"Error sending message: {e}")
        time.sleep(10)


if __name__ == "__main__":
    try:
        sio.connect(socketio_server_url)
        send_message_every_10_seconds()
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        sio.disconnect()
