# References: https://www.geeksforgeeks.org/columnar-transposition-cipher/

import math
import json
import boto3


def lambda_handler(event, context):
    e = json.loads(event['body'])
    email = e['email']
    key = e['key']
    plainText = e['plainText']
    dynamodb = boto3.client('dynamodb')
    dynamodb.put_item(TableName='cipherDetails', Item={'email': {
                      'S': email}, 'key': {'S': key}, 'plainText': {'S': plainText}})
    cipherText = encryptMessage(key, plainText)
    return {
        'statusCode': 200,
        'body': {'cipher': str(cipherText)}
    }

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
    plainText_list.extend('_' * padding)

    matrix = [plainText_list[i: i + col]
              for i in range(0, len(plainText_list), col)]

    for _ in range(col):
        i = key.index(key_list[index])
        cipher += ''.join([row[i]
                           for row in matrix])
        index += 1

    return cipher
