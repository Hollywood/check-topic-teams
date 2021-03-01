# Enforcing Topics and Teams on a Repository

A GitHub App built with [Probot](https://github.com/probot/probot) that upon new Repository creation will create an issue reminding the repo owner to add the appropriate topics and teams. In the issue, it `/CCs` the instance `Admin` team (`.env` var) to ensure that this is fulfilled. 

Ideas for future:
  - Create a ticket in their help desk system after a period of time (now that `schedule` is an event) if these requirements are not satisfied.
  - Determine how to check to see if a `Topic` pertaining to a valid internal `project` has been added to the repo.
  - Determine if teams that are related to other repos with the same project topic are missing from any particular one. If so, create an issue asking the repo owner if they'd like to add the team.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how check-teams-topics could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Jonathan Cardona <hollywood@github.com>
