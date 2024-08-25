module.exports = {
  ...require("@haydenull/fabric/prettier"),
  // docs: https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-function-calls
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['cn', 'clsx'],
}