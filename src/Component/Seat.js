import React, { useState } from 'react';

 const SeatReservationSystem = () => {
  // State for seat reservations
  const [reservations, setReservations] = useState([]);

  // Seat layout configuration
  const seatLayout = {
    rows: 11, // Total number of rows
    seatsPerRow: 7, // Number of seats per row (except the last row)
    lastRowSeats: 3 // Number of seats in the last row
  };

  // Function to handle seat reservation
  const reserveSeats = (numSeats) => {
    // Check for available seats
    const availableSeats = findAvailableSeats(numSeats);

    if (availableSeats.length === numSeats) {
      // Reserve the seats
      const updatedReservations = [...reservations, ...availableSeats];
      setReservations(updatedReservations);
    } else {
      // Show error or display a message that desired number of seats are not available
      console.log('Desired number of seats are not available.');
    }
  };

  // Function to find available seats
  const findAvailableSeats = (numSeats) => {
    const { rows, seatsPerRow, lastRowSeats } = seatLayout;
    const totalSeats = rows * seatsPerRow + lastRowSeats;

    // Iterate over the seats to find available seats
    const availableSeats = [];
    let consecutiveSeats = 0;

    for (let i = 1; i <= totalSeats; i++) {
      // Check if the seat is already reserved
      if (!reservations.includes(i)) {
        consecutiveSeats++;

        if (consecutiveSeats === numSeats) {
          // Found consecutive seats
          for (let j = i - numSeats + 1; j <= i; j++) {
            availableSeats.push(j);
          }
          break;
        }
      } else {
        consecutiveSeats = 0; // Reset consecutive seats counter
      }
    }

    return availableSeats;
  };

  // Function to handle seat button click
  const handleSeatClick = (numSeats) => {
    reserveSeats(numSeats);
  };

  // Render the seat layout and reservation details
  return (
    <div className="seat-reservation-system">
      <h2>Seat Reservation System</h2>
      <div className="seat-layout-container">
        <h3>Seat Layout</h3>
        <p>Click on a seat to reserve:</p>
        <div className="seat-layout">
          {Array(seatLayout.rows)
            .fill()
            .map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row">
                {Array(rowIndex === seatLayout.rows - 1 ? seatLayout.lastRowSeats : seatLayout.seatsPerRow)
                  .fill()
                  .map((_, seatIndex) => {
                    const seatNumber = rowIndex * seatLayout.seatsPerRow + seatIndex + 1;
                    const isReserved = reservations.includes(seatNumber);

                    return (
                      <button
                        key={seatNumber}
                        disabled={isReserved}
                        onClick={() => handleSeatClick(1)}
                        className={`seat ${isReserved ? 'reserved' : 'available'}`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
      <div className="reservation-details">
        <h3>Reservation Details</h3>
        <p>Reserved seats: {reservations.join(', ')}</p>
        <p>Remaining seats: {seatLayout.rows * seatLayout.seatsPerRow + seatLayout.lastRowSeats - reservations.length}</p>
      </div>
      <div className="book-seats">
        <h3>Book Seats</h3>
        <p>Enter the number of seats you want to book:</p>
        <input type="number" min="1" onChange={(e) => handleSeatClick(parseInt(e.target.value))} />
      </div>
    </div>
  );
};

export default SeatReservationSystem;
