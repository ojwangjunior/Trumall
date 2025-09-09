- how to create migrations

``sudo -u postgres psql``
```
CREATE USER trustmall WITH PASSWORD 'secretpassword';
CREATE DATABASE trustmall_dev OWNER trustmall;
GRANT ALL PRIVILEGES ON DATABASE trustmall_dev TO trustmall;
```

``\q``

- then run this to test db connection from the terminal

``psql -h localhost -U trustmall -d trustmall_dev``

- if you see this, then its good to go

``trustmall_dev=>``

- To make sure the UUID extension is enabled in trustmall_dev:

``CREATE EXTENSION IF NOT EXISTS "uuid-ossp";``

- Then veryfy it was created

``\dx``
