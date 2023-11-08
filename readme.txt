This is an energy management system developed during the distributed system course.


#Remove any previous containers or images - use 'sudo" if on linux! if not remove "sudo" and all appearances!
sudo docker ps -q | xargs -r sudo docker rm -f && sudo docker image ls -q | xargs -r sudo docker rmi -f

#build the user microservice container:
sudo docker build . -t users-service --no-cache && sudo docker compose up --remove-orphans

#build the device microservice container:
sudo docker build . -t devices-service --no-cache && sudo docker compose up --remove-orphans

#build the frontend container:
sudo docker build . -t frontend --no-cache && sudo docker compose up --remove-orphans
