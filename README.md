# secret-santa

1. Clone this repo
2. Run `npm install`
3. Run `npm start`

## Participant registration

1. Go to the `/register` page.
2. Fill in the form: add name, surname and at least one wish in Latin characters.
3. Submit the form. 
- If successful, it will redirect to the page which will anounce the user's id.
- When number of participants reach 500, the form will be no longer submittable.
- New users can't be registered after shuffling.

## Getting receiver information

**Note: getting receiver data is only possible after participants are shuffled.**

1. Go to the `/` page and enter your id. 
2. If users with such id exists, you will be redirected to the page with receiver information such as name, lastname and a list of wishes. 

## Shuffling players

- When number of participants reach 3, shuffling will be available.
- Shuffling can be done only once.
- It is guaranteed that any participant can't become the santa of himself.
