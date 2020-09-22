const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
  return knex("users")
    .truncate()
    .then(function () {
      return knex("users").insert([
        {
          id: 1,
          username: "test1",
          password:
            "$2a$08$iyhWJQNxE8IPeP9u.a/UYeVL.mxigsKy/5.YIe.daDxrjjXw5niR.",
          phoneNumber: "867-5309",
        }, //LEL
        {
          id: 2,
          username: "test2",
          password:
            "$2a$08$iyhWJQNxE8IPeP9u.a/UYeVL.mxigsKy/5.YIe.daDxrjjXw5niR.",
          phoneNumber: "605-475-6961",
        },
        {
          id: 3,
          username: "test3",
          password:
            "$2a$08$iyhWJQNxE8IPeP9u.a/UYeVL.mxigsKy/5.YIe.daDxrjjXw5niR.",
          phoneNumber: "420-420-420",
        },
        {
          id: 4,
          username: "test4",
          password: bcrypt.hashSync("valid_password"),
          phoneNumber: "345-567-789",
        },
      ]);
    });
};
