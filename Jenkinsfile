pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials') // استبدل بـ ID بيانات الاعتماد الخاصة بك
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                // أوامر البناء الخاصة بك هنا
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // أوامر الاختبار الخاصة بك هنا
                sh 'npm test'
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    docker.build("your-docker-repo/your-image-name:${env.BUILD_NUMBER}")
                }
            }
        }
        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("your-docker-repo/your-image-name:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // أوامر النشر الخاصة بك هنا
                // على سبيل المثال: تشغيل الحاوية الجديدة
                sh 'docker run -d your-docker-repo/your-image-name:${env.BUILD_NUMBER}'
            }
        }
    }
}
