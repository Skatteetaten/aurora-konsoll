#!/usr/bin/env groovy
def jenkinsfile

def overrides = [
    scriptVersion  : 'feature/SITJ-2211-BOMsForIQ',
    pipelineScript: 'https://git.aurora.skead.no/scm/ao/aurora-pipeline-scripts.git',
    credentialsId: "github",
    jiraFiksetIKomponentversjon: true,
    chatRoom: "#aos-notifications",
    npmInstallCommand: 'ci',
    iqOrganizationName: "Team AOS",
    iqEmbedded: true,
    iqBreakOnUnstable: true,
    nodeVersion: "16",
    versionStrategy: [
        [ branch: 'master', versionHint: '1']
    ]
]

fileLoader.withGit(overrides.pipelineScript, overrides.scriptVersion) {
  jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

jenkinsfile.run(overrides.scriptVersion, overrides)
