# Available_tracker
- Tracking vechile Module.

### Redis Configuration:
    - sudo docker-compose up

### Server configuration
    - node index.js

### API
```
    POST /send_coordinate/{user_id}
    {
        lat: "",
        long: ""
    }
```
```
    - GET /request_nearest_coordinates?lat=&long=&distance=
```
```
    GET /remove_user/{user_id}
```