module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        browserslist: [
          "> 0.25%",
          "not dead",
        ]
      },
    ],
  ],
};
