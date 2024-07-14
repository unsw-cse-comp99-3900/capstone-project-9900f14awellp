# Invoice Processing System

This is a front-end and back-end separated system for processing invoices. The project is built using Django for the back-end and React for the front-end.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contribution](#contribution)
- [License](#license)

## Project Structure
```
project
│   README.md
│   .gitignore
|   .DS_Store
|   problems_solutions.md
│
└───InvoiceProcessing/
│   │   Dockerfile
│   │   db.sqlite3
|   |   docker-compose.yml
│   │   manage.py
|   |   requirements.txt
|   |
│   └───invoice/
│       │   models.py
│       │   test.py
│       │   ...
│   
└───front-end/
    │   file021.txt
    │   file022.txt
```
## Installation

### Back-end Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/InvoiceProcessing.git
    cd InvoiceProcessing
    ```

2. Set up the virtual environment:
    ```sh
    python -m venv env
    source env/bin/activate
    ```

3. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Run the database migrations:
    ```sh
    python manage.py migrate
    ```

5. Run the development server:
    ```sh
    python manage.py runserver
    ```

### Front-end Installation

1. Navigate to the front-end directory:
    ```sh
    cd front-end
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the React development server:
    ```sh
    npm start
    ```
## Usage

1. Ensure the back-end server is running on `http://localhost:8000`.
2. Ensure the front-end server is running on `http://localhost:3000`.
3. Open `http://localhost:3000` in your browser to use the application.


## Technologies

- **Back-end**: Django, Django REST Framework, SQLite
- **Front-end**: React, Redux, Axios
  
## Contribution

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
