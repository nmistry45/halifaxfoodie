import json
import boto3
import re
import uuid




def lambda_handler(event, context):
    
    result = json.dumps(event['body']);
    print(result);
    file =  result.split(":")[1].split("\\")[1].split("\\")[0].split('"')[1]
    folder = result.split("folder")[1].split(":")[1].split("\\")[1].split("\\")[0].split('"')[1];
    print("folder name", folder);
   
    
#Read Data from file stored in AWS S3 bucket
    s3 = boto3.client("s3")
    bucketName = "recipe-upload-halifaxfoodie"
    fileName = file
    file = s3.get_object(Bucket = bucketName, Key = folder+"/"+fileName)
    fileData = str(file['Body'].read())
    
#Send file to AWS Comprehend and extract key phrases
    comprehend = boto3.client("comprehend")
    response = comprehend.detect_key_phrases(Text= fileData, LanguageCode='en')
    print(response)
    keyPhrases = response['KeyPhrases']
    print(keyPhrases)
    textList = [dict_item['Text'] for dict_item in keyPhrases]
    textString = ";".join(textList)
    textString = textString.replace("(\\\\n1|\\\\r|\\\\xc2|\\\\n10|\\\\xbd|'|\\\\\\)+", " ")
    print(textString)
# Reference for Regex: [1]AWS, “Regular expression to find a series of uppercase words in a string,” Stack Overflow, Mar. 18, 2020. [Online]. 
# Available: https://stackoverflow.com/questions/60738190/regular-expression-to-find-a-series-of-uppercase-words-in-a-string. [Accessed: Dec. 04, 2022]
    uppercaseEntities = re.findall(r'\b[A-Z]+(?:\s+[A-Z]+)*\b', textString)
    print(uppercaseEntities)
    uppercaseString = ";".join(uppercaseEntities)
    print("uppercaseString",uppercaseString)
 #Reference for DynamoDB: [2]Dynobase, “DynamoDB Python Boto3 Query Cheat Sheet [14 Examples],” DynamoDB Python Boto3 Query Cheat Sheet [14 Examples].[Online]. 
 # Available: https://dynobase.dev/dynamodb-python-with-boto3/. [Accessed: Dec. 04, 2022]   
    dynamoDb = boto3.resource('dynamodb')
    table = dynamoDb.Table('KeyIngredients')
    addItem = table.put_item(
            Item = {
                'id': str(uuid.uuid4()),
                'restaurant' : folder,
                'recipeName' : fileName,
                'KeyIngredients' : uppercaseString
            }
        )
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }