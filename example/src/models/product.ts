export interface Product {
  emoji: string;
  name: string;
  price: number;
  img: string;
}

function p(emoji: string, name: string, price: number): Product {
  return {
    emoji,
    name,
    price,
    img: `https://dummyimage.com/300x200/336ff0/fff.jpg&text=${name}`,
  };
}

export const ALL_PRODUCTS: Product[] = [
  p('🧿', 'ModaVest', 5),
  p('🧢', 'LuxStyle', 10),
  p('🧤', 'CapThread', 1),
  p('🩱', 'VivaWear', 0.01),
  p('🩲', 'SilkRoad', 6),
  p('🪡', 'EchoFit', 3),
  p('🪢', 'GlamCap', 20),
  p('🩴', 'UrbTrend', 25),
  p('🧺', 'NovaGear', 80),
  p('🎽', 'ZenWard', 30),
  p('🧥', 'CoolStride', 20),
  p('🧣', 'SkyWoven', 5),
  p('🧦', 'EliteWear', 55),
  p('🥼', 'FlowCove', 60),
  p('🥽', 'PureHabit', 20),
  p('🎒', 'CrestVogue', 25),
];
