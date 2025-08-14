pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('my-docker-hub-credentials') // اسم الكريدينشال في Jenkins
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    docker.build("my-docker-repo/my-app:${env.BUILD_NUMBER}")
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'my-docker-hub-credentials') {
                        docker.image("my-docker-repo/my-app:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'docker run -d my-docker-repo/my-app:${env.BUILD_NUMBER}'
            }
        }
    }
}
