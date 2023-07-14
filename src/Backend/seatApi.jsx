import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './SeatReservationSystem.css';

const SeatReservationSystem = () => {
  const [reservations, setReservations] = useState([]);

  const seatLayout = {
    rows: 11,
    seatsPerRow: 7,
    lastRowSeats: 3
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reservations');
      setReservations(response.data);
    } catch (error) {
      console.log('Error fetching reservations:', error);
    }
  };

  const reserveSeats = async (numSeats) => {
    try {
      const availableSeats = findAvailableSeats(numSeats);
      if (availableSeats.length === numSeats) {
        const response = await axios.post('http://localhost:3000/reserve', { seats: availableSeats });
        console.log(response.data.message);
        fetchReservations();
      } else {
        console.log('Desired number of seats are not available.');
      }
    } catch (error) {
      console.log('Error reserving seats:', error);
    }
  };

  const findAvailableSeats = (numSeats) => {
    const { rows, seatsPerRow, lastRowSeats } = seatLayout;
    const totalSeats = rows * seatsPerRow + lastRowSeats;
    const bookedSeats = reservations.map(reservation => reservation.seatNumber);

    const availableSeats = [];
    let consecutiveSeats = 0;

    for (let i = 1; i <= totalSeats; i++) {
      if (!bookedSeats.includes(i)) {
        consecutiveSeats++;
        
        if (consecutiveSeats === numSeats) {
          for (let j = i - numSeats + 1; j <= i; j++) {
            availableSeats.push(j);
          }
          break;
        }
      } else {
        consecutiveSeats = 0;
      }
    }

    return availableSeats;
  };

  const handleSeatClick = (numSeats) => {
    reserveSeats(numSeats);
  };

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
                    const isReserved = reservations.some(reservation => reservation.seatNumber === seatNumber);

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
        <p>Reserved seats: {reservations.map(reservation => reservation.seatNumber).join(', ')}</p>
        <p>
          Remaining seats: {seatLayout.rows * seatLayout.seatsPerRow + seatLayout.lastRowSeats - reservations.length}
        </p>
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
