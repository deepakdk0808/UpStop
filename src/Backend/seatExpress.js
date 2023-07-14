const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let reservations = [];
const seatLayout = {
  rows: 10,
  seatsPerRow: 7,
  lastRowSeats: 3
};

// API endpoint to get the current reservations
app.get('/reservations', (req, res) => {
  res.json(reservations);
});

// API endpoint to reserve seats
app.post('/reserve', (req, res) => {
  const { seats } = req.body;
  const availableSeats = findAvailableSeats(seats.length);

  if (availableSeats.length === seats.length) {
    const newReservations = seats.map((seat, index) => ({
      seatNumber: seat,
      reservationId: reservations.length + index + 1
    }));

    reservations = [...reservations, ...newReservations];
    res.status(200).json({ message: 'Seats reserved successfully.' });
  } else {
    res.status(400).json({ message: 'Desired number of seats are not available.' });
  }
});

// Function to find available seats
const findAvailableSeats = (numSeats) => {
  const { rows, seatsPerRow, lastRowSeats } = seatLayout;
  const totalSeats = rows * seatsPerRow + lastRowSeats;

  const bookedSeats = reservations.map((reservation) => reservation.seatNumber);

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
