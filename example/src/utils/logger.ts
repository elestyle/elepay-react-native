const TAG = 'Elepay';

type LogLevel = 'D' | 'I' | 'W' | 'E';

function fmt(level: LogLevel, module: string, message: string, data?: unknown): string {
  const now = new Date();
  const time =
    [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, '0'))
      .join(':') +
    '.' +
    String(now.getMilliseconds()).padStart(3, '0');

  const line = `[${TAG}][${level}][${time}][${module}] ${message}`;

  if (data !== undefined) {
    const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return `${line}\n${str}`;
  }
  return line;
}

export const Log = {
  d(module: string, message: string, data?: unknown) {
    console.log(fmt('D', module, message, data));
  },
  i(module: string, message: string, data?: unknown) {
    console.log(fmt('I', module, message, data));
  },
  w(module: string, message: string, data?: unknown) {
    console.warn(fmt('W', module, message, data));
  },
  e(module: string, message: string, data?: unknown) {
    console.error(fmt('E', module, message, data));
  },
};
