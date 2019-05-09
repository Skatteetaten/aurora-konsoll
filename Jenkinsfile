#!/usr/bin/env groovy
def jenkinsfile

def overrides = [
    scriptVersion  : 'feature/AOS-3403-st-tte-npm-ci-for-webleveransepakke-pipeline',
    pipelineScript: 'https://git.aurora.skead.no/scm/ao/aurora-pipeline-scripts.git',
    credentialsId: "github",
    jiraFiksetIKomponentversjon: true,
    chatRoom: "#aos-notifications",
    npmInstallCommand: 'ci',
    nodeVersion: "10",
    versionStrategy: [
        [ branch: 'master', versionHint: '0']
    ]
]

fileLoader.withGit(overrides.pipelineScript, overrides.scriptVersion) {
  jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

jenkinsfile.run(overrides.scriptVersion, overrides)
