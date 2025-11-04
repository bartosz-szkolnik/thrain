/** @jsx createElement */
import { createElement } from '@thrain/template/index.ts';
import { Tab, Tabs } from '../components/tabs.tsx';

export default function TabPage() {
  const tabData = [
    {
      label: 'Tacos',
      description: <p>Tacos are delicious</p>,
    },
    {
      label: 'Burritos',
      description: <p>Sometimes a burrito is what you really need.</p>,
    },
    {
      label: 'Coconut Korma',
      description: <p>Might be your best option.</p>,
    },
  ];

  return (
    <Tabs>
      {tabData.map(({ label, description }, index) => (
        <Tab name="alpha" label={label} isOpen={index === 0} style={`--n: ${index + 1}`}>
          {description}
        </Tab>
      ))}
    </Tabs>
  );
}
