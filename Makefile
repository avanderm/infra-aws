IMAGE_NAME=infra-aws

build:
	docker build -t $(IMAGE_NAME) .

deploy: build
	docker run \
		-e "CDK_DEPLOY_ACCOUNT=$(CDK_DEPLOY_ACCOUNT)" \
		-e "CDK_DEPLOY_REGION=$(CDK_DEPLOY_REGION)" \
		-e "CDK_ENVIRONMENT=$(CDK_ENVIRONMENT)" \
		-e "NOTIFICATION_EMAIL=$(NOTIFICATION_EMAIL)" \
		-v $(HOME)/.aws:/root/.aws \
		--rm \
		-it $(IMAGE_NAME) make deploy-cdk

build-cdk:
	npm install
	npm run build

deploy-cdk: build-cdk
	cdk deploy \
		--profile personal \
		Budget \
		-c email=$(NOTIFICATION_EMAIL)

delete-cdk:
	cdk destroy \
		--profile personal \
		Budget \
		-c email=