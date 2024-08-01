import React, { useEffect } from "react";
import clipping from "@/assets/clipping.png";
import "./Success.css";
import { Button } from "antd";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  const goDashboard = () => {
    navigate("/home");
  };

  const goCreate = () => {
    navigate("/create");
  };

  useEffect(() => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 5,
        angle: 30,
        spread: 150,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        scalar: 1.7, // 增加粒子大小
        gravity: 0.8, // 减小重力效果，让粒子飘得更远
        ticks: 350, // 增加粒子的生命周期
      });

      confetti({
        particleCount: 5,
        angle: 150,
        spread: 150,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        scalar: 1.7, // 增加粒子大小
        gravity: 0.8, // 减小重力效果，让粒子飘得更远
        ticks: 350, // 增加粒子的生命周期
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []); // Empty dependency array means this effect runs once on mount
  return (
    <div className="success-full-page">
      <img src={clipping} alt="clipping" style={{ width: "21%" }} />
      <div className="success-title">Congratulate!</div>
      <div className="success-detail">
        You have created the invoice successfully!
      </div>
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
