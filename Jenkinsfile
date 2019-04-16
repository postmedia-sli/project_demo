@Library('postmedia-jenkins-shared') _

pipeline {
  agent none

  parameters {
    choice(
      name: 'PACKAGE_ARTIFACT_TYPE',
      choices: ['None','SNAPSHOT','RELEASE'],
      description: '''
      Choose None if you don't want to create Artifact.
      Choose SNAPSHOT 📦🔗 type of artifact if you want to deploy only in Dev environment and not ready for preparing a Release Candidate or Hotfix.
      Choose RELEASE 📦🔖 type of artifact if you are ready to create Release Candidate or Hotfix.
      '''
    )
    choice(
      name: 'PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE',
      choices: ['None','MINOR', 'PATCH', 'MAJOR'],
      description: '''
      Choose MAJOR or MINOR or PATCH only if RELEASE 📦🔖 artifact type selected.
      MAJOR and MINOR versions are reserved for planned releases.
      PATCH version is reserved for hotfix releases.
      '''
    )
  }

  environment {
    CI = 'true'
    GIT_MAIN_PROTECTED_BRANCH = "master"
    GIT_REPO_NAME = "postmedia-frontend-modules"
    RELEASE_CANDIDATE_BRANCH_PREFIX_PATTERN = "release_candidate_[0-9]+\\.[0-9]+\\.[0-9]+"
    HOTFIX_BRANCH_PREFIX_PATTERN = "hotfix_[0-9]+\\.[0-9]+\\.[0-9]+"
    SNAPSHOT_AWS_S3_BUCKET_NAME = "pmd-prod-frontend-modules"
    RELEASE_AWS_S3_BUCKET_NAME = "pmd-prod-frontend-modules"
    AWS_S3_BUCKET_REGION = "ca-central-1"
    ASSETS_BUILD_DIRECTORY_PATH = "dist"
  }

  tools {
    nodejs 'v10.15.2'
  }

  options {
    disableConcurrentBuilds()
    timeout(time: 14, unit: 'DAYS')
  }

  stages {

    stage('Init') {
      agent any
      steps {
        script {
          initCiPipelineJob()
        }
      }
    }

    stage('Approve Release Artifact') {
      when {
        environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'RELEASE'
      }
      steps {
        script {
          approveReleaseArtifact()
        }
      }
    }

    stage('Checkout Source') {
      agent any
      stages {

        stage('Install Dependencies') {
          steps {
            sh '''
            node --version
            npm --version
            npm ci
            '''
          }
        }

        stage('Static Code Analysis') {
          steps {
            sh 'npm run lint:ci'
          }
          post {
            always {
              recordIssues enabledForFailure: true, tool: tsLint(pattern: '**/build/reports/lint/tslint.xml')
            }
          }
        }

        stage('Unit Test') {
          steps {
            sh 'npm run test:ci'
          }
          post {
            always {
              junit '**/junit.xml'
            }
            success {
              script {
                publishUnitTestCoverageHtmlReport()
                publishUnitTestCoverageCoberturaReports()
              }
            }
          }
        }

        stage('Tag with Release Version') {
          when {
            environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'RELEASE'
          }
          steps {
            script {
              updatePackageJsonWithNewReleaseVersion(env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE)
              // TODO: For now, disable it until it's ready
              // updateChangelogFileWithReleaseVersion(env.PACKAGE_ARTIFACT_RELEASE_VERSION)
              if(env.JENKINS_SERVER_ENV != "local") {
                gitCommitAndTag(env.GIT_REPO_NAME)
              } else {
                echo "Creating Git commit and Tag from Local Jenkins VM is not allowed."
              }
            }
          }
        }

        stage('Build Artifact') {
          when {
            anyOf {
              environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'SNAPSHOT'
              environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'RELEASE'
            }
          }
          steps {
            script {
              buildArtifact()
            }
          }
        }

        stage('Publishing artifact') {
          when {
            anyOf {
              environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'SNAPSHOT'
              environment name: 'PACKAGE_ARTIFACT_TYPE', value: 'RELEASE'
            }
          }
          steps {
            script {
              createPackageArtifactVersion()
              setS3BucketName()
              publishArtifact(env.ASSETS_BUILD_DIRECTORY_PATH)
            }
          }
        }

      }
    }

  }

  post {
    always {
      echo 'always run'
      script {
        node {
          cleanWs()
        }
      }
    }
    failure {
      echo 'failure run'
      slackSend(message: "*`${env.JOB_NAME}`*\n💥 _*Build status: Failure*_\n${env.BUILD_URL}", color: "danger", channel: "#jenkins-notifications")
    }
    success {
      echo 'success run'
      slackSend(message: "*`${env.JOB_NAME}`*\n🎉 _*Build status: Success*_\n${env.BUILD_URL}", color: "good", channel: "#jenkins-notifications")
    }
  }

}

def isReleaseCandidateBranchPrefix(currentBranch) {
  def releaseCandidateBranchPrefixPattern = env.RELEASE_CANDIDATE_BRANCH_PREFIX_PATTERN
  currentBranch ==~ ~/${releaseCandidateBranchPrefixPattern}/
}

def isHotfixBranchPrefix(currentBranch) {
  def hotfixBranchPrefixPattern = env.HOTFIX_BRANCH_PREFIX_PATTERN
  currentBranch ==~ ~/${hotfixBranchPrefixPattern}/
}

def branchNameValidation() {
  if (!isReleaseCandidateBranchPrefix(env.GIT_BRANCH) && env.PACKAGE_ARTIFACT_TYPE == 'RELEASE' && env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE != 'PATCH') {
    error("⚠️ Release Candidate Branch name should be in this pattern: `${env.RELEASE_CANDIDATE_BRANCH_PREFIX_PATTERN}`. Current branch name: ${env.GIT_BRANCH}")
  }
  if (!isHotfixBranchPrefix(env.GIT_BRANCH) && env.PACKAGE_ARTIFACT_TYPE == 'RELEASE' && env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE == 'PATCH') {
    error("⚠️ Hotfix Branch name should be in this pattern: `${env.HOTFIX_BRANCH_PREFIX_PATTERN}`. Current branch name: ${env.GIT_BRANCH}")
  }
  echo "env.CHANGE_TARGET: ${env.CHANGE_TARGET}"
  echo "env.CHANGE_BRANCH: ${env.CHANGE_BRANCH}"
  if (env.CHANGE_TARGET == env.GIT_MAIN_PROTECTED_BRANCH && (!isReleaseCandidateBranchPrefix(env.CHANGE_BRANCH) || !isHotfixBranchPrefix(env.CHANGE_BRANCH))) {
    error("⚠️ Pull Requests are only allowed from Release Candidate or Hotfix branch for the ${env.GIT_MAIN_PROTECTED_BRANCH} branch. Please change the current Pull Request ${env.GIT_BRANCH}'s target branch at ${env.CHANGE_URL} ")
  }
}

def validate() {
  env.PACKAGE_ARTIFACT_TYPE = params.PACKAGE_ARTIFACT_TYPE
  env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE = params.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE
  if (env.GIT_MAIN_PROTECTED_BRANCH == env.GIT_BRANCH && env.PACKAGE_ARTIFACT_TYPE == 'RELEASE') {
    error("⚠️ Creating Release Artifact From ${env.GIT_MAIN_PROTECTED_BRANCH} is not allowed. Please create Release Artifact from either Release Candidate or Hotfix branch.")
  }
  if (env.PACKAGE_ARTIFACT_TYPE == 'RELEASE' && env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE == 'None') {
    error('⚠️ Please choose one of Release Version Types: PATCH, MINOR, MAJOR')
  }

  branchNameValidation()

  if (env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE == 'None') {
    env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE = ''
  }
}

def resetDefaultParametersIfCommittedByJenkins() {
  // To make sure no artifact is created from a git commit from Jenkins
  env.IS_LAST_COMMIT_BY_JENKINS = isLastCommitByJenkins()
  if (env.IS_LAST_COMMIT_BY_JENKINS == 'YES') {
    env.PACKAGE_ARTIFACT_TYPE = ''
    env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE = ''
  }
}

def validateCiPipelineJobParameters() {
  validate()
  resetDefaultParametersIfCommittedByJenkins()

  echo "PACKAGE_ARTIFACT_TYPE: ${env.PACKAGE_ARTIFACT_TYPE}"
  echo "PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE: ${env.PACKAGE_ARTIFACT_RELEASE_VERSION_TYPE}"
}

def initCiPipelineJob() {
  validateCiPipelineJobParameters()
  setEnvironmentVariablesFromDefaultJenkinsEnvVariables()
  setEnvironmentVariablesFromBuildUserPlugin()
  validateReleaseArtifactIfMasterBranch()
}

def approveReleaseArtifact() {
  def inputData = input message: 'Are you sure want to create Release artifact?',
  parameters: [
    choice(
      choices: 'NO\nYES',
      description: 'It is recommended to make Release Artifact 📦🔖 from Release Candidate or Hot fix branch by authorized person',
      name: 'PACKAGE_ARTIFACT_IS_APPROVED_RELEASE'
    )
  ]
  env.PACKAGE_ARTIFACT_IS_APPROVED_RELEASE = inputData

  if (env.PACKAGE_ARTIFACT_IS_APPROVED_RELEASE == 'NO') {
    currentBuild.result = 'ABORTED'
    error('⚠️ Release Artifact creation process is aborted')
  }

  echo "PACKAGE_ARTIFACT_IS_APPROVED_RELEASE: ${env.PACKAGE_ARTIFACT_IS_APPROVED_RELEASE}"
  echo "PACKAGE_ARTIFACT_TYPE: ${env.PACKAGE_ARTIFACT_TYPE}"
}

def setS3BucketName() {
  // SNAPSHOT_AWS_S3_BUCKET_NAME & RELEASE_AWS_S3_BUCKET_NAME should be injected via jenkinsfile-config.json by ConfigFileProvider Plugin
  if (env.PACKAGE_ARTIFACT_TYPE == 'RELEASE') {
    env.AWS_S3_BUCKET_NAME = env.RELEASE_AWS_S3_BUCKET_NAME
  } else {
    env.AWS_S3_BUCKET_NAME = env.SNAPSHOT_AWS_S3_BUCKET_NAME
  }
  echo "env.RELEASE_AWS_S3_BUCKET_NAME: ${env.RELEASE_AWS_S3_BUCKET_NAME}"
  echo "env.SNAPSHOT_AWS_S3_BUCKET_NAME: ${env.SNAPSHOT_AWS_S3_BUCKET_NAME}"
  echo "env.AWS_S3_BUCKET_NAME: ${env.AWS_S3_BUCKET_NAME}"
}

def buildArtifact() {
  sh 'npm run build'
  archiveArtifacts artifacts: "${env.ASSETS_BUILD_DIRECTORY_PATH}/**"
}

def publishArtifact(targetFileOrDirectory) {
  def s3BucketKey = env.PACKAGE_ARTIFACT_TYPE == 'RELEASE' ? "releases/${env.PACKAGE_ARTIFACT_VERSION}" : "snapshots/${env.PACKAGE_ARTIFACT_VERSION}"
  withAWS(region: env.AWS_S3_BUCKET_REGION, credentials: env.AWS_ECS_DEPLOYMENT_JENKINS_CREDENTIALS_ID) {
    if(env.JENKINS_SERVER_ENV != "local") {
      sh """
      aws s3 cp ${targetFileOrDirectory} s3://${env.AWS_S3_BUCKET_NAME}/${s3BucketKey} --recursive --acl public-read
      """
    } else {
      echo "Publishing Artifact from Local Jenkins VM is not allowed."
    }
  }
}

def publishUnitTestCoverageHtmlReport() {
  publishHTML target: [
    allowMissing:true,
    alwaysLinkToLastBuild: false,
    keepAll:true,
    reportDir: "./build/reports/unit-test/coverage/lcov-report",
    reportFiles: 'index.html',
    reportName: "Coverage HTML report"
  ]
}

def publishUnitTestCoverageCoberturaReports() {
  cobertura autoUpdateHealth: false,
    autoUpdateStability: false,
    coberturaReportFile: '**/build/reports/unit-test/coverage/cobertura-coverage.xml',
    conditionalCoverageTargets: '70, 0, 0',
    failUnhealthy: false,
    failUnstable: false,
    lineCoverageTargets: '80, 0, 0',
    maxNumberOfBuilds: 0,
    methodCoverageTargets: '80, 0, 0',
    onlyStable: false,
    sourceEncoding: 'ASCII',
    zoomCoverageChart: false
}
