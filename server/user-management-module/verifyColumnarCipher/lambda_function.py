# References: https://www.geeksforgeeks.org/columnar-transposition-cipher/

import math
import json
import boto3


def lambda_handler(event, context):
    e = json.loads(event["body"])
    email = e["email"]
    ogCipherText = e["cipherText"]
    dynamodb = boto3.client("dynamodb")
    fetchInfo = dynamodb.get_item(
        TableName="cipherDetails", Key={"email": {"S": email}}
    )
    particularData = fetchInfo["Item"]
    key = particularData["key"]["S"]
    plainText = particularData["plainText"]["S"]
    cipherText = encryptMessage(key, plainText)
    print("cipherText", cipherText)
    if ogCipherText == cipherText:
        return {"statusCode": 200, 'headers': {"Access-Control-Allow-Origin": "*"}, 'body': {'cipher': "Cipher Text Validated!"}}
    else:
        return {"statusCode": 200, 'headers': {"Access-Control-Allow-Origin": "*"}, 'body': {'cipher': None}}


# Encryption


def encryptMessage(key, plainText):
    cipher = ""
    index = 0

    plainText_len = float(len(plainText))
    plainText_list = list(plainText)
    key_list = sorted(list(key))

    col = len(key)
    row = int(math.ceil(plainText_len / col))

    padding = int((row * col) - plainText_len)
    plainText_list.extend("_" * padding)

    matrix = [plainText_list[i: i + col]
              for i in range(0, len(plainText_list), col)]

    for _ in range(col):
        i = key.index(key_list[index])
        cipher += "".join([row[i] for row in matrix])
        index += 1

    return cipher
