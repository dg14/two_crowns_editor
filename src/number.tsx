import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';

interface NumberInputProps {
  onConfirm: (value: number) => void;
  onCancel: () => void;
  prompt: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ onConfirm, onCancel, prompt }) => {
  const [inputValue, setInputValue] = useState('');

  useInput((input, key) => {
    if (key.return) {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onConfirm(numValue);
      }
    } else if (key.backspace || key.delete) {
      setInputValue(prev => prev.slice(0, -1));
    } else if (input >= '0' && input <= '9') {
      setInputValue(prev => prev + input);
    } else if (input === '.') {
        // Permetti solo un punto decimale
        if (!inputValue.includes('.')) {
            setInputValue(prev => prev + input);
        }
    } else if (key.escape) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold>{prompt}</Text>
      <Text>
        <Text color="yellow">{'-> '}</Text>
        <Text>{inputValue}</Text>
        <Text color="gray">_</Text> {/* Cursor effect */}
      </Text>
      <Text dimColor>(Premi Invio per confermare, ESC per annullare)</Text>
    </Box>
  );
};

export default NumberInput;