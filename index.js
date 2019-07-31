class CheckTeamsTopics {
  constructor(robot) {
    this.robot = robot
  }

  async PerformCheck(context) {
    var config = {}
    var defaults = require('./defaults')
    const configRepo = (process.env.CONFIG_REPO_NAME) ? process.env.CONFIG_REPO_NAME : defaults.CONFIG_REPO_NAME
    const configFile = (process.env.CONFIG_FILE_NAME) ? process.env.CONFIG_FILE_NAME : defaults.CONFIG_FILE_NAME

    // Pull Config
    this.robot.log.trace('Loading config')
    this.robot.log.trace(`Org: ${context.payload}`)
    this.robot.log.trace(`Repo: ${configRepo}`)
    this.robot.log.trace(`Config Path: ${configFile}`)
    const res = await context.github.repos.getContents({
      owner: context.payload.organization.login,
      repo: configRepo,
      path: configFile
    }).then(() => {
      const content = Buffer.from(res.data.content, 'base64').toString('utf8')
      const yaml = require('js-yaml')
      this.config = yaml.safeLoad(content)
      this.robot.log.trace(config)
    }).catch(() => {
      this.robot.log(defaults)
      this.config = defaults
    })

    // Assign org and repo variables
    const repository = context.payload.repository.name
    this.robot.log(repository)

    const org = context.payload.repository.owner.login
    this.robot.log(org)

    // Pull teams for new repo
    const teams = await (context.github.repos.listTeams({
      owner: org,
      repo: repository
    }))

    // Check to see if the repository has a default team
    const hasDefaultTeam = (teams.data.length > 0) ? teams.data.find(team => team.slug.toLowerCase() === config.DefaultTeam.toLowerCase()) : false

    // List topics for new repo
    let topics = []
    topics = await (context.github.repos.listTopics({
      owner: org,
      repo: repository,
      mediaType: {
        previews: ['mercy-preview']
      }
    }))

    // Check to see if a default team has been added OR a topic has been added
    // If not, create an issue
    if (!hasDefaultTeam || topics.length === 0) {
      const issueParams = {
        owner: org,
        repo: repository,
        title: this.config.issueTitle,
        body: this.config.issueBody
      }

      const createIssueParams = Object.assign({}, issueParams || {})
      return context.github.issues.create(createIssueParams).catch(error => this.robot.log(error))
    }
  }
}

module.exports = robot => {
  const handler = new CheckTeamsTopics(robot)
  robot.log('Application started')
  robot.on('repository.created', async context => handler.PerformCheck(context))
}
