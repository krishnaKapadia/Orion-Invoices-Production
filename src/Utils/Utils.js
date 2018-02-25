// Formatting helpers

/*
*    Converts the given number to a string in the form $x.xx.
*    Ensures that even if a string is passed in, it will be treated as an int
*    x, number to format
*    returns a string
*/
export function formatToPrice(x) {

  return `$${Number(x).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`
}
