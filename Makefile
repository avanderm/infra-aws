IMAGE_NAME=infra-aws
EMAIL=avdmeers@gmail.com

build:
	docker build -t $(IMAGE_NAME) .

cdk-command = cdk $(1) $(2) \
	--profile personal \
	-c email=$(EMAIL)

cdk-command:
	$(call cdk-command,$(COMMAND),$(STACK))

run: build
	docker run \
		-e "CDK_DEPLOY_ACCOUNT=$(CDK_DEPLOY_ACCOUNT)" \
		-e "CDK_DEPLOY_REGION=$(CDK_DEPLOY_REGION)" \
		-e "STACK=$(STACK)" \
		-e "COMMAND=$(COMMAND)" \
		-v $(HOME)/.aws:/root/.aws \
		--rm \
		-it $(IMAGE_NAME) make cdk-command