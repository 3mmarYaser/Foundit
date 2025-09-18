module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: `.env.${process.env.APP_ENV || 'development'}`,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
}
