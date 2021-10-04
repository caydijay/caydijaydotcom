const validate = (regex, defaultValue) => {
  return {
    setValueAs: value => value?.trim() ? value : defaultValue,
    validate: value => regex.test(value)
  }
}

export { validate };