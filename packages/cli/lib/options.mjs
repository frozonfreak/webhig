export function parseOptions(argv, values = [], booleans = []) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (booleans.includes(flag)) options[flag.slice(2)] = true;
    else if (values.includes(flag)) {
      const value = argv[++i];
      if (!value || value.startsWith('-')) throw new Error(`${flag} requires a value.`);
      options[flag.slice(2)] = value;
    } else throw new Error(`Unknown option: ${flag}`);
  }
  return options;
}
