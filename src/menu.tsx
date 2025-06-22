import React, { useState, useEffect } from "react";
import { Text, Box, useInput } from "ink";

interface MenuItem {
  id: string;
  label: string;
}

interface MenuProps {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  title?: string;
}

const Menu: React.FC<MenuProps> = ({ items, onSelect, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : items.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : 0));
    } else if (key.return) {
      onSelect(items[selectedIndex]);
    }
  });

  useEffect(() => {
    // Reset selected index if items change (e.g., when switching menus)
    setSelectedIndex(0);
  }, [items]);

  return (
    <Box flexDirection="column">
      {title && <Text bold>{title}</Text>}
      {items.map((item, index) => (
        <Text key={item.id}>
          <Text color={index === selectedIndex ? "cyan" : undefined}>
            {index === selectedIndex ? "> " : "  "}
            {item.label}
          </Text>
        </Text>
      ))}
      <Text dimColor>(Usa ↑↓ per navigare, Invio per selezionare)</Text>
    </Box>
  );
};

export default Menu;
