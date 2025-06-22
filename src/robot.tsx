import { useState } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

interface MenuItem {
  label: string;
  value: string;
}

const items: MenuItem[] = [
  {
    label: 'Opzione 1',
    value: 'option1',
  },
  {
    label: 'Opzione 2',
    value: 'option2',
  },
  {
    label: 'Opzione 3',
    value: 'option3',
  },
];

export default function Robot() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleSelect = (item: MenuItem) => {
    setSelectedItem(item);
    // Qui puoi fare qualcosa con l'elemento selezionato
    console.log(`Hai selezionato: ${item.label} (Valore: ${item.value})`);
    // Se vuoi uscire dall'applicazione dopo la selezione
    process.exit();
  };

  return (
    <Box flexDirection="column">
      <Text>Seleziona un'opzione:</Text>
      <SelectInput items={items} onSelect={handleSelect} />
      {selectedItem && (
        <Text color="green">
          Hai scelto: <Text bold>{selectedItem.label}</Text>
        </Text>
      )}
    </Box>
  );
}