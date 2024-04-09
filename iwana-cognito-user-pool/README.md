
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
- slsdeploy --stage qa --region us-east-1 --config serverless.yml --aws-profile iwana


# Deploy
sls deploy --stage dev --region us-east-1 --aws-profile iwana

# Cognito

Example:
1.
aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --auth-parameters "USERNAME=<email>,PASSWORD=<first-password>." --client-id <client-id> --query "Session" --profile <nombre-profile> --region us-east-1
OUTPUT:
(Generates a TOKEN)
2.
aws cognito-idp admin-respond-to-auth-challenge --region us-east-1 --user-pool-id <userpool-id> --client-id <id-client> --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses "NEW_PASSWORD=<nuevo-password>,USERNAME=<email>" --session <token-output-step-1> --query "AuthenticationResult.IdToken" --profile <nombre-profile> --region us-east-1
OUTPUT:
(Generates a TOKEN)

3.
aws cognito-idp initiate-auth --profile iwana-qa --auth-flow USER_PASSWORD_AUTH --auth-parameters "USERNAME=<email>,PASSWORD=<new-password>" --client-id <id-client>  --query "AuthenticationResult.IdToken" --region us-east-1

OUTPUT:
(Generates a TOKEN)


(1)
aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --auth-parameters "USERNAME=rlarenas@wingsoft.com,PASSWORD=Chile2022$" --client-id 3muuupj1u2avchn89fotri0lh2 --query "Session" --profile iwana --region us-east-1
OUTPUT:
(Generates a TOKEN)

"AYABeB4Lc7ogYImWAr_qa6W6PGEAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHiG0oCCDoro3IaeecGyxCZJOVZkUqttbPnF4J7Ar-5byAGI-GHyl3--0JM-x2Ayhhm0AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMsaIM9tAKRxsTIbNMAgEQgDs1mNtao_YJnfFvb1biEr_PYm48p8j6hiUZQ1obdOagxj1wxfT1wUIcZ_vwnd_pjqj0a7b7nbd0AwK0tQIAAAAADAAAEAAAAAAAAAAAAAAAAACVN6fEbEkwXfdCqVSaxZNT_____wAAAAEAAAAAAAAAAAAAAAEAAADV8cllrnKezoZLgs2bTdlvk8N9zMOKekp7txA3qR4mI2eEe8xeAI7_QLqN2ke7-qCypV0MbjUQUmmpGA_6eP97BqsdX11mDSV901vgEUtM9olZk6tKwILpl0YhMSc3TG7Oasrpzd-Pigh9DZAWuh39HFyo3Iud-uqyFwsk0NysawHCW7NB5sMJOGTISd1VN82vUnWivZ_ja9JWkmpS6qDBZCnwyKOqVrsq0qeYwUfgDYlrVVQhLfsOVHzaRFTW1RkfJyJ-hpOSOp2hnwRZcxbvbmblToilt5ONRM9ZI8MT8eiV2XNVWw"

(2)
aws cognito-idp admin-respond-to-auth-challenge --region us-east-1 --user-pool-id us-east-1_trqwl4JJm --client-id 3muuupj1u2avchn89fotri0lh2 --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses "NEW_PASSWORD=RedChile2020$,USERNAME=rlarenas@wingsoft.com" --session AYABeB4Lc7ogYImWAr_qa6W6PGEAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHiG0oCCDoro3IaeecGyxCZJOVZkUqttbPnF4J7Ar-5byAGI-GHyl3--0JM-x2Ayhhm0AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMsaIM9tAKRxsTIbNMAgEQgDs1mNtao_YJnfFvb1biEr_PYm48p8j6hiUZQ1obdOagxj1wxfT1wUIcZ_vwnd_pjqj0a7b7nbd0AwK0tQIAAAAADAAAEAAAAAAAAAAAAAAAAACVN6fEbEkwXfdCqVSaxZNT_____wAAAAEAAAAAAAAAAAAAAAEAAADV8cllrnKezoZLgs2bTdlvk8N9zMOKekp7txA3qR4mI2eEe8xeAI7_QLqN2ke7-qCypV0MbjUQUmmpGA_6eP97BqsdX11mDSV901vgEUtM9olZk6tKwILpl0YhMSc3TG7Oasrpzd-Pigh9DZAWuh39HFyo3Iud-uqyFwsk0NysawHCW7NB5sMJOGTISd1VN82vUnWivZ_ja9JWkmpS6qDBZCnwyKOqVrsq0qeYwUfgDYlrVVQhLfsOVHzaRFTW1RkfJyJ-hpOSOp2hnwRZcxbvbmblToilt5ONRM9ZI8MT8eiV2XNVWw --query "AuthenticationResult.IdToken" --profile iwana --region us-east-1

op:
"eyJraWQiOiJaUmJoU1BOWnU4VDBhNlNpSlBSOXc4VlBoTk43QmdXYUdLRlVXQVdLYmlzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNDAxZmU3Ny1kZGViLTQ0ZjQtYTg3Mi00ZmI1ODU1NzA2ZjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfdHJxd2w0SkptIiwiY29nbml0bzp1c2VybmFtZSI6ImY0MDFmZTc3LWRkZWItNDRmNC1hODcyLTRmYjU4NTU3MDZmMCIsIm9yaWdpbl9qdGkiOiJiNmM5NjUzZi01OWYyLTQwMzItOTE0Yi0xZDdhY2VmMTY3NDgiLCJhdWQiOiIzbXV1dXBqMXUyYXZjaG44OWZvdHJpMGxoMiIsImV2ZW50X2lkIjoiNDRlNTgxYWYtZTIwMC00ZTJhLWI0NjEtZDkyZmVjYmY1ZGMxIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjYxOTQ5ODQsImV4cCI6MTY2NjE5ODU4NCwiaWF0IjoxNjY2MTk0OTg0LCJqdGkiOiI5NGNiZTdlOS1jOTRkLTQ1YzAtYWE5ZS00OTM3ZDg5ZmQyYmUiLCJlbWFpbCI6InJsYXJlbmFzQHdpbmdzb2Z0LmNvbSJ9.MBKj3BssxWPsctx70jNsRWi8IvBIMSdLdrnd404yQ-3IBBwVEB6HFxn-O_5UKDKdzrhUUf7BJX4qgJDSR8g6vpDVJvAinVRxWug2h9LycJ8zUiXZQLZOdqEqKyBuAr4vyrpJIWWixPEBSRv2UVDE6zbxOjM0AlWBCKp4ctKULXGNGVC4GmyKuBtQ_R8LkUud040mzp3FytTz84m7uin2e4NWKwZvHDjxPz-QYy3ETDABoAimUB-qUtameLC-lcnLQweBjZ0sbJaj4d-2lI3q3TteQs2nVmqtrxwJGJJGUPIa3ll0RbDr1E-2pMIlk8RXeCb2sgr1uBp8egsiG4bbMg"

(3)
aws cognito-idp initiate-auth --profile iwana --auth-flow USER_PASSWORD_AUTH --auth-parameters "USERNAME=rlarenas@wingsoft.com,PASSWORD=RedChile2020$" --client-id 3muuupj1u2avchn89fotri0lh2  --query "AuthenticationResult.IdToken" --region us-east-1


op
"eyJraWQiOiJaUmJoU1BOWnU4VDBhNlNpSlBSOXc4VlBoTk43QmdXYUdLRlVXQVdLYmlzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNDAxZmU3Ny1kZGViLTQ0ZjQtYTg3Mi00ZmI1ODU1NzA2ZjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfdHJxd2w0SkptIiwiY29nbml0bzp1c2VybmFtZSI6ImY0MDFmZTc3LWRkZWItNDRmNC1hODcyLTRmYjU4NTU3MDZmMCIsIm9yaWdpbl9qdGkiOiIyZDRmZmI0ZC02OTBlLTQ1OTMtOWQ3ZC0wMGZkMzRjZGZmNzIiLCJhdWQiOiIzbXV1dXBqMXUyYXZjaG44OWZvdHJpMGxoMiIsImV2ZW50X2lkIjoiZDQxOTQzOGUtOTA4Ny00NjRlLTgxYzQtYTkzNzE2OWQzNDk1IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjYxOTUxMDQsImV4cCI6MTY2NjE5ODcwNCwiaWF0IjoxNjY2MTk1MTA0LCJqdGkiOiJmMDhmZmQ5Yy1iODNjLTRhZmMtODNkNy05MjI4Y2ExZDcyOWMiLCJlbWFpbCI6InJsYXJlbmFzQHdpbmdzb2Z0LmNvbSJ9.eBsxm-g6qZBxc7BorgH_if2yKmrO-GaEd_Y0Yge9t24KnlHslQjyuVb0fZs7pgrhuyWFq0imw9egbeVxnevGbHJJZOn1E_3_zfI0QFJ7pJysRHZxnE0wFT4ndNxjKNBSIa1-axrL7Vwq9NRT9yAg-Ygz40oeVCXNnBy6KU3zhhB0TVX1odvcShIqXtC5dDvUBb5qG-ltbUdOglHOlhZjAYpYAszICEci72krzMvQEfuuJj4ZPEPtITFH-fKo1rwGq85b3CodWrhJORYEA4JBHspNbOIKIXQSJ8Em98ox7Lhu6a9lX9-qBL75zbxSXpOlEFsEwDXvJT4-CW_AIjxJJw"