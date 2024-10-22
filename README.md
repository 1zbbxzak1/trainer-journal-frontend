# Trainer's journal (Frontend)

[Link to the backend project](https://github.com/AnTaif/trainer-journal-backend)

_Developed for the UrFU Project Practice 2024 (5th semester)_

## Contents

1. <a href = "#stack">Tech Stack</a>
2. <a href = "#start">Getting Started</a>

<a name = stack></a>  
## Tech Stack
**Frameworks & Libraries:**
- HTML
- CSS
- TypeScript
- Angular
- Bryntum

**Deployments:** Docker


<a name = start></a>
## Getting Started
  1. Clone the repository:
  ```bash 
  git clone https://github.com/1zbbxzak1/trainer-journal-frontend.git
  ```
  2. Navigate to the project directory:
  ```bash
  cd trainer-journal-frontend
  ```

### Next, two launch scenarios:

**First:**

  3. Build Docker Image:
  ```bash
  docker build -t trainer-journal-frontend .
  ```
  4. Running Docker Container:
  ```bash
  docker run --name trainer-journal-frontend --rm -p 4200:4200 trainer-journal-frontend
  ```
  5. Go to:
  ```bash
  http://localhost:4200
  ```
  6. To stop the application and remove the container, run:
  ```bash
  docker stop trainer-journal-frontend
  ```

**Second:**

  3. Install Angular: 
  ```bash
  npm install -g @angular/cli
  ```
  4. Install packages:
  ```bash
  npm install
  ```
  5. After that, start the project: 
  ```bash
  npm start
  ```
  4. Go to:
  ```bash
  http://localhost:4200
  ```
  5. To stop the application, press in the terminal:
  ```bash
  Ctrl + C
  ```
