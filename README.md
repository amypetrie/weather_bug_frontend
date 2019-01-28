# WeatherBug (Front-end) - In Progress
[![Waffle.io - Columns and their card count](https://badge.waffle.io/amypetrie/weather_bug_frontend.svg?columns=all)](https://waffle.io/amypetrie/weather_bug_frontend)

Check out our Waffle board for project updates and planned enhancements! https://waffle.io/amypetrie/weather_bug_frontend

WeatherBug is weather application built with Rails 5.2 back-end and JavaScript front-end that allows users to search global locations and see current, hourly, and upcoming weather, as well as save favorited locations. This repository is for the front-end, with links to the back-end deployment and repository can be found below below. The front-end utilizes Bootstrap for styling and is a current <strong>work in progress</strong>.

Please review the below instructions to get WeatherBug up and running on your local machine for development purposes.

WeatherBug's back-end is deployed at https://weather-bug.herokuapp.com/, and the GitHub repo is located at https://github.com/amypetrie/weather_bug.

## Table of Contents

* Prerequisites
* Back-end Endpoints
* Installation

## Prerequisites

* JavaScript
* jQuery
* Express
* Mocha
* Chai
* API Key for back-end

## Back-end Endpoints

Below are the current endpoints consumed and displayed by the current deployment.

* `GET /api/v1/forecast?location=denver,co` returns three collections of weather forecast objects with data representing the location's daily, hourly, and upcoming daily weather.

* `POST /api/v1/favorites` with a JSON body of a valid WeatherBug API key and location creates a favorite location in the database for the user.

* `GET /api/v1/favorites` with a JSON body of a valid WeatherBug API key returns a collection of a user's favorite locations, each with corresponding collections of weather forecast objects with data representing the location's daily, hourly, and upcoming daily weather.

## Installation

Clone down this repository, change into the root directory and run:

`npm run build`

Then:

`npm start`

Ensure to run `npm run build` prior to any pull requests.

## Key Contributors

Amy Petrie (https://github.com/amypetrie/)
