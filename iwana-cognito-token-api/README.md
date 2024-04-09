
# Creation of AWS Profile in Pipeline

You need to create an aws profile with `aws configure --profile iwana-qa` and set up AccessKey and Secret Key,
from within CodePipeline this should not be necessary as it uses service accounts, but from a developers own
laptop this needs to be setup for each environment (`iwana-dev`, `iwana-qa`, `iwana-prod`)

# Delegate Domain to Sub Accounts from Devops Account
This step involves in creating the nameserver for the environment subdomain (ex: qa.api.iwana.ai) IN the qa
account, then go to the devops account and delegate that domain in the `iwana.ai` route53 entries.


# Verify Certificate Creation
After the domain has been delegated to the child account (qa,dev,prod are childs of devops in terms of DNS). 
One needs to create a certificate through certificate manager aws service. This involves adding the TXT or
CNAME record to route53 as part of the DNS Validation process for the certificate, if you fail to delegate the
domain in the step above, this will fail.

# Verify Route53 Routing 

# Serverless Code

The code needs to be environmentilized, this involves changing
```
stage: "dev"
```
```
stage: "${opt:stage, 'dev'}"
```

This allows for CLI overrides from the command line.

Also this needs to change

```
custom:
  stage: "${opt:stage, self:provider.stage}"
```

```
  customDomain:
    domainName: "${self:custom.domains.${self:custom.stage}}"
    stage: "${self:provider.stage}"
```

# Test The commands

- sls create_domain --aws-profile iwana-qa --stage qa
- slsdeploy --stage qa --region us-east-1 --config serverless.yml --aws-profile iwana-qa

