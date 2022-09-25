
# Mail App
This project is an Email application that allows users to sign-up, login, create and send mails between accounts.This project is a solution to CS50’s Web Programming with Python and JavaScript project 3 .



## Pre-requisites and Local Development
Developers using this project should already have Python3 installed on their local machines.

Clone the project

```bash
  git clone https://github.com/deen257/cs50-mail-solution
```

Go to the project directory

```bash
  cd mail
```

Make migrations for the app database

```bash
  python manage.py makemigrations mail
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```


## API Reference
This application supports the following API routes:
#### GET /emails/<str:mailbox>

```
[
    {
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
    },
    {
        "id": 95,
        "sender": "baz@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Meeting Tomorrow",
        "body": "What time are we meeting?",
        "timestamp": "Jan 1 2020, 12:00 AM",
        "read": true,
        "archived": false
    }
]
```
#### GET /emails/<str:mailbox>
```
{
        "id": 100,
        "sender": "foo@example.com",
        "recipients": ["bar@example.com"],
        "subject": "Hello!",
        "body": "Hello, world!",
        "timestamp": "Jan 2 2020, 12:00 AM",
        "read": false,
        "archived": false
}
```

#### POST /emails

```
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: 'baz@example.com',
      subject: 'Meeting time',
      body: 'How about we meet tomorrow at 3pm?'
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
});
```
#### PUT /emails/<int:email_id>
```
fetch('/emails/100', {
  method: 'PUT',
  body: JSON.stringify({
      archived: true
  })
})
```



## Tech Stack
**Tech:** HTML, CSS, python 
**Database:** sqlite
**Framework:** Django

## Deployment N/A


## Acknowledgements

 - CS50 teaching staff for the distribution code

## Author
DEEN

