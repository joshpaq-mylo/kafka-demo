# kafka-demo

## Starting Zookeeper and Kafka Docker Images
`docker-compose -f config/docker-zookeeper-kafka.yaml up -d`
* `-f config/docker-zookeeper-kafka.yaml` points to the yaml file to use
* `up` to start the containers
* `-d` to detach and run in the background

### Host for Kafka
`localhost:9091`

## Creating a new topic
`docker exec -it config_kafka1_1 kafka-topics --zookeeper zookeeper:2181 --create --topic <insert-topic-name> --partitions 1 --replication-factor 1`

## Consume messages from a topic
`node app/subscriber.js <insert-topic-name>`

## Publish message
`node app/publish.js <insert-topic-name> "<insert-message>"`


## Helpful Links
* [Docker Quick Start](https://devshawn.com/blog/apache-kafka-docker-quick-start/)
* [Kafka Topic Naming Conventions](https://devshawn.com/blog/apache-kafka-topic-naming-conventions/)
* [How to paint a bike shed](https://riccomini.name/how-paint-bike-shed-kafka-topic-naming-conventions)
