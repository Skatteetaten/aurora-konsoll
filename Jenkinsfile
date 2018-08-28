#!/usr/bin/env groovy

def scriptVersion = 'feature/AOS-2708'
def jenkinsfile
fileLoader.withGit('https://git.aurora.skead.no/scm/ao/aurora-pipeline-scripts.git', scriptVersion) {
   jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

def overrides = [
  publishToNpm: false, 
  deployToNexus: true,
  openShiftBuild: true,
  nodeVersion: 'node-8',
  credentialsId: 'github',
  suggestVersionAndTagReleases: [
      [branch: 'master', versionHint: '0']
  ]
]

jenkinsfile.run(scriptVersion, overrides)
