# Installing Docker and Docker Compose on AWS EC2

Install Docker official [AWS ECS install docker getting started](https://docs.aws.amazon.com/AmazonECS/latest/userguide/docker-basics.html)

## Installing Docker Compose

```
sudo curl -L --fail https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod -v +x /usr/local/bin/docker-compose

```

Make docker-compose available as `docker compose` for only the ec2 user

```
sudo mkdir -p $HOME/.docker/cli-plugins
sudo cp /usr/local/bin/docker-compose $HOME/.docker/cli-plugins
```

Make docker-compose available as `docker compose` system-wide

```
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo cp /usr/local/bin/docker-compose /usr/local/lib/docker/cli-plugins
```

Check other install destination on the [docker compose README.md](https://github.com/docker/compose#linux)

