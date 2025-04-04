# Bus stops interview task

## Required environment
`npm 8.11` and `node 16.15`

## Installed packages ready to use
    "axios": "^0.27.2",
    "bootstrap": "^5.2.1",
    "core-js": "^3.8.3",
    "json-server": "^0.17.0",
    "vitest": "^1.2.0",
    "vue": "^3.2.13",
    "vue-router": "^4.0.3",
    "vuex": "^4.0.0"

`Font: Inter 400, 500, 600`

## Required open ports in environment
`8080` - for the Vue application <br/>
`3000` - for the API server

## How to start environment
1. `npm install` - install dependencies
2. GET THE .env FILE FROM google drive provided
3. `npm run api` - run the API
4. `npm run serve` - for the Vue application

## Assignment
1. You have to implement simple board for bus stops according to the User Stories and corresponding designs
2. Directory `docs` contains `openapi` specification for the `api` response - feel free to play with that to check how api was implemented. 
3. Realization should be as close to the design as possible 
4. Usage of Typescript is required 
5. Handling of loading and error states 
6. Unit tests
7. Avoid using any other libraries

## User stories

1. As a user I can open the url `http://localhost:8080` and see entry page with listed lines (https://www.figma.com/file/Dj4FdiwG7uYUqV8ml7xKSL/Interview-Task---Frontend-Dev?type=design&node-id=701-10332&mode=design&t=TTiUnvJpn1Nl7Rgh-4)
   1. User can see title "Timetable"
   2. User can see navigation with links "Bus Lines" and "Stops" ("Bus Lines" is active link)
   3. User can see listed "Bus Lines". The "Bus Lines" should be sorted in the ascending order
   4. User can see placeholder "Please select the bus line first"
   5. User can click at the line
      1. Placeholder for the "Bus Stops" disappears 
      2. Placeholder "Please select the bus stop first" is displayed for the "Time" list
      3. "Bus Stops" list is displayed (https://www.figma.com/file/Dj4FdiwG7uYUqV8ml7xKSL/Interview-Task---Frontend-Dev?type=design&node-id=701-27993&mode=design&t=TTiUnvJpn1Nl7Rgh-4)
      4. "Bus Stops" should be sortable by clicking on the icon near the title (by field 'order')
      5. By default, "Bus Stops" should be sorted in the ascending order
   6. When line is selected, User can click at the stop
      1. Placeholder for the "Time" list disappears
      2. "Time" list is displayed (https://www.figma.com/file/Dj4FdiwG7uYUqV8ml7xKSL/Interview-Task---Frontend-Dev?type=design&node-id=701-36989&mode=design&t=TTiUnvJpn1Nl7Rgh-4)
      3. "Time" list entries should be sorted in the ascending order

2. As a user I can open the url `http://localhost:8080/stops` and see "stops" page with listed stops (https://www.figma.com/file/Dj4FdiwG7uYUqV8ml7xKSL/Interview-Task---Frontend-Dev?type=design&node-id=701-38103&mode=design&t=TTiUnvJpn1Nl7Rgh-4)
   1. User can see title "Timetable"
   2. User can see navigation with links "Bus Lines" and "Stops" ("Stops" is active link)
   3. User can see the search bar
      1. If search bar is empty all stops should be visible
      2. Once any search term is entered, "Bus Stops" list should be filtered (https://www.figma.com/file/Dj4FdiwG7uYUqV8ml7xKSL/Interview-Task---Frontend-Dev?type=design&node-id=701-40971&mode=design&t=TTiUnvJpn1Nl7Rgh-4)
   4. User can see listed "Bus Stops". The "Bus Stops" should be sorted in the ascending order
   5. "Bus Stops" should be sortable by clicking on the icon near the title
