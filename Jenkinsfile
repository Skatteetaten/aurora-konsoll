#!/usr/bin/env groovy

def scriptVersion = 'v5'
def jenkinsfile
fileLoader.withGit('https://git.aurora.skead.no/scm/ao/aurora-pipeline-scripts.git', scriptVersion) {
   jenkinsfile = fileLoader.load('templates/webleveransepakke')
}

def overrides = [
  publishToNpm: false, 
  deployToNexus: false,
  openShiftBuild: true,
  nodeVersion: 'node-8',
  suggestVersionAndTagReleases: [
      [branch: 'master', versionHint: '0']
  ]
]

jenkinsfile.run(scriptVersion, overrides)
