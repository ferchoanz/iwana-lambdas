#!bin/bash
date
echo '####Welcome to automated user creation Script####'
#echo 'made by: RL (ramiraptor)'
echo Make sure not sharing your screen on this proccess. We\'re
echo 'If you insert something bad or you are not sure please press ctrl+C and do the proccess again'
echo 'You need to answer the following questions'
echo 'insert an command'
# read c1
# echo Your input is $c1
# echo running $c1
# $c1
echo 'Enter your configured aws profile with DevOps Permission:'
read profile
echo Your input is $profile
echo 'Enter your Client Id associated with User Pool: eg 4jb9613i5v0123456789abcdef'
read clientId
echo Your input is $clientId
echo 'Enter the Username email for the new user: eg test2@example.com'
read username
echo Your input is $username
echo 'Enter the Password for the new user Should be an strong password Case sensitive with simbols min 10 alpha-numeric characters:'
read password
echo Your input is $password write down on a safe place
echo 'Enter the region: eg us-east-1'
read region
echo Your input is $region
echo 'Enter the User Pool Id: eg ap-northeast-1_abceEFGHi'
read userPoolId
echo Your input is $userPoolId
#echo Profile: $profile Client id: $clientId $username $password $region
#demo with first part
echo the folliwing user with this data will be created:
echo AwsProfile, ClientId, Username, Password, Region, UserPoolId
echo $profile, $clientId, $username, $password, $region, $userPoolId
read -p "Do you want to proceed? (yes/no):" confirm

case $confirm in 
	yes ) echo ok, we will proceed;
    echo doing stuff...
    echo doing cognito sign up
    aws cognito-idp sign-up --client-id $clientId --username $username --password $password --user-attributes Name=email,Value=$username --region $region --profile $profile
    echo doing cognito admin confirm
    aws cognito-idp admin-confirm-sign-up --user-pool-id $userPoolId --username $username --region $region --profile $profile
    echo doing cognito update user atributes
    aws cognito-idp admin-update-user-attributes --user-pool-id $userPoolId --username $username --user-attributes Name=email_verified,Value=true --region $region --profile $profile
    echo Check User on AWS Console
    date
		break;;
	no ) echo exiting...;
		exit;;
	* ) echo invalid response;;
esac
