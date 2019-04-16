""" This task file is for creating both developer SNAPSHOTS and Jenkins built
artifacts.
"""
import os
import re
import json
import datetime
import glob
import yaml
import requests
import svn
from svn import remote # this really is used despite pylint saying it's not
from invoke import task, run

WORK_DIR = './tmp'
GIT_CREDS = os.getenv('GIT_CREDS', 'nouser:nopass')
#GIT_ORG = "Postmedia-Digital"
#GIT_REPO = "postmedia-frontend-modules"

GIT_ORG = "postmedia-sli"
GIT_REPO = "project_demo"


POSTMEDIA_REPO = 'github.com/{}/{}.git'.format(GIT_ORG, GIT_REPO)

SNAPSHOT_AWS_S3_BUCKET_NAME = "pmd-prod-frontend-modules"
RELEASE_AWS_S3_BUCKET_NAME = "pmd-prod-frontend-modules"
S3_BUCKET_STAGE = 'postmediadigital-stage-artifacts/postmedia-frontend-modules'
S3_BUCKET_DEV = 'pm-frontend-modules-snapshot/postmedia-frontend-modules'

#INFRA_REPO = '{}/postmedia-infrastructure'.format(GIT_ORG)
#PHPCS_SEVERITY_LEVEL = 3

#GITHUB_RAW_URL = 'raw.githubusercontent.com/'

class GitReleases():
    """ class to query releases in a github repository with functions to get all,
    latest, and set future releases."""

    def __init__(self, org, repo):
        self.org = org
        self.repo = repo
        self.credentials = {
            'username': GIT_CREDS.split(':')[0],
            'token': GIT_CREDS.split(':')[1]
        }

    def get_credentials(self):
        """ returns the github api token passed from the GIT_CREDS variable """
        return self.credentials

    def get(self, endpoint, params=None):
        """ returns info about the requested endpoint from github """
        res = requests.get("https://api.github.com/" + endpoint,
                           auth=requests.auth.HTTPBasicAuth(self.credentials['username'], self.credentials['token']),
                           params=params)
        return res.json()

    def post(self, endpoint, json=None):
        """ posts content to a github endpoint """
        res = requests.post("https://api.github.com/" + endpoint,
                            auth=requests.auth.HTTPBasicAuth(self.credentials['username'], self.credentials['token']),
                            json=json
                            )
        return res

    def put(self, endpoint, params=None):
        """ puts content to a github endpoint """
        res = requests.put("https://api.github.com/" + endpoint,
                           auth=requests.auth.HTTPBasicAuth(self.credentials['username'], self.credentials['token']),
                           params=params
                           )
        return res

    def get_releases(self):
        return self.get("repos/{org}/{repo}/releases".format(**self.__dict__))

    def get_latest_release(self):
        latest_release = self.get("repos/{org}/{repo}/releases/latest".format(**self.__dict__))
        return latest_release

    def set_release(self, target_commitish, tag, description="created by API", draft=False, prerelease=False):
        payload = {
            "tag_name": tag,
            "target_commitish": target_commitish,
            "name": tag,
            "body": description,
            "draft": draft,
            "prerelease": prerelease
        }

        res = self.post("repos/{org}/{repo}/releases".format(**self.__dict__), json=payload)
        return True if res.status_code == 201 else False

    def tag_exists(self, tag):
        for r in self.get_releases():
            if tag in r.get("name"):
                return True
        return False

    def get_next_rc(self):
        latest_release = self.get_latest_release()
        m = re.findall(r"(\d+)\.(\d+)", latest_release.get("name"))
        major = int(m[0][0])
        minor = 0

        step = 0
        while True:
            tag = "{}.{}".format(major + 1, minor + step)
            if not self.tag_exists(tag):
                break
            else:
                step += 1

        return "rc-" + tag

    def get_next_hf(self):
        latest_release = self.get_latest_release()
        m = re.findall(r"(\d+)\.(\d+)", latest_release.get("name"))
        major = int(m[0][0])
        minor = int(m[0][1])

        step = 1
        while True:
            tag = "{}.{}".format(major, minor + step)
            if not self.tag_exists(tag):
                break
            else:
                step += 1

        return "hf-" + tag

    def do_release(self, tag):
        releases = self.get_releases()
        for release in releases:
            if tag in release.get("name") and release.get("prerelease"):
                endpoint = "repos/{org}/{repo}/releases/".format(**self.__dict__) + str(release.get("id"))
                res = self.post(endpoint, json={'prerelease': False})
                # print(endpoint)
                # print("{} {}".format(res.status_code, res.text))
                if res.status_code == 200:
                    return True
        return False

github_util = GitReleases(GIT_ORG, GIT_REPO)

@task
def help(ctx):
    """ ask for help and ye shall receive """
    print(""" Usage invoke <task>
Tasks:
    build:
        build an artifact. NOTE - do not put spaces in the author name
    release:
        mark a Release Candidate or a Hotfix as released to production
        usage: invoke release <release name>
          """)


@task
def build(ctx):
    """ core task to create artifacts and SNAPSHOTS.
        If there is no GIT_SOURCE_BRANCH then the build is a hotfix by default.
        Otherwise it is a release candidate. Both types have tags created for them
        automatically based on the current production (latest release in github) tag.
    """
    if 'cicd' in run('hostname').stdout.strip():
        # Check if we are executing the task from an aws instance
        if requests.get('http://169.254.169.254/latest/meta-data/').status_code == 200:
            git_ref_source = os.environ.get('GIT_SOURCE_BRANCH')
            git_ref_target = os.environ.get('GIT_TARGET_BRANCH')
            run('git fetch --all')
            run('git checkout {}'.format(git_ref_target))

            
            tar_name = "???"
            #'wordpress-{}-en_CA.tar.gz'.format(WORDPRESS_VERSION)
            tar_file = open(tar_name, 'wb')
            tar_file.write(wp_tar.content)
            tar_file.close()
            run('tar -xzf {}'.format(tar_name))
            
            # Download the postmedia source-code and patches/config
            clone(git_ref_target, git_ref_source)

            # merge (if applicable) and create the release
            if git_ref_source:
                git_pr_id = os.getenv('GIT_PR_ID')
                github_util.put('repos/{}/{}/pulls/{}/merge'.format(GIT_ORG, GIT_REPO, git_pr_id), params={'merge_method': 'squash'})
                version = github_util.get_next_rc()
                github_util.set_release(target_commitish='master', tag=version, prerelease=True)
                build_type = 'release candidate'
            else:
                version = github_util.get_next_hf()
                github_util.set_release(git_ref_target, version)
                build_type = 'hotfix'

            # package and upload to S3
            author = os.environ.get('GIT_AUTHOR')
            notes = release_notes(version, author, git_ref_target, git_ref_source, build_type)
            tarball = package(notes, version)
            print "No upload to S3"
            //upload(tarball, S3_BUCKET_STAGE)
    else:
        author = input('please enter your name for the release notes: ')

        valid_snapshot_name = False
        while not valid_snapshot_name:
            snapshot_name = input('please enter a name for your snapshot: ')
            snapshot_name = snapshot_name.lower()
            snapshot_name = re.sub('-', '_', snapshot_name)

            # domain sections cannot be longer than 63 characters, so snapshot
            # name cannot be longer than 26 (63 minus snapshot-20190128-1713-homesanddesign - 37)
            if (len(snapshot_name) <= 26):
                valid_snapshot_name = True
            else:
                print("{} is too long.  Please enter a new snapshot name of 28 characters or less.".format(snapshot_name))

        build_type = 'snapshot'
       
        version = '{}_{}_{}'.format(build_type, snapshot_name,
                                    datetime.datetime.now().strftime("%Y%m%d_%H%M"))
        print("Building snapshot {}".format(version))
        git_ref_target = 'master'
        git_ref_source = 'HEAD'
        notes = release_notes(version, author, git_ref_target, git_ref_source, build_type)
        os.chdir('/opt/')
        if os.path.exists(WORK_DIR):
            os.system('rm -rf {}'.format(WORK_DIR))
        os.mkdir(WORK_DIR)
        tarball = package(notes, version)
        print "No upload to S3"
        //upload(tarball, S3_BUCKET_DEV)


@task
def release(ctx, target):
    if github_util.do_release(target):
        print("{} successfully marked as released".format(target))
    else:
        print("no prerelease found matching {}".format(target))


def clone(git_ref_target, git_ref_source=None):
    """ subtask of build called when creating artifacts via jenkins that clones
    all the required repositories """
    print('Cloning {}'.format(POSTMEDIA_REPO))
    run('git clone https://{}@{} {}/themes'.format(GIT_CREDS,
                                                   POSTMEDIA_REPO,
                                                   CLONE_DIR))
    base_dir = os.getcwd()
    os.chdir('{}/themes'.format(CLONE_DIR))
    run('git fetch')
    print('Checking out {}'.format(git_ref_target))
    run('git checkout {}'.format(git_ref_target))
    if git_ref_source:
        print('Merging {}'.format(git_ref_source))
        run('git pull --no-ff origin {}'.format(git_ref_source))
    if not git_ref_source:
        verify_tags(git_ref_target)
    os.chdir(base_dir)
    #What do we need here?

def verify_tags(git_ref_target):
    """ verify that a branch contains only the desired tags """
    latest_release = github_util.get_latest_release().get('name')
    latest_commit = run('git rev-list -n 1 {}'.format(latest_release)).stdout.rstrip("\r\n")
    if not branch_check(latest_release, git_ref_target):
        print('Your branch does not contain the latest production code. \n\
              Please recreate it by branching off of release {}.'.format(latest_release))
        exit(1)
    else:
        print("Branch contains the latest production tag")
    fork_point = run('git merge-base remotes/origin/master remotes/origin/{}'.format(git_ref_target))
    commits_since_fork = run('git rev-list --branches={} {}^..HEAD'.format(git_ref_target,
                                                                           fork_point.stdout.rstrip("\r\n")))
    if latest_commit not in commits_since_fork.stdout:
        print('Your branch did not fork directly from the last production tag. \n\
              Please recreate it by branching off of release {}.'.format(latest_release))
        exit(1)
    else:
        print('Latest production tag is between the fork point and HEAD')

def branch_check(tag, branch):
    commit = run('git rev-list -n 1 {}'.format(tag))
    branches = run('git branch --contains {}'.format(commit.stdout))
    if branch in branches.stdout:
        return True

def search_replace(filename, search, replace):
    """ generic search and replace function to mimic sed """
    with open(filename, 'r') as f:
        filedata = f.read()
        modified_data = re.sub(search, replace, filedata, flags=re.M)
    with open(filename, 'w') as f:
        f.write(modified_data)

def release_notes(version, author, git_ref_target, git_ref_source, build_type):
    """ generates the release notes based on the gitlog of the difference
    between the source and target branches """
    print('generating release notes')
    if git_ref_source:
        if git_ref_source != 'HEAD':
            git_ref_source = 'origin/{}'.format(git_ref_source)
        changelog = run('git log origin/{}..{}'.format(git_ref_target,
                                                       git_ref_source))
    else:
        git_ref_source = 'origin/master'
        changelog = run('git log {}..origin/{}'.format(git_ref_source, git_ref_target))
    notes = {
        'version': version,
        'author': author,
        'build_type': build_type,
        'date': datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
        'changelog': changelog.stdout
    }
    return notes

def upload(filename, bucket):
    """ pushes the tarball created in the package function to S3 """
    print("Uploading {} to S3".format(filename.lower().replace('_', '-')))
    url = "https://s3.ca-central-1.amazonaws.com/{}/{}".format(bucket,
                                                               filename.lower().replace('_', '-'))
    with open('{}/{}'.format(WORK_DIR, filename), 'rb') as data:
        requests.put(url, data=data)
