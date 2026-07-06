"use client";

import React from 'react';
import PrototypeGameLayout from "./components/PrototypeGameLayout";
import { Player } from '@/types/player';

export default function PrototypeGameplay() {
  const dummyPlayers: Player[] = [
    {
      id: "p1",
      name: "Player 1",
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      isBot: false,
      activeEffects: []
    },
    {
      id: "p2",
      name: "Player 2",
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      isBot: true,
      activeEffects: []
    }
  ];

  const handleMainMenu = () => {
    console.log("Navigating to main menu (Prototype)");
  };

  return <PrototypeGameLayout initialPlayers={dummyPlayers} onMainMenu={handleMainMenu} />;
}
