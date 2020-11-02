# kafka-demo

## Purpose
Sample code to help get up and running with kafka and zookeeper.

## Environment Variables
| Key | Value |
|---|---|
| KAFKA_HOST | localhost:9091 |

## Helpful commands
### Starting Zookeeper and Kafka Docker Images
```
docker-compose -f config/docker-zookeeper-kafka.yaml up -d
```
#### Command breakdown
* `-f config/docker-zookeeper-kafka.yaml` points to the yaml file to use
* `up` to start the containers
* `-d` to detach and run in the background

#### When finished shutdown container by running
```
docker-compose -f config/docker-zookeeper-kafka.yaml down
```

#### Host for Kafka
```
localhost:9091
```

### Creating a new topic
```sh
docker exec -it config_kafka1_1 kafka-topics \
    --zookeeper zookeeper:2181 \
    --create \
    --topic <insert-topic-id> \
    --partitions 1 \
    --replication-factor 1
```

### Consume messages from a topic
```
node app/consumer.js <insert-topic-id>
```

### Publish message
```
node app/publish.js <insert-topic-id> "<insert-message>"
```

## Getting Started
1. Start up zookeeper and kafka docker containers
1. Create a new topic
1. Start the consumer script `app/consumer.js` with newly created topic
1. In another terminal, execute the publish script with topic and a message to send across
1. Your message should be logged in the window where you started the consumer


## Helpful Links
* [Kafka Docker Quick Start](https://devshawn.com/blog/apache-kafka-docker-quick-start/)
* [Kafka Topic Naming Conventions](https://devshawn.com/blog/apache-kafka-topic-naming-conventions/)
* [How to paint a bike shed](https://riccomini.name/how-paint-bike-shed-kafka-topic-naming-conventions) (more naming conventions)


## Other helpful kafka commands
### list topics
```
docker exec -it config_kafka1_1 kafka-topics \
    --zookeeper zookeeper:2181 \
    --list
```
