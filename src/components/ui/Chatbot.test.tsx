import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chatbot } from './Chatbot';

describe('Chatbot Component', () => {
  it('should render the floating button initially closed', () => {
    render(<Chatbot />);
    
    // O chatbox não deve estar visível no início
    const chatHeader = screen.queryByText('XTAGE AI');
    expect(chatHeader).not.toBeInTheDocument();
  });

  it('should open the chatbox when the button is clicked', () => {
    render(<Chatbot />);
    
    // Procuramos o botão (ele não tem texto, mas é um button)
    const toggleButtons = screen.getAllByRole('button');
    // Clicando no botão flutuante principal
    fireEvent.click(toggleButtons[0]);

    // O chatbox agora deve aparecer
    const chatHeader = screen.getByText('XTAGE AI');
    expect(chatHeader).toBeInTheDocument();
    
    const welcomeText = screen.getByText(/Como posso ajudar/i);
    expect(welcomeText).toBeInTheDocument();
  });

  it('should close the chatbox when the X button is clicked', () => {
    render(<Chatbot />);
    
    const toggleButtons = screen.getAllByRole('button');
    fireEvent.click(toggleButtons[0]); // Abre o chat
    
    expect(screen.getByText('XTAGE AI')).toBeInTheDocument();
    
    // Encontrar o botão de fechar dentro do modal de chat. Ele é o segundo button no header.
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[1]); // Clica no 'X' que fica no header

    expect(screen.queryByText('XTAGE AI')).not.toBeInTheDocument();
  });
});
