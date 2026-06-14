Feature: Booking creation

    Background:
        * url baseUrl

    Scenario: Create a booking for a valid room
    # Look up a valid roomid first - tests must not depend on fixed/seeded ids
        Given path '/room'
        When method GET
        Then status 200
        And match response.rooms == '#array'
        * if (response.rooms.length == 0) karate.fail('No rooms returned by GET /room - cannot proceed with booking creation')
        * def firstRoom = response.rooms[0]
        * if (!firstRoom.roomid) karate.fail('Invalid room object: roomid is missing -> ' + karate.pretty(firstRoom))

        * match firstRoom.roomid == '#number'
        * def roomId = firstRoom.roomid

    # Randomize stay dates across a wide window to make accidental collisions
    # with bookings from prior runs unlikely (the room response doesn't expose
    # existing bookings, so we can't check directly; the API also doesn't
    # reject overlapping bookings).
        * def dateHelper = call read('classpath:utils/date-helper.js')
        * def stayDates = dateHelper.randomFutureStayDates(30, 330, 3)
        * def checkin = stayDates.checkin
        * def checkout = stayDates.checkout

        Given path '/booking'
        And header Content-Type = 'application/json'
        And request
      """
      {
        roomid: #(roomId),
        firstname: 'John',
        lastname: 'Smith',
        depositpaid: true,
        bookingdates: {
          checkin: '#(checkin)',
          checkout: '#(checkout)'
        }
      }
      """
        When method POST
        Then status 201
        And match response ==
      """
      {
        bookingid: '#number',
        roomid: '#(roomId)',
        firstname: 'John',
        lastname: 'Smith',
        depositpaid: true,
        bookingdates: {
          checkin: '#(checkin)',
          checkout: '#(checkout)'
        }
      }
      """
