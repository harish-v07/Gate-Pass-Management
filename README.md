## Setup

### Run it locally
#### Clone the repo
```
git clone https://github.com/harish-v07/Gate-Pass-Management.git
cd Gate-Pass-Management
```
#### Backend:

Before running the backend, create the file:
backend/src/main/resources/application.properties

```
spring.application.name=gatepass-backend
spring.datasource.url=jdbc:mysql://localhost:3306/gatepass?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run:
GatepassBackendApplication.java directly in any IDE          

#### Frontend:
```
cd frontend
npm install
npm run dev

```
