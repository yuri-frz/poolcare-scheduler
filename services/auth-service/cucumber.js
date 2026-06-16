module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["tests/bdd/**/*.steps.ts"],
    paths: ["tests/bdd/**/*.feature"]
  }
};
