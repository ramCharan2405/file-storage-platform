
const BYTE_UNITS=1024;

export  function formatBytes(bytes: number, decimals = 2): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i=0;
  while (bytes>=BYTE_UNITS && i<units.length-1) {
    bytes/=BYTE_UNITS;
    i++;
  }
  const value=new Intl.NumberFormat(undefined,{maximumFractionDigits:2}).format(bytes);
  return `${value} ${units[i]}`;
}