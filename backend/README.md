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



PassKey bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919

Consure Key jo88XqPxzYjVjITKrIBNAiUyLguSyvYVxyGyJ9zx74B9sFFK

consumer secret e8q902XKkGB8njTPgO5HDzCBQpyEEAwo0jSARlBHeG3B3Gg9HOooAOApVMVIqmvG
