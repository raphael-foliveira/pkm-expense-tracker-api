export const factoryMultiplier = <T>(factory: () => T, quantity: number) => {
  const result = [];
  for (let i = 0; i < quantity; i++) {
    result.push(factory());
  }
  return result;
};
