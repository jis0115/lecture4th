const generate = (length = 12) => {
  return (Math.random()).toString('16')
    .substr(2, length)
}

export {
  generate
}