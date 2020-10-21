#!/usr/bin/env groovy
def jenkinsfile

def overrides = [
    scriptVersion  : 'feature/SITJ-951-pushe-data-til-sporingslogger',
    pipelineScript: 'https://git.aurora.skead.no/scm/~k94501/aurora-pipeline-scripts.git',
    sporingstjeneste: 'https://sporingslogger-utv.sits.no',
    sporing: true,
    credentialsId: "github",
    jiraFiksetIKomponentversjon: true,
    npmInstallCommand: 'ci',
    iqOrganizationName: "Team AOS",
    nodeVersion: "10",
    versionStrategy: [
        [ branch: 'master', versionHint: '0']
    ]
]

fileLoader.withGit(overrides.pipelineScript, overrides.scriptVersion) {
  jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

jenkinsfile.run(overrides.scriptVersion, overrides)
