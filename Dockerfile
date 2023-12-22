FROM openjdk:17-oracle
COPY backend/build/libs/backend-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/backend-0.0.1-SNAPSHOT.jar"]