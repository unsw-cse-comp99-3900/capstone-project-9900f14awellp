import React, { useEffect } from "react";
import clipping from "@/assets/clipping.png";
import "./Success.css";
import { Button } from "antd";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

// Success component to display a congratulatory message after invoice creation
export default function Success() {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to navigate to the dashboard
  const goDashboard = () => {
    navigate("/home");
  };

  // Function to navigate to the invoice creation page
  const goCreate = () => {
    navigate("/create");
  };

  // Effect hook to create confetti animation on component mount
  useEffect(() => {
    // Set end time for the animation (3 seconds from now)
    const end = Date.now() + 3 * 1000;
    // Define colors for the confetti particles
    const colors = ["#9DBEA1", "#E3A4A2", "#eca184", "#f8deb1"];

    // Function to create confetti frame
    const frame = () => {
      if (Date.now() > end) return; // Stop animation after 3 seconds

      // Create confetti from the left side
      confetti({
        particleCount: 3,
        angle: 30,
        spread: 150,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        scalar: 1.7, // Increase particle size
        gravity: 0.8, // Reduce gravity effect for longer particle travel
        ticks: 230, // Increase particle lifecycle
      });

      // Create confetti from the right side
      confetti({
        particleCount: 3,
        angle: 150,
        spread: 150,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        scalar: 1.7, // Increase particle size
        gravity: 0.8, // Reduce gravity effect for longer particle travel
        ticks: 230, // Increase particle lifecycle
      });

      // Request next animation frame
      requestAnimationFrame(frame);
    };

    // Start the animation
    frame();
  }, []); // Empty dependency array ensures effect runs only once on mount

  // Render the success message and navigation buttons
  return (
    <div className="success-full-page">
      {/* Display clipping image */}
      <img src={clipping} alt="clipping" style={{ width: "21%" }} />

      {/* Congratulatory message */}
      <div className="success-title">Congratulate!</div>
      <div className="success-detail">
        You have created the invoice successfully!
      </div>

      {/* Navigation buttons */}
      <div className="success-button-group">
        <Button size="large" onClick={goDashboard}>
          Back Home
        </Button>
        <Button type="primary" size="large" onClick={goCreate}>
          Create New Invoice
        </Button>
      </div>
    </div>
  );
}
