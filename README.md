# What is onErrorLog

onErrorLog is a monitoring service for your startup and your side projects.  The source code is created with Python/Django (API) and React (Dashboard/Admin).

## Key Features
- Monitor your cron jobs
- Monitor your pipeline workflows
- Monitor your background jobs and daemons
- Monitor your API uptime
- Monitor your website uptime

## Technolgies and Platforms
- Python 3 / Django
- React

## Project Design
onErrorLog is made of up 2 different projects:

Project | Technology | Description
--------|------------|------------
API | Python 3 / Django / Celery | The API, which is located in the api folder is a Django project.  It is a REST API that is used by the Dashboard project.  There are also some tasks that use Celery.
Dashboard | React | The Dashboard, which is located in the dasbhoard folder, is a React project.  It is the main UI that the user interacts with.
