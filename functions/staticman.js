const { processEntry } = require("@staticman/netlify-functions");
const queryString = require("querystring");

exports.handler = (event, context, callback) => {
  const repo = process.env.REPO;
  const [username, repository] = repo.split("/");
  const bodyData = queryString.parse(event.body);

  event.queryStringParameters = {
    ...event.queryStringParameters,
    ...bodyData,
    username,
    repository,
  };

  const config = {
    origin: event.headers.origin,
    sites: {
      [repo]: {
        allowedFields: ["name", "email", "url", "message"],
        branch: "master",
        commitMessage: "Add comment to {options.origin} by {fields.name}",
        filename: "comment-{@timestamp}",
        format: "json",
        generatedFields: {
          date: {
            type: "date",
          },
        },
        moderation: true,
        path: "data/comments/{options.entryId}",
        requiredFields: ["name", "message"],
      },
    },
  };

  return processEntry(event, context, callback, config);
};
